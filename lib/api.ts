const API_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
  "http://localhost:3000";

const AUTH_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AUTH_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_AUTH_URL) ||
  "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiProduct {
  products: {
    id: number;
    names: string;
    unitaryPrice: string | null;
    description: string | null;
    characteristics: string | null;
    title: string | null;
    active: boolean | null;
    typeId: number | null;
    categoryId: number | null;
    stockId: number | null;
    taxeId: number | null;
    linkPix: string | null;
    lastUpdate: string | null;
    accountingPrice: string | null;
  };
  types: { id: number; denomination: string } | null;
  categories: { id: number; icones: string | null; nom: string | null } | null;
  stocks: { id: number; productName: string; quantity: number; accountingPrice: string | null } | null;
  taxes: { id: number; nom: string; taux: string } | null;
}

export interface ApiCategory {
  id: number;
  icones: string | null;
  nom: string | null;
}

export interface ApiOrder {
  orders: {
    id: number;
    productsId: number | null;
    clientId: string | null;
    adresseId: number | null;
    adress: string | null;
    productName: string | null;
    quantity: number | null;
    unitaryPrice: string | null;
    taxRate: string | null;
    commandeRef: string | null;
    status: string | null;
    createdAt: string;
  };
  products: { id: number; names: string } | null;
  adresses: { id: number; adress: string | null; city: string | null; country: string | null } | null;
}

export interface ApiFacture {
  factures: {
    id: number;
    dateCreation: string;
    client: string | null;
    montant: string | null;
    commandeId: number | null;
    commandeRef: string | null;
    dateEmission: string | null;
    statut: string | null;
    userId: string | null;
    paiementId: number | null;
  };
  orders: ApiOrder["orders"] | null;
  paiements: ApiPaiement | null;
}

export interface ApiPaiement {
  id: number;
  name: string | null;
  bankingInfos: string | null;
  adresse: string | null;
  receipt: string | null;
  statut: string | null;
  userId: string | null;
  montant: string | null;
  methode: string | null;
  cardLast4: string | null;
  transactionId: string | null;
  datePaiement: string | null;
}

export interface ApiAvoir {
  id: number;
  idSupprime: number | null;
  infosSupprimees: string | null;
  dateCreation: string;
  motif: string | null;
  statut: string | null;
  montant: string | null;
  clientId: string | null;
}

export interface ApiAdresse {
  id: number;
  name: string | null;
  origin: string | null;
  adress: string | null;
  complementary: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  userId: string | null;
}

export interface ApiCarrousel {
  id: number;
  name: string;
  active: boolean | null;
  createdAt: string;
}

