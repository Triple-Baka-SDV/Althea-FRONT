"use client";
import {
  createContext, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getPanierByClient,
  addOrUpdatePanierItem,
  updatePanierItem as apiUpdatePanierItem,
  removePanierItem,
  clearPanierItems,
  fetchProductById,
  type ApiPanierItem,
} from "@/lib/api";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  reference: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "althea_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [panierId, setPanierId] = useState<number | null>(null);

  // Maps productId → server panierItem id (needed for PUT/DELETE by item id)
  const serverItemIds = useRef<Map<number, number>>(new Map());
  // Stable ref to current items — avoids stale closures in callbacks
  const itemsRef = useRef<CartItem[]>([]);

  const { user } = useAuth();

  // ── 1. Hydrate from localStorage ───────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  // ── 2. Keep ref in sync with state ─────────────────────────────────────────
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // ── 3. Persist to localStorage ─────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  // ── 4. Sync with backend when authenticated ────────────────────────────────
  useEffect(() => {
    if (!user || !hydrated) return;

    getPanierByClient(user.id)
      .then(async (serverCart) => {
        setPanierId(serverCart.id);

        // Index server items by productId
        serverItemIds.current.clear();
        for (const si of serverCart.items) {
          if (si.productId != null) serverItemIds.current.set(si.productId, si.id);
        }

        // Push every local item to the server (upsert — safe to call multiple times)
        const localItems = itemsRef.current;
        await Promise.all(
          localItems.map((localItem) =>
            addOrUpdatePanierItem(serverCart.id, {
              productId: localItem.productId,
              quantity: localItem.qty,
              unitaryPrice: localItem.price.toFixed(2),
            }).then((res) => serverItemIds.current.set(localItem.productId, res.item.id))
          )
        );

        // Restore server-only items (e.g. items added from another browser)
        const localIds = new Set(localItems.map((i) => i.productId));
        const serverOnly = serverCart.items.filter(
          (si): si is ApiPanierItem & { productId: number } =>
            si.productId != null && !localIds.has(si.productId)
        );

        if (serverOnly.length > 0) {
          const restored: CartItem[] = [];
          await Promise.all(
            serverOnly.map(async (si) => {
              try {
                const product = await fetchProductById(si.productId);
                restored.push({
                  productId: si.productId,
                  name: product.products.names,
                  price: parseFloat(si.unitaryPrice ?? product.products.unitaryPrice ?? "0"),
                  qty: si.quantity,
                  reference: `REF-${si.productId}`,
                });
              } catch {}
            })
          );
          if (restored.length > 0) {
            setItems((prev) => [...prev, ...restored]);
          }
        }
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, hydrated]);

  // ── Mutations ──────────────────────────────────────────────────────────────

  const addItem = (item: Omit<CartItem, "qty">) => {
    const existing = itemsRef.current.find((i) => i.productId === item.productId);
    const newQty = existing ? existing.qty + 1 : 1;

    setItems((prev) =>
      existing
        ? prev.map((i) => (i.productId === item.productId ? { ...i, qty: newQty } : i))
        : [...prev, { ...item, qty: 1 }]
    );

    if (panierId) {
      addOrUpdatePanierItem(panierId, {
        productId: item.productId,
        quantity: newQty,
        unitaryPrice: item.price.toFixed(2),
      })
        .then((res) => serverItemIds.current.set(item.productId, res.item.id))
        .catch(console.error);
    }
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    if (panierId) {
      const itemId = serverItemIds.current.get(productId);
      if (itemId) {
        removePanierItem(panierId, itemId)
          .then(() => serverItemIds.current.delete(productId))
          .catch(console.error);
      }
    }
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );

    if (panierId) {
      const itemId = serverItemIds.current.get(productId);
      if (itemId) {
        apiUpdatePanierItem(panierId, itemId, qty).catch(console.error);
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    if (panierId) {
      clearPanierItems(panierId).catch(console.error);
    }
  };

  const count = items.reduce((acc, i) => acc + i.qty, 0);
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