export interface ApiCarrouselItem {
  id: number;
  carrouselId: number;
  imageId: string;
  title: string | null;
  subtitle: string | null;
  order: number | null;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: number): Promise<ApiProduct> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function searchProducts(query: string): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function filterProducts(params: {
  categoryId?: number;
  inStock?: boolean;
  minPrice?: string;
  maxPrice?: string;
}): Promise<ApiProduct[]> {
  const sp = new URLSearchParams();
  if (params.categoryId != null) sp.set("categoryId", String(params.categoryId));
  if (params.inStock) sp.set("inStock", "true");
  if (params.minPrice) sp.set("minPrice", params.minPrice);
  if (params.maxPrice) sp.set("maxPrice", params.maxPrice);
  const res = await fetch(`${API_URL}/products/filter?${sp}`);
  if (!res.ok) throw new Error("Filter failed");
  return res.json();
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchCategoryById(id: number): Promise<ApiCategory> {
  const res = await fetch(`${API_URL}/categories/${id}`);
  if (!res.ok) throw new Error("Category not found");
  return res.json();
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function fetchOrdersByClient(clientId: string): Promise<ApiOrder[]> {
  const res = await fetch(`${API_URL}/orders/client/${clientId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(data: {
  productsId: number;
  clientId: string;
  adresseId: number;
  productName: string;
  quantity: number;
  unitaryPrice: string;
  taxRate: string;
}): Promise<ApiOrder["orders"]> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function createOrderBatch(data: {
  clientId: string;
  adresseId: number;
  items: Array<{
    productsId: number;
    productName: string;
    quantity: number;
    unitaryPrice: string;
    taxRate: string;
  }>;
}): Promise<{
  commandeRef: string;
  orders: ApiOrder["orders"][];
  facture: ApiFacture["factures"];
}> {
  const res = await fetch(`${API_URL}/orders/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create orders");
  return res.json();
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function fetchInvoicesByUser(userId: string): Promise<ApiFacture[]> {
  const res = await fetch(`${API_URL}/invoices/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}

export async function payInvoice(id: number): Promise<ApiFacture["factures"]> {
  const res = await fetch(`${API_URL}/invoices/${id}/pay`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to pay invoice");
  return res.json();
}

export interface RefundRequestInput {
  motif: string;
  description: string;
}

export async function requestRefundForInvoice(
  invoiceId: number,
  data: RefundRequestInput,
): Promise<ApiAvoir> {
  const res = await fetch(`${API_URL}/invoices/${invoiceId}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Échec de la demande" }));
    throw new Error(err.error ?? "Échec de la demande");
  }
  return res.json();
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface ProcessPaymentInput {
  factureId: number;
  methode: "cb" | "virement" | "cheque";
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  bankingInfos?: string;
  adresse?: string;
}

export interface ProcessPaymentResult {
  paiement: ApiPaiement;
  facture: ApiFacture["factures"];
  transactionId: string;
}

export async function processPayment(data: ProcessPaymentInput): Promise<ProcessPaymentResult> {
  const res = await fetch(`${API_URL}/paiements/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Échec du paiement" }));
    throw new Error(err.error ?? "Échec du paiement");
  }
  return res.json();
}

export async function fetchPaiementsByUser(userId: string): Promise<ApiPaiement[]> {
  const res = await fetch(`${API_URL}/paiements/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch paiements");
  return res.json();
}

// ─── Avoirs ───────────────────────────────────────────────────────────────────

export async function fetchAvoirsByClient(clientId: string): Promise<ApiAvoir[]> {
  const res = await fetch(`${API_URL}/avoirs/client/${clientId}`);
  if (!res.ok) throw new Error("Failed to fetch avoirs");
  return res.json();
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function fetchAddressesByUser(userId: string): Promise<ApiAdresse[]> {
  const res = await fetch(`${API_URL}/adresses/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return res.json();
}

export async function createAdresse(data: Omit<ApiAdresse, "id">): Promise<ApiAdresse> {
  const res = await fetch(`${API_URL}/adresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create address");
  return res.json();
}

export async function updateAdresse(id: number, data: Partial<Omit<ApiAdresse, "id">>): Promise<ApiAdresse> {
  const res = await fetch(`${API_URL}/adresses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update address");
  return res.json();
}

export async function deleteAdresse(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/adresses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete address");
}

// ─── Panier ───────────────────────────────────────────────────────────────────

export interface ApiPanierItem {
  id: number;
  panierId: number | null;
  productId: number | null;
  quantity: number;
  unitaryPrice: string | null;
}

export interface ApiPanier {
  id: number;
  clientId: string | null;
  statutCommande: string;
  adresseLivraison: string | null;
  prixTotal: string | null;
  createdAt: string;
  updatedAt: string;
  items: ApiPanierItem[];
}

export async function getPanierByClient(clientId: string): Promise<ApiPanier> {
  const res = await fetch(`${API_URL}/panier/client/${clientId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch panier");
  return res.json();
}

export async function addOrUpdatePanierItem(
  panierId: number,
  data: { productId: number; quantity: number; unitaryPrice: string }
): Promise<{ item: ApiPanierItem; total: string }> {
  const res = await fetch(`${API_URL}/panier/${panierId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update panier item");
  return res.json();
}

export async function updatePanierItem(
  panierId: number,
  itemId: number,
  quantity: number
): Promise<{ item?: ApiPanierItem; deleted?: boolean; total: string }> {
  const res = await fetch(`${API_URL}/panier/${panierId}/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update panier item");
  return res.json();
}

export async function removePanierItem(panierId: number, itemId: number): Promise<void> {
  await fetch(`${API_URL}/panier/${panierId}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function clearPanierItems(panierId: number): Promise<void> {
  await fetch(`${API_URL}/panier/${panierId}/items`, {
    method: "DELETE",
    credentials: "include",
  });
}

// ─── Carrousel ────────────────────────────────────────────────────────────────

export async function fetchCarrousels(): Promise<ApiCarrousel[]> {
  const res = await fetch(`${API_URL}/carrousel`);
  if (!res.ok) throw new Error("Failed to fetch carrousels");
  return res.json();
}

export async function fetchCarrouselWithItems(
  id: number
): Promise<{ id: number; name: string; items: ApiCarrouselItem[] }> {
  const res = await fetch(`${API_URL}/carrousel/${id}/items`);
  if (!res.ok) throw new Error("Failed to fetch carrousel items");
  return res.json();
}

// ─── Auth-service: profile & password ─────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  role?: string;
  createdAt?: string;
}

async function authJson(path: string, init: RequestInit) {
  const res = await fetch(`${AUTH_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? data?.message ?? "Requête échouée");
  }
  return data;
}

export async function updateUserName(name: string): Promise<{ user: ApiUser }> {
  return authJson("/api/users/me", { method: "PUT", body: JSON.stringify({ name }) });
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return authJson("/api/users/me", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
