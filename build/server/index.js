import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useSearchParams, Link, useNavigate, useParams } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon, XIcon, ChevronRight, Search, X, SlidersHorizontal, Settings, LogOut, Phone, ShoppingCart, Menu, User, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Plus, RotateCcw, CheckCircle2, Package, XCircle, Clock, AlertCircle, Minus, CheckCircle, Truck, FileText, ChevronUp, ChevronDown, CircleIcon, CreditCard, Building2, Download, GalleryVerticalEnd, Bell, Shield, Star, Pencil, Trash2, ShoppingBag, ChevronLeft, Stethoscope, Pill, Heart, Baby, Eye, Bone, Droplets } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { createAuthClient } from "better-auth/react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, _loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url, abortDelay: ABORT_DELAY }),
      {
        onAllReady() {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url, abortDelay: ABORT_DELAY }),
      {
        onShellReady() {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error(error);
          responseStatusCode = 500;
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const CartContext = createContext(null);
const STORAGE_KEY = "althea_cart";
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  }, [items, hydrated]);
  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map(
          (i) => i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };
  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems(
      (prev) => prev.map((i) => i.productId === productId ? { ...i, qty } : i)
    );
  };
  const clearCart = () => setItems([]);
  const count = items.reduce((acc, i) => acc + i.qty, 0);
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  return /* @__PURE__ */ jsx(CartContext.Provider, { value: { items, count, total, addItem, removeItem, updateQty, clearCart }, children });
}
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
const meta$9 = () => {
  return [
    { title: "Athlea Systems - Votre pharmacie en ligne" },
    { name: "description", content: "Althea Systems - Achetez vos produits medicaux en ligne. Large choix de produits de sante, livraison rapide et service de qualite." },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" }
  ];
};
const links = () => [
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "fr", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "font-sans antialiased", children: [
      /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const categories$1 = [{ "id": "diagnostic", "slug": "diagnostic", "name": "Diagnostic & Mesure", "description": "Appareils et instruments pour le diagnostic médical", "productCount": 5 }, { "id": "protection", "slug": "protection", "name": "Protection & Hygiène", "description": "Équipements de protection individuelle et hygiène", "productCount": 5 }, { "id": "soins", "slug": "soins", "name": "Soins & Pansements", "description": "Consommables pour les soins et pansements", "productCount": 5 }, { "id": "mobilier", "slug": "mobilier", "name": "Mobilier Médical", "description": "Tables d'examen, chaises et équipements de cabinet", "productCount": 5 }, { "id": "urgences", "slug": "urgences", "name": "Urgences & Réanimation", "description": "Matériel d'urgence et de réanimation", "productCount": 4 }, { "id": "orthopedie", "slug": "orthopedie", "name": "Orthopédie & Rééducation", "description": "Attelles, béquilles et matériel de rééducation", "productCount": 4 }, { "id": "imagerie", "slug": "imagerie", "name": "Imagerie & Examen", "description": "Instruments d'examen et d'imagerie", "productCount": 3 }, { "id": "consommables", "slug": "consommables", "name": "Consommables", "description": "Consommables médicaux divers", "productCount": 3 }];
const products = /* @__PURE__ */ JSON.parse(`[{"id":1,"reference":"DIAG-001","name":"Stéthoscope Littmann Classic III","category":"diagnostic","price":89.9,"originalPrice":119.9,"badge":"Promo","available":true,"stock":47,"minOrderQty":1,"unit":"pièce","description":"Le Stéthoscope Littmann Classic III est l'instrument de référence pour les professionnels de santé. Sa double tête réversible permet l'auscultation des adultes et des pédiatries. Idéal pour la pratique en cabinet ou en milieu hospitalier.","features":["Double tête réversible adulte/pédiatrique","Membrane à accord de fréquence brevetée","Tubes doubles en PVC résistant","Longueur 69 cm","Disponible en plusieurs coloris"],"specifications":{"Matériau":"Acier inoxydable / PVC","Longueur":"69 cm","Poids":"148 g","Garantie":"5 ans","Norme":"CE Classe IIa"},"tva":20},{"id":2,"reference":"DIAG-002","name":"Tensiomètre Omron M6 Comfort","category":"diagnostic","price":59.9,"originalPrice":null,"badge":"Top vente","available":true,"stock":32,"minOrderQty":1,"unit":"pièce","description":"Le tensiomètre Omron M6 Comfort est un appareil de mesure de la pression artérielle au bras, validé cliniquement. Il propose une technologie IntelliSense pour un gonflage automatique adapté et une détection des arythmies cardiaques.","features":["Technologie IntelliSense","Détection des arythmies","Mémoire 60 mesures × 2 utilisateurs","Brassard Comfort Easy","Indicateur de positionnement du brassard"],"specifications":{"Méthode":"Oscillométrique","Plage de mesure":"0-299 mmHg","Précision pression":"±3 mmHg","Alimentation":"4 piles AA ou adaptateur","Norme":"CE, validé ESH/BHS"},"tva":20},{"id":3,"reference":"DIAG-003","name":"Oxymètre de pouls digital Nonin","category":"diagnostic","price":29.9,"originalPrice":null,"badge":null,"available":true,"stock":89,"minOrderQty":1,"unit":"pièce","description":"Oxymètre de pouls médical au doigt, de marque Nonin, leader mondial de la technologie d'oxymétrie. Mesure instantanée de la saturation en oxygène (SpO2) et de la fréquence cardiaque.","features":["Mesure SpO2 et fréquence cardiaque","Affichage OLED haute luminosité","Alarme sonore et visuelle","Résistant aux mouvements","Piles incluses"],"specifications":{"Plage SpO2":"0-100%","Précision SpO2":"±2% (70-100%)","Fréquence cardiaque":"20-300 bpm","Norme":"CE Classe IIa, FDA"},"tva":20},{"id":4,"reference":"DIAG-004","name":"Glucomètre FreeStyle Optium Neo","category":"diagnostic","price":45,"originalPrice":null,"badge":null,"available":true,"stock":28,"minOrderQty":1,"unit":"kit","description":"Lecteur de glycémie FreeStyle Optium Neo avec mesure de la cétonémie. Résultats en 5 secondes avec une très faible quantité de sang requise. Mémoire de 1000 résultats avec horodatage.","features":["Mesure glycémie et cétonémie","Résultat en 5 secondes","Mémoire 1000 résultats","Application mobile compatible","Volume sanguin : 0.6 µL"],"specifications":{"Plage glycémie":"1.1-27.8 mmol/L","Plage cétonémie":"0.0-8.0 mmol/L","Mémoire":"1000 résultats","Alimentation":"1 pile CR2032","Norme":"CE Classe IIb"},"tva":20},{"id":5,"reference":"DIAG-005","name":"Thermomètre infrarouge frontal Braun","category":"diagnostic","price":34.5,"originalPrice":null,"badge":"Nouveau","available":true,"stock":61,"minOrderQty":1,"unit":"pièce","description":"Thermomètre infrarouge sans contact Braun pour mesure frontale. Résultat en 1 seconde. Idéal pour les enfants et patients difficiles. Technologie professionnelle de précision.","features":["Sans contact, hygiénique","Résultat en 1 seconde","Mémoire 9 mesures","Indicateur fièvre par code couleur","Mode adulte/enfant/biberon"],"specifications":{"Plage mesure":"34.2°C - 42.2°C","Précision":"±0.2°C","Distance mesure":"1-5 cm","Alimentation":"2 piles AAA","Norme":"CE Classe IIa"},"tva":20},{"id":6,"reference":"PROT-001","name":"Masques FFP2 sans valve (boîte de 20)","category":"protection","price":18.9,"originalPrice":24.9,"badge":"Promo","available":true,"stock":450,"minOrderQty":5,"unit":"boîte","description":"Masques de protection respiratoire FFP2 certifiés EN 149:2001, sans valve expiratoire. Protection contre les aérosols liquides et particules solides. Adaptés aux professionnels de santé exposés aux agents infectieux.","features":["Filtration ≥ 94% des aérosols","Sans valve expiratoire","Barette nasale ajustable","Système de fixation 4 lanières","Certifié EN 149:2001+A1:2009"],"specifications":{"Norme":"EN 149:2001+A1:2009 FFP2","Filtration":"≥ 94%","Fuite totale":"≤ 8%","Conditionnement":"20 masques/boîte"},"tva":20},{"id":7,"reference":"PROT-002","name":"Gants latex sans poudre (boîte de 100)","category":"protection","price":18.9,"originalPrice":null,"badge":null,"available":true,"stock":200,"minOrderQty":5,"unit":"boîte","description":"Gants d'examen en latex naturel, sans poudre, pour une protection optimale. Haute résistance aux déchirures et excellente sensibilité tactile pour les gestes médicaux précis.","features":["Sans poudre, sans latex allergisant","Haute résistance aux déchirures","Texturation pour meilleure prise","Manchette retreinte","Disponible S/M/L/XL"],"specifications":{"Matériau":"Latex naturel","Norme":"EN 455, EN 420","Conditionnement":"100 gants/boîte","Stérilité":"Non stérile"},"tva":20},{"id":8,"reference":"PROT-003","name":"Blouses jetables à usage unique (sachet de 10)","category":"protection","price":24.9,"originalPrice":null,"badge":null,"available":true,"stock":150,"minOrderQty":3,"unit":"sachet","description":"Blouses de protection en polypropylène non tissé pour professionnels de santé. Légères, respirantes et résistantes aux fluides corporels. À usage unique pour une hygiène optimale.","features":["Non tissé PP 35 g/m²","Résistante aux fluides","Fermeture dos par liens","Manches longues élastiquées","Taille unique"],"specifications":{"Matériau":"Polypropylène non tissé","Grammage":"35 g/m²","Norme":"EN 13795","Conditionnement":"10 blouses/sachet"},"tva":20},{"id":9,"reference":"PROT-004","name":"Lunettes de protection antiéclaboussures","category":"protection","price":8.9,"originalPrice":null,"badge":null,"available":true,"stock":320,"minOrderQty":10,"unit":"pièce","description":"Lunettes de protection enveloppantes contre les éclaboussures de liquides biologiques et les projections de particules. Verres anti-buée et monture légère pour un port prolongé.","features":["Protection frontale et latérale","Verres anti-buée traités","Monture légère ergonomique","Compatible avec lunettes de vue","Réutilisables et désinfectables"],"specifications":{"Norme":"EN 166:2002","Matériau verres":"Polycarbonate","Traitement":"Anti-buée, anti-rayures"},"tva":20},{"id":10,"reference":"PROT-005","name":"Gel hydroalcoolique virucide 500ml (lot de 6)","category":"protection","price":28.9,"originalPrice":38.9,"badge":"Promo","available":true,"stock":85,"minOrderQty":1,"unit":"lot","description":"Solution hydro-alcoolique virucide pour la désinfection des mains sans eau. Conforme à la norme NF EN 14476+A2 (activité virucide). Formulation douce avec agents hydratants pour éviter le dessèchement cutané.","features":["Activité bactéricide, fongicide, virucide","Séchage rapide","Agents hydratants","Flacon pompe 500 ml","Lot de 6 flacons"],"specifications":{"Teneur alcool":"70% éthanol","Norme virucide":"EN 14476+A2","Norme bactéricide":"EN 1040","Volume":"6 × 500 ml"},"tva":20},{"id":11,"reference":"SOIN-001","name":"Compresses stériles 10×10 cm (boîte de 100)","category":"soins","price":9.9,"originalPrice":null,"badge":null,"available":true,"stock":500,"minOrderQty":10,"unit":"boîte","description":"Compresses de gaze stériles 10×10 cm, 12 plis, conditionnées individuellement. Idéales pour les soins de plaies, nettoyage et protection. Fabriquées en coton hydrophile de qualité médicale.","features":["Gaze 100% coton hydrophile","Stériles, conditionnement individuel","12 plis, non tissé","Absorbantes et douces","Sans résidu pelucheux"],"specifications":{"Dimensions":"10 × 10 cm","Plis":"12","Norme":"EN 141786","Conditionnement":"100 compresses/boîte"},"tva":20},{"id":12,"reference":"SOIN-002","name":"Pansements adhésifs assortis (boîte de 100)","category":"soins","price":12.9,"originalPrice":null,"badge":null,"available":true,"stock":300,"minOrderQty":5,"unit":"boîte","description":"Assortiment de pansements adhésifs pour plaies superficielles. Différentes tailles incluses pour s'adapter à toutes les blessures. Matière respirante, résistante à l'eau et hypoallergénique.","features":["Tissu non tissé respirant","Résistant à l'eau","Hypoallergénique","Pad absorbant stérile","Tailles assorties incluses"],"specifications":{"Norme":"EN 13726","Matériau":"Non tissé polyester","Conditionnement":"100 pansements/boîte"},"tva":20},{"id":13,"reference":"SOIN-003","name":"Bande élastique de contention 10 cm (lot de 10)","category":"soins","price":22.9,"originalPrice":null,"badge":null,"available":true,"stock":120,"minOrderQty":1,"unit":"lot","description":"Bandes élastiques de contention cohésive, auto-adhérentes, non adhérentes à la peau. Idéales pour les entorses, contusions et maintien de pansements. Couleurs assorties.","features":["Auto-adhérente, ne colle pas à la peau","Elasticité longitudinale","Lavable et réutilisable","Couleurs assorties","Largeur 10 cm, longueur 4 m"],"specifications":{"Largeur":"10 cm","Longueur":"4 m (étirée)","Conditionnement":"Lot de 10"},"tva":20},{"id":14,"reference":"SOIN-004","name":"Seringues 5 ml avec aiguille (boîte de 100)","category":"soins","price":15.9,"originalPrice":null,"badge":null,"available":true,"stock":800,"minOrderQty":10,"unit":"boîte","description":"Seringues à usage unique 5 ml avec aiguille 21G × 40 mm montée. Stériles, apyrogènes, non toxiques. Graduation claire pour dosage précis. Conditionnement individuel sous blister.","features":["Graduation mL et cc","Piston caoutchouc étanche","Aiguille biseautée tri-biseaux","Stériles et apyrogènes","Conditionnement individuel"],"specifications":{"Volume":"5 mL","Aiguille":"21G (0.8 mm) × 40 mm","Norme":"ISO 7886, EN ISO 23908","Conditionnement":"100/boîte"},"tva":20},{"id":15,"reference":"SOIN-005","name":"Kit de suture stérile (sachet de 10)","category":"soins","price":34.9,"originalPrice":null,"badge":null,"available":false,"stock":0,"minOrderQty":1,"unit":"sachet","description":"Kit de suture stérile complet pour soins des plaies lacérées. Chaque kit contient une aiguille courbe traumatique, du fil de suture résorbable et non résorbable, des ciseaux, une pince et des compresses.","features":["Aiguille courbe 1/2 cercle","Fil résorbable et non résorbable inclus","Ciseaux et pince inclus","Compresses stériles incluses","Conditionnement individuel"],"specifications":{"Norme":"EN 1639","Stérilité":"EO stérile","Conditionnement":"10 kits/sachet"},"tva":20},{"id":16,"reference":"MOB-001","name":"Table d'examen réglable électriquement","category":"mobilier","price":1290,"originalPrice":1590,"badge":"Promo","available":true,"stock":8,"minOrderQty":1,"unit":"pièce","description":"Table d'examen médical à réglage électrique en hauteur. Revêtement simili cuir facile à désinfecter. Pliante avec dossier et repose-jambes réglables. Idéale pour cabinets médicaux, spécialistes et kinésithérapeutes.","features":["Réglage électrique en hauteur 45-90 cm","Dossier et repose-jambes réglables","Revêtement simili cuir lavable","Roulettes avec freins","Capacité : 250 kg"],"specifications":{"Hauteur réglable":"45-90 cm","Dimensions plateau":"195 × 65 cm","Charge max":"250 kg","Alimentation":"230V / 50Hz","Norme":"EN 1970"},"tva":20},{"id":17,"reference":"MOB-002","name":"Tabouret médical réglable à roulettes","category":"mobilier","price":189,"originalPrice":null,"badge":null,"available":true,"stock":22,"minOrderQty":1,"unit":"pièce","description":"Tabouret médical ergonomique à réglage pneumatique en hauteur. Siège rond revêtu simili cuir, 5 roulettes pivotantes. Adapté pour toutes les disciplines médicales.","features":["Réglage pneumatique hauteur","Siège rond anti-fatigue","5 roulettes pivotantes 360°","Revêtement simili cuir lavable","Hauteur assise 45-60 cm"],"specifications":{"Hauteur assise":"45-60 cm","Diamètre siège":"38 cm","Charge max":"120 kg","Matériau":"Acier / PU"},"tva":20},{"id":18,"reference":"MOB-003","name":"Fauteuil roulant léger aluminium","category":"mobilier","price":490,"originalPrice":590,"badge":"Promo","available":true,"stock":5,"minOrderQty":1,"unit":"pièce","description":"Fauteuil roulant léger en aluminium pour utilisation en intérieur et extérieur. Pliable pour transport facile. Accoudoirs et repose-pieds amovibles. Certifié dispositif médical classe I.","features":["Cadre aluminium ultra-léger 13 kg","Pliable pour transport","Accoudoirs et repose-pieds amovibles","Roues arrière gonflables 24\\"","Frein sur les deux roues"],"specifications":{"Poids":"13 kg","Largeur assise":"45 cm","Charge max":"100 kg","Norme":"EN 12183","Classe DM":"I"},"tva":20},{"id":19,"reference":"MOB-004","name":"Paravent médical 3 panneaux aluminium","category":"mobilier","price":245,"originalPrice":null,"badge":null,"available":true,"stock":14,"minOrderQty":1,"unit":"pièce","description":"Paravent d'examen 3 panneaux à cadre aluminium léger. Tissu lavable à 60°C. Idéal pour créer un espace de confidentialité dans votre cabinet ou salle de soins.","features":["3 panneaux articulés","Cadre aluminium léger","Tissu lavable 60°C","Hauteur 180 cm","Pieds antidérapants"],"specifications":{"Hauteur":"180 cm","Largeur totale":"3 × 60 cm","Matériau cadre":"Aluminium anodisé","Tissu":"Polyester lavable 60°C"},"tva":20},{"id":20,"reference":"MOB-005","name":"Chariot de soins inox 3 étagères","category":"mobilier","price":320,"originalPrice":null,"badge":null,"available":true,"stock":11,"minOrderQty":1,"unit":"pièce","description":"Chariot de soins en acier inoxydable 3 niveaux avec rebords de sécurité. Silencieux grâce aux roulettes avec freins. Facile à désinfecter, adapté aux environnements médicaux exigeants.","features":["Acier inoxydable 304","3 étagères avec rebords","4 roulettes dont 2 avec freins","Poignée ergonomique","Facilement désinfectable"],"specifications":{"Dimensions":"90 × 50 × 90 cm","Matériau":"Inox 304","Charge par étagère":"20 kg","Charge totale":"60 kg"},"tva":20},{"id":21,"reference":"URG-001","name":"Défibrillateur semi-automatique (DAE) AED Plus","category":"urgences","price":1490,"originalPrice":null,"badge":null,"available":true,"stock":4,"minOrderQty":1,"unit":"pièce","description":"Défibrillateur externe automatisé (DAE/AED) Zoll AED Plus. Guidage vocal et visuel pour RCP. Technologie CPR-D•padz pour mesure et guidage de la compression thoracique en temps réel.","features":["Guidage vocal et visuel","Analyse du rythme cardiaque automatique","Technologie CPR-D•padz","Batterie lithium 5 ans de standby","Résistant IP55 eau et poussière"],"specifications":{"Energie":"1-200 joules (escaladé)","Temps analyse":"< 7 secondes","Batterie":"Lithium 10 ans / 300 chocs","Norme":"CE, EN 60601-1","Indice protection":"IP55"},"tva":20},{"id":22,"reference":"URG-002","name":"Kit de réanimation adulte avec masque","category":"urgences","price":24.9,"originalPrice":null,"badge":null,"available":true,"stock":67,"minOrderQty":5,"unit":"kit","description":"Kit de réanimation adulte comprenant un masque facial de réanimation avec valve unidirectionnelle, un sac de transport et des filtres bactériens/viraux. Idéal pour les équipes de premiers secours.","features":["Masque transparent adulte","Valve anti-retour unidirectionnelle","Connexion 15/22 mm standard","Filtre bactérien/viral inclus","Sac de transport étanche"],"specifications":{"Type":"Masque réanimation adulte","Connexion":"15/22 mm","Norme":"EN 13544"},"tva":20},{"id":23,"reference":"URG-003","name":"Collier cervical réglable adulte","category":"urgences","price":45.9,"originalPrice":null,"badge":null,"available":true,"stock":33,"minOrderQty":1,"unit":"pièce","description":"Collier cervical d'immobilisation réglable pour adulte. Matériau polyéthylène rigide avec revêtement mousse. Fenêtre carotidienne pour surveillance du pouls. Compatible IRM.","features":["Hauteur ajustable 4 positions","Fenêtre carotidienne intégrée","Compatible IRM","Lavable et réutilisable","Fermeture velcro"],"specifications":{"Matériau":"Polyéthylène + mousse","Taille":"Adulte universel (réglable)","Compatible IRM":"Oui","Norme":"EN 1789"},"tva":20},{"id":24,"reference":"URG-004","name":"Civière pliante aluminium","category":"urgences","price":390,"originalPrice":450,"badge":"Promo","available":true,"stock":3,"minOrderQty":1,"unit":"pièce","description":"Civière pliante légère à armature aluminium avec toile polyester résistante. Poignées rembourrées pour transport confortable. Utilisée par les équipes SMUR, sapeurs-pompiers et secouristes.","features":["Armature aluminium anodisé","Toile polyester haute résistance","Poignées rembourrées 4 positions","Repliage rapide une main","Sac de transport inclus"],"specifications":{"Poids":"8 kg","Dimensions ouvert":"210 × 58 cm","Charge max":"180 kg","Matériau":"Aluminium 6061 T6"},"tva":20},{"id":25,"reference":"ORTH-001","name":"Attelle de poignet Aircast A2","category":"orthopedie","price":29.9,"originalPrice":null,"badge":null,"available":true,"stock":45,"minOrderQty":1,"unit":"pièce","description":"Attelle de poignet rigide Aircast A2 pour entorses, tendinites et syndromes du canal carpien. Double attelle dorsale et palmaire en aluminium moulable. Disponible gauche/droite.","features":["Double attelle aluminium amovible","Moulable selon anatomie","Revêtement Coolflow respirant","Fermetures velcro réglables","Côté gauche ou droit au choix"],"specifications":{"Matériau":"Aluminium + mousse","Tailles":"S, M, L","Côté":"Gauche ou Droit"},"tva":20},{"id":26,"reference":"ORTH-002","name":"Béquilles axillaires réglables (paire)","category":"orthopedie","price":45.9,"originalPrice":null,"badge":null,"available":true,"stock":26,"minOrderQty":1,"unit":"paire","description":"Paire de béquilles axillaires en aluminium léger, réglables en hauteur. Appui axillaire anatomique et poignée ergonomique rembourrée. Embouts antidérapants fournis.","features":["Aluminium léger","Réglage 12 positions hauteur","Appui axillaire anatomique","Poignée rembourrée","Embouts antidérapants fournis"],"specifications":{"Hauteur réglable":"105-145 cm (totale)","Charge max":"100 kg","Matériau":"Aluminium anodisé"},"tva":20},{"id":27,"reference":"ORTH-003","name":"Genouillère de sport renforcée","category":"orthopedie","price":19.9,"originalPrice":null,"badge":null,"available":true,"stock":72,"minOrderQty":1,"unit":"pièce","description":"Genouillère compressive renforcée pour stabilisation du genou. Tissu élastique néoprène avec renforts latéraux et évidement patellaire. Idéale pour la rééducation et la prévention des blessures sportives.","features":["Néoprène 3 mm compressif","Renforts latéraux rigides","Évidement patellaire anatomique","Bord silicone anti-glissement","Lavable à 30°C"],"specifications":{"Matériau":"Néoprène / Nylon","Tailles":"XS à XXL","Lavage":"30°C"},"tva":20},{"id":28,"reference":"ORTH-004","name":"Semelles orthopédiques thermoformables (paire)","category":"orthopedie","price":34.9,"originalPrice":null,"badge":null,"available":true,"stock":58,"minOrderQty":1,"unit":"paire","description":"Semelles orthopédiques thermoformables à personnaliser selon l'empreinte du patient. Mousse EVA haute densité avec couche de gel viscoélastique. Absorbent les chocs et corrigent la posture.","features":["Thermoformable à 70°C","Mousse EVA haute densité","Gel viscoélastique","Couvercle en tissu respirant","Découpables aux ciseaux (38 à 47)"],"specifications":{"Matériau":"EVA + gel viscoélastique","Tailles":"37-47 (découpable)","Thermoformage":"70°C / 2 min"},"tva":20},{"id":29,"reference":"IMG-001","name":"Otoscope diagnostic LED Heine Beta 200","category":"imagerie","price":89.9,"originalPrice":null,"badge":null,"available":true,"stock":18,"minOrderQty":1,"unit":"pièce","description":"Otoscope diagnostic à LED haute performance Heine Beta 200. Illumination homogène et naturelle du conduit auditif. Grossissement 6×. Compatible avec specula jetables standard.","features":["Éclairage LED blanc pur","Grossissement 6×","Verre anti-reflet","Compatible specula jetables","Tête amovible pour stérilisation"],"specifications":{"Illumination":"LED 6000 K","Grossissement":"6×","Alimentation":"Batterie ou secteur (poignée)","Norme":"CE Classe IIa"},"tva":20},{"id":30,"reference":"IMG-002","name":"Ophtalmoscope direct Heine Mini 3000","category":"imagerie","price":245,"originalPrice":null,"badge":null,"available":true,"stock":7,"minOrderQty":1,"unit":"pièce","description":"Ophtalmoscope direct Heine Mini 3000 pour examen du fond d'œil. 12 ouvertures, 5 filtres dont le filtre rouge. Poignée à piles interchangeable compatible avec la gamme Beta.","features":["12 ouvertures différentes","5 filtres dont rouge et fente","Lentilles de -35 à +40 dioptries","Éclairage halogène 3.5V","Poignée beta compatible"],"specifications":{"Dioptries":"-35 à +40","Ouvertures":"12","Filtres":"5","Norme":"CE Classe IIa"},"tva":20},{"id":31,"reference":"IMG-003","name":"Lampe stylo diagnostic LED (lot de 6)","category":"imagerie","price":12.9,"originalPrice":null,"badge":null,"available":true,"stock":145,"minOrderQty":5,"unit":"lot","description":"Lampes stylo diagnostiques à LED pour examen clinique (réflexes, gorge, oreilles). Lumière blanche intense. Corps aluminium brossé avec clip de poche. Lot de 6 avec piles incluses.","features":["LED haute intensité 500 mcd","Corps aluminium brossé","Clip de poche inox","2 piles AAA incluses","Lot de 6 lampes"],"specifications":{"Éclairage":"LED 6500 K","Matériau":"Aluminium","Alimentation":"2 × AAA","Conditionnement":"6/lot"},"tva":20},{"id":32,"reference":"CONS-001","name":"Abaisse-langues bois stériles (sachet de 100)","category":"consommables","price":6.9,"originalPrice":null,"badge":null,"available":true,"stock":900,"minOrderQty":10,"unit":"sachet","description":"Abaisse-langues médicaux en bois de bouleau, stériles, conditionnés individuellement. Surface lisse et bords arrondis pour éviter les blessures. Longueur 15 cm.","features":["Bois de bouleau naturel","Stériles EO","Surface lisse bords arrondis","Longueur 15 cm","Emballage individuel"],"specifications":{"Matériau":"Bois de bouleau","Longueur":"15 cm","Stérilité":"Oxyde d'éthylène","Conditionnement":"100/sachet"},"tva":20},{"id":33,"reference":"CONS-002","name":"Électrodes ECG autocollantes (boîte de 100)","category":"consommables","price":14.9,"originalPrice":null,"badge":null,"available":true,"stock":350,"minOrderQty":5,"unit":"boîte","description":"Électrodes ECG à usage unique avec gel conducteur pré-appliqué. Pastille argentée, adhésif acrylique hypoallergénique. Compatibles avec tous les ECG standards (prise à pression ou agrafe).","features":["Gel conducteur pré-appliqué","Pastille argentée","Adhésif hypoallergénique","Connecteur universel snap","Condtionnement peel-off"],"specifications":{"Type":"Snap / Agrafe","Gel":"Pré-appliqué","Norme":"EN 60601-2-51","Conditionnement":"100/boîte"},"tva":20},{"id":34,"reference":"CONS-003","name":"Tubes sous vide EDTA violet 6mL (sachet de 50)","category":"consommables","price":18.9,"originalPrice":null,"badge":null,"available":true,"stock":280,"minOrderQty":5,"unit":"sachet","description":"Tubes de prélèvement sanguin sous vide avec anticoagulant EDTA K2/K3, bouchon violet. Utilisés pour numération formule sanguine (NFS), groupe sanguin, hémoglobine glyquée.","features":["Anticoagulant EDTA K2 ou K3","Bouchon violet standardisé","Volume 6 mL","Code couleur universel","Stabilité 12 mois"],"specifications":{"Anticoagulant":"EDTA K2/K3","Volume":"6 mL","Aiguille compatible":"21G standard","Conditionnement":"50 tubes/sachet","Stabilité":"12 mois"},"tva":20}]`);
const orders = [{ "id": "CMD-2025-0047", "date": "2025-04-28", "status": "livree", "statusLabel": "Livrée", "deliveryDate": "2025-05-02", "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 1, "name": "Stéthoscope Littmann Classic III", "qty": 2, "unitPrice": 89.9 }, { "productId": 6, "name": "Masques FFP2 sans valve (boîte de 20)", "qty": 10, "unitPrice": 18.9 }], "subtotal": 368.8, "tva": 73.76, "total": 442.56, "invoiceId": "FAC-2025-0047" }, { "id": "CMD-2025-0041", "date": "2025-04-15", "status": "livree", "statusLabel": "Livrée", "deliveryDate": "2025-04-19", "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 7, "name": "Gants latex sans poudre (boîte de 100)", "qty": 20, "unitPrice": 18.9 }, { "productId": 11, "name": "Compresses stériles 10×10 cm (boîte de 100)", "qty": 15, "unitPrice": 9.9 }], "subtotal": 526.5, "tva": 105.3, "total": 631.8, "invoiceId": "FAC-2025-0041" }, { "id": "CMD-2025-0039", "date": "2025-04-02", "status": "livree", "statusLabel": "Livrée", "deliveryDate": "2025-04-07", "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 2, "name": "Tensiomètre Omron M6 Comfort", "qty": 1, "unitPrice": 59.9 }, { "productId": 3, "name": "Oxymètre de pouls digital Nonin", "qty": 3, "unitPrice": 29.9 }], "subtotal": 149.6, "tva": 29.92, "total": 179.52, "invoiceId": "FAC-2025-0039" }, { "id": "CMD-2025-0035", "date": "2025-03-18", "status": "livree", "statusLabel": "Livrée", "deliveryDate": "2025-03-22", "address": { "name": "Cabinet Dr. Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 16, "name": "Table d'examen réglable électriquement", "qty": 1, "unitPrice": 1290 }], "subtotal": 1290, "tva": 258, "total": 1548, "invoiceId": "FAC-2025-0035" }, { "id": "CMD-2025-0028", "date": "2025-02-27", "status": "livree", "statusLabel": "Livrée", "deliveryDate": "2025-03-03", "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 10, "name": "Gel hydroalcoolique virucide 500ml (lot de 6)", "qty": 5, "unitPrice": 28.9 }, { "productId": 8, "name": "Blouses jetables à usage unique (sachet de 10)", "qty": 8, "unitPrice": 24.9 }, { "productId": 9, "name": "Lunettes de protection antiéclaboussures", "qty": 20, "unitPrice": 8.9 }], "subtotal": 537.5, "tva": 107.5, "total": 645, "invoiceId": "FAC-2025-0028" }, { "id": "CMD-2025-0062", "date": "2025-05-01", "status": "expediee", "statusLabel": "Expédiée", "deliveryDate": null, "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 29, "name": "Otoscope diagnostic LED Heine Beta 200", "qty": 1, "unitPrice": 89.9 }, { "productId": 31, "name": "Lampe stylo diagnostic LED (lot de 6)", "qty": 3, "unitPrice": 12.9 }], "subtotal": 128.6, "tva": 25.72, "total": 154.32, "invoiceId": "FAC-2025-0062" }, { "id": "CMD-2025-0068", "date": "2025-05-03", "status": "en_cours", "statusLabel": "En préparation", "deliveryDate": null, "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 14, "name": "Seringues 5 ml avec aiguille (boîte de 100)", "qty": 20, "unitPrice": 15.9 }, { "productId": 33, "name": "Électrodes ECG autocollantes (boîte de 100)", "qty": 5, "unitPrice": 14.9 }], "subtotal": 392.5, "tva": 78.5, "total": 471, "invoiceId": "FAC-2025-0068" }, { "id": "CMD-2025-0071", "date": "2025-05-04", "status": "en_attente", "statusLabel": "En attente de validation", "deliveryDate": null, "address": { "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France" }, "items": [{ "productId": 21, "name": "Défibrillateur semi-automatique (DAE) AED Plus", "qty": 1, "unitPrice": 1490 }], "subtotal": 1490, "tva": 298, "total": 1788, "invoiceId": null }];
const invoices = [{ "id": "FAC-2025-0047", "orderId": "CMD-2025-0047", "date": "2025-04-28", "dueDate": "2025-05-28", "status": "payee", "statusLabel": "Payée", "subtotal": 368.8, "tva": 73.76, "total": 442.56, "paidAt": "2025-05-05" }, { "id": "FAC-2025-0041", "orderId": "CMD-2025-0041", "date": "2025-04-15", "dueDate": "2025-05-15", "status": "payee", "statusLabel": "Payée", "subtotal": 526.5, "tva": 105.3, "total": 631.8, "paidAt": "2025-04-20" }, { "id": "FAC-2025-0039", "orderId": "CMD-2025-0039", "date": "2025-04-02", "dueDate": "2025-05-02", "status": "en_retard", "statusLabel": "En retard", "subtotal": 149.6, "tva": 29.92, "total": 179.52, "paidAt": null }, { "id": "FAC-2025-0035", "orderId": "CMD-2025-0035", "date": "2025-03-18", "dueDate": "2025-04-18", "status": "payee", "statusLabel": "Payée", "subtotal": 1290, "tva": 258, "total": 1548, "paidAt": "2025-03-25" }, { "id": "FAC-2025-0028", "orderId": "CMD-2025-0028", "date": "2025-02-27", "dueDate": "2025-03-27", "status": "payee", "statusLabel": "Payée", "subtotal": 537.5, "tva": 107.5, "total": 645, "paidAt": "2025-03-10" }, { "id": "FAC-2025-0062", "orderId": "CMD-2025-0062", "date": "2025-05-01", "dueDate": "2025-05-31", "status": "a_payer", "statusLabel": "À payer", "subtotal": 128.6, "tva": 25.72, "total": 154.32, "paidAt": null }, { "id": "FAC-2025-0068", "orderId": "CMD-2025-0068", "date": "2025-05-03", "dueDate": "2025-06-02", "status": "a_payer", "statusLabel": "À payer", "subtotal": 392.5, "tva": 78.5, "total": 471, "paidAt": null }];
const refunds = [{ "id": "REM-2025-0012", "orderId": "CMD-2025-0041", "date": "2025-04-22", "status": "approuvee", "statusLabel": "Approuvée", "reason": "produit_defectueux", "reasonLabel": "Produit défectueux", "items": [{ "productId": 11, "name": "Compresses stériles 10×10 cm (boîte de 100)", "qty": 5, "unitPrice": 9.9 }], "amount": 49.5, "description": "5 boîtes de compresses reçues avec emballages déchirés, non conformes aux normes de stérilité.", "resolvedAt": "2025-04-25" }, { "id": "REM-2025-0008", "orderId": "CMD-2025-0039", "date": "2025-04-10", "status": "refusee", "statusLabel": "Refusée", "reason": "erreur_commande", "reasonLabel": "Erreur de commande", "items": [{ "productId": 3, "name": "Oxymètre de pouls digital Nonin", "qty": 1, "unitPrice": 29.9 }], "amount": 29.9, "description": "Commande passée par erreur, produit déjà ouvert et utilisé. Non éligible au retour.", "resolvedAt": "2025-04-14" }, { "id": "REM-2025-0015", "orderId": "CMD-2025-0047", "date": "2025-05-01", "status": "en_attente", "statusLabel": "En attente", "reason": "produit_non_conforme", "reasonLabel": "Produit non conforme", "items": [{ "productId": 6, "name": "Masques FFP2 sans valve (boîte de 20)", "qty": 3, "unitPrice": 18.9 }], "amount": 56.7, "description": "Les masques reçus ne correspondent pas à la certification EN 149 indiquée sur l'emballage.", "resolvedAt": null }];
const user = { "name": "Dr. Marie Dupont", "email": "marie.dupont@cabinet-medical.fr", "phone": "01 42 00 11 22", "rpps": "10003456789", "specialty": "Médecine générale", "addresses": [{ "id": "addr-1", "label": "Cabinet principal", "name": "Dr. Marie Dupont", "street": "12 rue de la Paix", "city": "Paris", "zip": "75001", "country": "France", "isDefault": true }, { "id": "addr-2", "label": "Cabinet secondaire", "name": "Dr. Marie Dupont", "street": "8 avenue Gambetta", "city": "Vincennes", "zip": "94300", "country": "France", "isDefault": false }], "billing": { "companyName": "Cabinet Médical Dr. Dupont", "siret": "123 456 789 00012", "tvaIntra": "FR12345678900", "address": "12 rue de la Paix, 75001 Paris" } };
const data = {
  categories: categories$1,
  products,
  orders,
  invoices,
  refunds,
  user
};
const meta$8 = () => [
  { title: "Catalogue produits – Athlea Systems" }
];
const SORT_OPTIONS = [
  { value: "name_asc", label: "Nom A–Z" },
  { value: "name_desc", label: "Nom Z–A" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" }
];
function ProductCard({ product }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: `/products/${product.id}`,
      className: "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-square w-full bg-secondary", children: [
          /* @__PURE__ */ jsx("div", { className: "flex size-full items-center justify-center text-med-cta/30", children: /* @__PURE__ */ jsx("svg", { className: "size-14", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 1,
              d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            }
          ) }) }),
          product.badge && /* @__PURE__ */ jsx(Badge, { className: "absolute top-2 left-2 bg-med-cta text-primary-foreground hover:bg-med-cta text-xs", children: product.badge }),
          !product.available && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/60", children: /* @__PURE__ */ jsx(Badge, { className: "bg-muted-foreground text-primary-foreground hover:bg-muted-foreground", children: "Indisponible" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2 p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: product.reference }),
          /* @__PURE__ */ jsx("h3", { className: "line-clamp-2 text-sm font-medium text-med-nav leading-snug", children: product.name }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-end gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-base font-semibold text-med-nav", children: [
              product.price.toFixed(2).replace(".", ","),
              " €"
            ] }),
            product.originalPrice && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground line-through mb-0.5", children: [
              product.originalPrice.toFixed(2).replace(".", ","),
              " €"
            ] })
          ] }),
          product.available ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-med-available" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-med-available", children: "En stock" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-muted-foreground" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Rupture de stock" })
          ] })
        ] })
      ]
    }
  );
}
function CategoryFilters({
  selected,
  onToggle,
  onClear
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-med-nav", children: "Catégories" }),
      selected.length > 0 && /* @__PURE__ */ jsx("button", { onClick: onClear, className: "text-xs text-med-cta hover:underline", children: "Effacer" })
    ] }),
    data.categories.map((cat) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 py-1.5", children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          id: `cat-${cat.id}`,
          checked: selected.includes(cat.id),
          onCheckedChange: () => onToggle(cat.id)
        }
      ),
      /* @__PURE__ */ jsx(Label, { htmlFor: `cat-${cat.id}`, className: "text-sm cursor-pointer flex-1", children: cat.name }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: cat.productCount })
    ] }, cat.id))
  ] });
}
function ProduitsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("cat") ? searchParams.get("cat").split(",") : []
  );
  const [sort, setSort] = useState("name_asc");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const toggleCategory = (id) => {
    setSelectedCategories(
      (prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  const clearCategories = () => setSelectedCategories([]);
  const filtered = useMemo(() => {
    let list = [...data.products];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }
    if (onlyAvailable) {
      list = list.filter((p) => p.available);
    }
    switch (sort) {
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "name_desc":
        list.sort((a, b) => b.name.localeCompare(a.name, "fr"));
        break;
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
    }
    return list;
  }, [query, selectedCategories, sort, onlyAvailable]);
  const activeFiltersCount = selectedCategories.length + (onlyAvailable ? 1 : 0);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-8", children: [
    /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
      /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Catalogue" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav", children: "Catalogue produits" }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
        filtered.length,
        " produit",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-52", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Rechercher un produit, une référence…",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            className: "pl-9"
          }
        ),
        query && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setQuery(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: sort, onValueChange: setSort, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-44", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsx(SelectContent, { children: SORT_OPTIONS.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
      ] }),
      /* @__PURE__ */ jsxs(Sheet, { children: [
        /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "lg:hidden gap-2", children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-4" }),
          "Filtres",
          activeFiltersCount > 0 && /* @__PURE__ */ jsx(Badge, { className: "bg-med-cta text-primary-foreground hover:bg-med-cta text-xs px-1.5 min-w-5 h-5", children: activeFiltersCount })
        ] }) }),
        /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "w-72", children: [
          /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { children: "Filtres" }) }),
          /* @__PURE__ */ jsxs("div", { className: "px-1 pt-6 flex flex-col gap-6", children: [
            /* @__PURE__ */ jsx(
              CategoryFilters,
              {
                selected: selectedCategories,
                onToggle: toggleCategory,
                onClear: clearCategories
              }
            ),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "available-mobile",
                  checked: onlyAvailable,
                  onCheckedChange: (v) => setOnlyAvailable(!!v)
                }
              ),
              /* @__PURE__ */ jsx(Label, { htmlFor: "available-mobile", className: "text-sm cursor-pointer", children: "En stock uniquement" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:block w-56 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-24 rounded-xl border border-border bg-background p-5 flex flex-col gap-5", children: [
        /* @__PURE__ */ jsx(
          CategoryFilters,
          {
            selected: selectedCategories,
            onToggle: toggleCategory,
            onClear: clearCategories
          }
        ),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "available-desktop",
              checked: onlyAvailable,
              onCheckedChange: (v) => setOnlyAvailable(!!v)
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "available-desktop", className: "text-sm cursor-pointer", children: "En stock uniquement" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        selectedCategories.length > 0 && /* @__PURE__ */ jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: selectedCategories.map((catId) => {
          const cat = data.categories.find((c) => c.id === catId);
          return /* @__PURE__ */ jsxs(
            Badge,
            {
              variant: "secondary",
              className: "gap-1.5 pr-1 cursor-pointer",
              onClick: () => toggleCategory(catId),
              children: [
                cat == null ? void 0 : cat.name,
                /* @__PURE__ */ jsx(X, { className: "size-3" })
              ]
            },
            catId
          );
        }) }),
        filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "Aucun produit trouvé" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Modifiez vos filtres ou votre recherche" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => {
                setQuery("");
                setSelectedCategories([]);
                setOnlyAvailable(false);
              },
              children: "Réinitialiser les filtres"
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4", children: filtered.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.id)) })
      ] })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProduitsIndex,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            SheetPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const authClient = createAuthClient({
  baseURL: "http://localhost:3001"
});
function useAuth() {
  const [user2, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await authClient.getSession();
        if (response.data) {
          setUser(response.data.user);
          setSession(response.data.session);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getSession();
  }, []);
  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Failed to sign out:", error);
      throw error;
    }
  };
  return {
    user: user2,
    session,
    isLoading,
    isAuthenticated: !!user2,
    signOut
  };
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function UserMenu() {
  var _a;
  const { user: user2, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated || !user2) {
    return /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => navigate("/login"),
        variant: "ghost",
        className: "text-med-nav hover:bg-secondary hover:text-med-cta",
        children: "Se connecter"
      }
    );
  }
  const initials = ((_a = user2.name) == null ? void 0 : _a.split(" ").map((n) => n[0]).join("").toUpperCase()) || "U";
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: "cursor-pointer", children: /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full border border-med-nav bg-med-cta text-primary-foreground font-semibold text-sm hover:opacity-80 transition-opacity", children: initials }) }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
      /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex flex-col space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium leading-none", children: user2.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs leading-none text-muted-foreground", children: user2.email })
      ] }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/settings"), children: [
        /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: "Paramètres" })
      ] }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-red-600", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: "Déconnexion" })
      ] })
    ] })
  ] });
}
const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Produits", href: "/products" },
  { label: "Contact", href: "/contact" },
  { label: "ChatBot", href: "/chatbot" }
];
const footerLinks = [
  { label: "Mentions legales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Contact", href: "/contact" }
];
function Header() {
  const { isAuthenticated, isLoading } = useAuth();
  const { count } = useCart();
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden bg-med-nav text-primary-foreground lg:block", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Phone, { className: "size-3.5" }),
        "01 23 45 67 89"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: footerLinks.map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.href,
          className: "transition-colors hover:text-med-bg",
          children: link.label
        },
        link.href
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-3", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-10 items-center justify-center rounded-lg bg-med-cta", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-primary-foreground", children: "AT" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold text-med-nav", style: { fontFamily: "var(--font-heading)" }, children: "Athlea Systems" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "hidden items-center gap-1 lg:flex", children: navLinks.map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.href,
          className: "rounded-md px-3 py-2 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta",
          children: link.label
        },
        link.href
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 lg:flex", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Rechercher", className: "text-med-nav hover:bg-secondary hover:text-med-cta", children: /* @__PURE__ */ jsx(Search, { className: "size-5" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/basket", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", "aria-label": "Panier", className: "relative text-med-nav hover:bg-secondary hover:text-med-cta", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "size-5" }),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-med-cta text-[10px] font-semibold text-primary-foreground", children: count > 99 ? "99+" : count })
        ] }) }),
        !isLoading && /* @__PURE__ */ jsx(UserMenu, {})
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 lg:hidden", children: [
        /* @__PURE__ */ jsx(Link, { to: "/basket", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", "aria-label": "Panier", className: "relative text-med-nav", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "size-5" }),
          count > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-med-cta text-[10px] font-semibold text-primary-foreground", children: count > 99 ? "99+" : count })
        ] }) }),
        /* @__PURE__ */ jsxs(Sheet, { children: [
          /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Menu", className: "text-med-nav", children: /* @__PURE__ */ jsx(Menu, { className: "size-5" }) }) }),
          /* @__PURE__ */ jsxs(SheetContent, { side: "right", className: "w-80 bg-background", children: [
            /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { className: "text-med-nav", style: { fontFamily: "var(--font-heading)" }, children: "Menu" }) }),
            /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-1 px-4 pt-4", children: [
              navLinks.map((link) => /* @__PURE__ */ jsx(
                Link,
                {
                  to: link.href,
                  className: "rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta",
                  children: link.label
                },
                link.href
              )),
              /* @__PURE__ */ jsx("div", { className: "my-3 h-px bg-border" }),
              isAuthenticated ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/settings",
                  className: "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta",
                  children: [
                    /* @__PURE__ */ jsx(User, { className: "size-4" }),
                    "Mon profil"
                  ]
                }
              ) }) : /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/login",
                  className: "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta",
                  children: [
                    /* @__PURE__ */ jsx(User, { className: "size-4" }),
                    "Se connecter"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/search",
                  className: "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-med-nav transition-colors hover:bg-secondary hover:text-med-cta",
                  children: [
                    /* @__PURE__ */ jsx(Search, { className: "size-4" }),
                    "Rechercher"
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "my-3 h-px bg-border" }),
              footerLinks.map((link) => /* @__PURE__ */ jsx(
                Link,
                {
                  to: link.href,
                  className: "rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-med-cta",
                  children: link.label
                },
                link.href
              ))
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const footerNav = {
  boutique: [
    { label: "Accueil", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Produits", href: "/products" },
    { label: "Top Produits", href: "/products?top=true" }
  ],
  aide: [
    { label: "Contact", href: "/contact" },
    { label: "ChatBot", href: "/chatbot" },
    { label: "FAQ", href: "/faq" },
    { label: "Suivi de commande", href: "/compte/orders" }
  ],
  legal: [
    { label: "Mentions legales", href: "/mentions-legales" },
    { label: "Conditions generales d'utilisation", href: "/cgu" },
    { label: "Politique de confidentialite", href: "/confidentialite" },
    { label: "Politique de cookies", href: "/cookies" }
  ]
};
const socialLinks = [
  { icon: /* @__PURE__ */ jsx(Facebook, { className: "size-5" }), href: "#", label: "Facebook" },
  { icon: /* @__PURE__ */ jsx(Instagram, { className: "size-5" }), href: "#", label: "Instagram" },
  { icon: /* @__PURE__ */ jsx(Twitter, { className: "size-5" }), href: "#", label: "Twitter" },
  { icon: /* @__PURE__ */ jsx(Youtube, { className: "size-5" }), href: "#", label: "YouTube" }
];
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "hidden bg-med-nav text-primary-foreground lg:block", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex size-9 items-center justify-center rounded-lg bg-med-cta", children: /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-primary-foreground", children: "M" }) }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-lg font-semibold text-primary-foreground",
              style: { fontFamily: "var(--font-heading)" },
              children: "Athlea Systems"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-primary-foreground/70", children: "Votre pharmacie en ligne de confiance. Produits medicaux de qualite, livraison rapide et conseils professionnels." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 text-sm text-primary-foreground/70", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Phone, { className: "size-4" }),
            "01 23 45 67 89"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
            "contact@athleasystems.fr"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "size-4" }),
            "Paris, France"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground",
            style: { fontFamily: "var(--font-heading)" },
            children: "Boutique"
          }
        ),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2", children: footerNav.boutique.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: link.href,
            className: "text-sm text-primary-foreground/70 transition-colors hover:text-med-cta",
            children: link.label
          }
        ) }, link.href)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground",
            style: { fontFamily: "var(--font-heading)" },
            children: "Aide"
          }
        ),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2", children: footerNav.aide.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: link.href,
            className: "text-sm text-primary-foreground/70 transition-colors hover:text-med-cta",
            children: link.label
          }
        ) }, link.href)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground",
            style: { fontFamily: "var(--font-heading)" },
            children: "Informations legales"
          }
        ),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2", children: footerNav.legal.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: link.href,
            className: "text-sm text-primary-foreground/70 transition-colors hover:text-med-cta",
            children: link.label
          }
        ) }, link.href)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex items-center justify-between border-t border-primary-foreground/10 pt-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-foreground/50", children: "2026 Athlea Systems. Tous droits reserves." }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: socialLinks.map((social) => /* @__PURE__ */ jsx(
        "a",
        {
          href: social.href,
          "aria-label": social.label,
          className: "flex size-9 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 transition-colors hover:border-med-cta hover:text-med-cta",
          children: social.icon
        },
        social.label
      )) })
    ] })
  ] }) });
}
const meta$7 = () => [
  { title: "Remboursements – Athlea Systems" }
];
const STATUS_CONFIG$2 = {
  en_attente: { label: "En attente", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  approuvee: { label: "Approuvée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  refusee: { label: "Refusée", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle }
};
const REFUND_REASONS = [
  { value: "produit_defectueux", label: "Produit défectueux" },
  { value: "produit_non_conforme", label: "Produit non conforme à la description" },
  { value: "erreur_commande", label: "Erreur de commande" },
  { value: "produit_endommage", label: "Produit endommagé à la livraison" },
  { value: "delai_depasse", label: "Délai de livraison dépassé" },
  { value: "autre", label: "Autre motif" }
];
const DELIVERABLE_ORDERS = data.orders.filter((o) => o.status === "livree");
function StatusBadge$1({ status }) {
  const cfg = STATUS_CONFIG$2[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: RotateCcw };
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "size-3" }),
    cfg.label
  ] });
}
function NewRefundModal({ onClose, onSubmit }) {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const selectedOrder = DELIVERABLE_ORDERS.find((o) => o.id === orderId);
  const handleSubmit = () => {
    if (!orderId || !reason || !description.trim()) return;
    setSubmitted(true);
    onSubmit({ orderId, reason, description });
  };
  return /* @__PURE__ */ jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-lg", children: !submitted ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-med-nav", children: "Nouvelle demande de remboursement" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Commande concernée *" }),
        /* @__PURE__ */ jsxs(Select, { value: orderId, onValueChange: setOrderId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sélectionnez une commande livrée" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: DELIVERABLE_ORDERS.map((o) => /* @__PURE__ */ jsxs(SelectItem, { value: o.id, children: [
            o.id,
            " — ",
            new Date(o.date).toLocaleDateString("fr-FR"),
            " (",
            o.total.toFixed(2).replace(".", ","),
            " € TTC)"
          ] }, o.id)) })
        ] })
      ] }),
      selectedOrder && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted/50 p-3 text-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-med-nav mb-2 text-xs uppercase tracking-wide", children: "Produits de la commande" }),
        selectedOrder.items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground py-1", children: [
          /* @__PURE__ */ jsx("span", { className: "line-clamp-1 flex-1", children: item.name }),
          /* @__PURE__ */ jsxs("span", { className: "ml-2", children: [
            "×",
            item.qty
          ] })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Motif de remboursement *" }),
        /* @__PURE__ */ jsxs(Select, { value: reason, onValueChange: setReason, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choisissez un motif" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: REFUND_REASONS.map((r) => /* @__PURE__ */ jsx(SelectItem, { value: r.value, children: r.label }, r.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Description détaillée *" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: "Décrivez précisément le problème rencontré : référence des articles, quantité concernée, nature du défaut…",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            className: "min-h-28 resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "* Champs obligatoires. Votre demande sera traitée sous 3–5 jours ouvrés." })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onClose, children: "Annuler" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "bg-med-cta hover:bg-med-hover text-primary-foreground",
          onClick: handleSubmit,
          disabled: !orderId || !reason || !description.trim(),
          children: "Soumettre la demande"
        }
      )
    ] })
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-med-nav", children: "Demande envoyée" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-6 gap-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex size-16 items-center justify-center rounded-full bg-med-available/10", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-8 text-med-available" }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Votre demande de remboursement a bien été enregistrée. Notre équipe vous contactera sous ",
        /* @__PURE__ */ jsx("strong", { children: "3–5 jours ouvrés" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground", onClick: onClose, children: "Fermer" }) })
  ] }) }) });
}
function RefundCard({ refund }) {
  var _a;
  const reason = ((_a = REFUND_REASONS.find((r) => r.value === refund.reason)) == null ? void 0 : _a.label) ?? refund.reason;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-5 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-wrap mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-med-nav", children: refund.id }),
          /* @__PURE__ */ jsx(StatusBadge$1, { status: refund.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Commande ",
            refund.orderId
          ] }),
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Demandé le ",
            new Date(refund.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
          ] }),
          refund.resolvedAt && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Traité le ",
              new Date(refund.resolvedAt).toLocaleDateString("fr-FR")
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-med-nav", children: [
          refund.amount.toFixed(2).replace(".", ","),
          " € HT"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Montant demandé" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5", children: "Motif" }),
        /* @__PURE__ */ jsx("p", { className: "text-med-nav", children: reason })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5", children: "Produits concernés" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: refund.items.map((item, i) => /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
          item.name,
          " ×",
          item.qty
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5", children: "Description" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: refund.description })
    ] }),
    refund.status === "approuvee" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-med-available/30 bg-med-available/5 p-3 text-sm text-med-available", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Remboursement approuvé" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5", children: [
        "Le remboursement de ",
        refund.amount.toFixed(2).replace(".", ","),
        " € sera traité sous 5–10 jours ouvrés."
      ] })
    ] }),
    refund.status === "refusee" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Demande refusée" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-0.5", children: "Votre demande n'a pas pu être acceptée. Contactez notre service client pour plus d'informations." })
    ] })
  ] });
}
function RemboursementsPage() {
  const [showModal, setShowModal] = useState(false);
  const [extraRefunds, setExtraRefunds] = useState([]);
  const allRefunds = [...extraRefunds.reverse(), ...data.refunds];
  const pending = allRefunds.filter((r) => r.status === "en_attente");
  const resolved = allRefunds.filter((r) => r.status !== "en_attente");
  const handleNewRefund = (refund) => {
    var _a;
    const newRefund = {
      id: `REM-2025-${String(Date.now()).slice(-4)}`,
      orderId: refund.orderId,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "en_attente",
      statusLabel: "En attente",
      reason: refund.reason,
      reasonLabel: ((_a = REFUND_REASONS.find((r) => r.value === refund.reason)) == null ? void 0 : _a.label) ?? refund.reason,
      items: [],
      amount: 0,
      description: refund.description,
      resolvedAt: null
    };
    setExtraRefunds((prev) => [...prev, newRefund]);
    setShowModal(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Remboursements" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav", children: "Remboursements & retours" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "bg-med-cta hover:bg-med-hover text-primary-foreground gap-2",
            onClick: () => setShowModal(true),
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
              "Nouvelle demande"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-border bg-background p-5 flex gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "size-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-med-cta", children: /* @__PURE__ */ jsx(RotateCcw, { className: "size-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-med-nav mb-1", children: "Politique de retour Athlea Systems" }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground leading-relaxed", children: [
            "Vous disposez de ",
            /* @__PURE__ */ jsx("strong", { children: "30 jours" }),
            " après réception pour retourner un produit non ouvert. Les produits défectueux ou non conformes sont remboursés sous ",
            /* @__PURE__ */ jsx("strong", { children: "5–10 jours ouvrés" }),
            " après validation. Pour les consommables médicaux, le retour n'est accepté que si l'emballage est intact."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "all", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "all", children: [
            "Toutes (",
            allRefunds.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "pending", children: [
            "En attente",
            pending.length > 0 && /* @__PURE__ */ jsx(Badge, { className: "ml-1.5 bg-med-alert text-primary-foreground hover:bg-med-alert text-xs px-1.5 py-0 h-4", children: pending.length })
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "resolved", children: [
            "Traitées (",
            resolved.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "all", children: allRefunds.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { onNew: () => setShowModal(true) }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: allRefunds.map((r) => /* @__PURE__ */ jsx(RefundCard, { refund: r }, r.id)) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "pending", children: pending.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "size-12 text-med-available mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-med-nav", children: "Aucune demande en attente" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: pending.map((r) => /* @__PURE__ */ jsx(RefundCard, { refund: r }, r.id)) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "resolved", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: resolved.map((r) => /* @__PURE__ */ jsx(RefundCard, { refund: r }, r.id)) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    showModal && /* @__PURE__ */ jsx(
      NewRefundModal,
      {
        onClose: () => setShowModal(false),
        onSubmit: handleNewRefund
      }
    )
  ] });
}
function EmptyState({ onNew }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
    /* @__PURE__ */ jsx(Package, { className: "size-14 text-muted-foreground/40 mb-4" }),
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-med-nav", children: "Aucune demande de remboursement" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-xs", children: "Vous n'avez pas encore fait de demande de remboursement." }),
    /* @__PURE__ */ jsxs(Button, { className: "mt-5 bg-med-cta hover:bg-med-hover text-primary-foreground gap-2", onClick: onNew, children: [
      /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
      "Faire une demande"
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RemboursementsPage,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
function Accordion({
  ...props
}) {
  return /* @__PURE__ */ jsx(AccordionPrimitive.Root, { "data-slot": "accordion", ...props });
}
function AccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AccordionPrimitive.Item,
    {
      "data-slot": "accordion-item",
      className: cn("border-b last:border-b-0", className),
      ...props
    }
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
    AccordionPrimitive.Trigger,
    {
      "data-slot": "accordion-trigger",
      className: cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(ChevronDownIcon, { className: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" })
      ]
    }
  ) });
}
function AccordionContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AccordionPrimitive.Content,
    {
      "data-slot": "accordion-content",
      className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
      ...props,
      children: /* @__PURE__ */ jsx("div", { className: cn("pt-0 pb-4", className), children })
    }
  );
}
const meta$6 = ({ data: loaderData }) => [
  { title: loaderData ? `${loaderData.name} – Athlea Systems` : "Produit – Athlea Systems" }
];
function loader({ params }) {
  const product = data.products.find((p) => p.id === Number(params.id));
  if (!product) throw new Response("Not Found", { status: 404 });
  return product;
}
function ProduitDetail() {
  const params = useParams();
  const product = data.products.find((p) => p.id === Number(params.id));
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-32 text-center", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "size-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-med-nav", children: "Produit introuvable" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Ce produit n'existe pas ou a été retiré du catalogue." }),
      /* @__PURE__ */ jsx(Link, { to: "/products", children: /* @__PURE__ */ jsx(Button, { className: "mt-6 bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Retour au catalogue" }) })
    ] });
  }
  const category = data.categories.find((c) => c.id === product.category);
  const inCart = items.find((i) => i.productId === product.id);
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        reference: product.reference
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };
  const relatedProducts = data.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-8", children: [
    /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 shrink-0" }),
      /* @__PURE__ */ jsx(Link, { to: "/products", className: "hover:text-med-cta", children: "Catalogue" }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 shrink-0" }),
      category && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Link, { to: `/products?cat=${category.id}`, className: "hover:text-med-cta", children: category.name }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 shrink-0" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium truncate", children: product.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-square w-full max-w-lg rounded-2xl bg-secondary overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-full items-center justify-center text-med-cta/20", children: /* @__PURE__ */ jsx("svg", { className: "size-32", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 0.8,
            d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          }
        ) }) }),
        product.badge && /* @__PURE__ */ jsx(Badge, { className: "absolute top-4 left-4 bg-med-cta text-primary-foreground hover:bg-med-cta", children: product.badge })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [
            "Réf. ",
            product.reference
          ] }),
          category && /* @__PURE__ */ jsx(
            Link,
            {
              to: `/products?cat=${category.id}`,
              className: "text-xs text-med-cta hover:underline mb-2 inline-block",
              children: category.name
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav leading-tight mt-1", children: product.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-3xl font-bold text-med-nav", children: [
            product.price.toFixed(2).replace(".", ","),
            " €"
          ] }),
          product.originalPrice && /* @__PURE__ */ jsxs("span", { className: "text-lg text-muted-foreground line-through", children: [
            product.originalPrice.toFixed(2).replace(".", ","),
            " €"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "HT + TVA ",
            product.tva,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground -mt-3", children: [
          "Soit",
          " ",
          /* @__PURE__ */ jsxs("strong", { className: "text-med-nav", children: [
            (product.price * (1 + product.tva / 100)).toFixed(2).replace(".", ","),
            " € TTC"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: product.available ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "size-2.5 rounded-full bg-med-available" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-med-available font-medium", children: [
            "En stock (",
            product.stock,
            " unité",
            product.stock > 1 ? "s" : "",
            ")"
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "size-2.5 rounded-full bg-destructive" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-destructive font-medium", children: "Rupture de stock" })
        ] }) }),
        product.minOrderQty > 1 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground -mt-2", children: [
          "Quantité minimale de commande : ",
          product.minOrderQty,
          " ",
          product.unit
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        product.available && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: "Quantité" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg border border-border", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQty((q) => Math.max(product.minOrderQty, q - 1)),
                  className: "flex size-9 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-l-lg",
                  children: /* @__PURE__ */ jsx(Minus, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "w-12 text-center text-sm font-medium text-med-nav", children: qty }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQty((q) => Math.min(product.stock, q + 1)),
                  className: "flex size-9 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-r-lg",
                  children: /* @__PURE__ */ jsx(Plus, { className: "size-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "/ ",
              product.unit
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: handleAddToCart,
              className: "w-full gap-2 bg-med-cta hover:bg-med-hover text-primary-foreground",
              size: "lg",
              children: added ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "size-5" }),
                "Ajouté au panier !"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(ShoppingCart, { className: "size-5" }),
                "Ajouter au panier",
                inCart && ` (${inCart.qty} déjà)`
              ] })
            }
          ),
          added && /* @__PURE__ */ jsx(Link, { to: "/panier", children: /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full", children: "Voir le panier" }) })
        ] }),
        /* @__PURE__ */ jsxs(Accordion, { type: "multiple", defaultValue: ["description", "features"], className: "mt-2", children: [
          /* @__PURE__ */ jsxs(AccordionItem, { value: "description", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-sm font-medium text-med-nav", children: "Description" }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-sm text-muted-foreground leading-relaxed", children: product.description })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "features", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-sm font-medium text-med-nav", children: "Caractéristiques" }),
            /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1.5", children: product.features.map((f, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "size-4 text-med-available shrink-0 mt-0.5" }),
              f
            ] }, i)) }) })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "specs", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-sm font-medium text-med-nav", children: "Spécifications techniques" }),
            /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { children: Object.entries(product.specifications).map(([key, value]) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border last:border-0", children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 font-medium text-med-nav w-40", children: key }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-muted-foreground", children: value })
            ] }, key)) }) }) })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "delivery", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-sm font-medium text-med-nav", children: "Livraison & retours" }),
            /* @__PURE__ */ jsxs(AccordionContent, { className: "text-sm text-muted-foreground space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Package, { className: "size-4 shrink-0 mt-0.5 text-med-cta" }),
                /* @__PURE__ */ jsx("p", { children: "Livraison express 24–48h pour les commandes passées avant 14h. Transport adapté aux dispositifs médicaux." })
              ] }),
              /* @__PURE__ */ jsx("p", { children: "Retours acceptés dans les 30 jours suivant la réception pour les produits non ouverts." })
            ] })
          ] })
        ] })
      ] })
    ] }),
    relatedProducts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mt-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-6 text-xl font-semibold text-med-nav", children: "Produits similaires" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", children: relatedProducts.map((p) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/products/${p.id}`,
          className: "group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md",
          children: [
            /* @__PURE__ */ jsx("div", { className: "aspect-square bg-secondary flex items-center justify-center text-med-cta/20", children: /* @__PURE__ */ jsx("svg", { className: "size-10", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 1,
                d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              }
            ) }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-medium text-med-nav line-clamp-2", children: p.name }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-med-nav", children: [
                p.price.toFixed(2).replace(".", ","),
                " €"
              ] })
            ] })
          ]
        },
        p.id
      )) })
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProduitDetail,
  loader,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const meta$5 = () => [
  { title: "Historique des commandes – Athlea Systems" }
];
const STATUS_CONFIG$1 = {
  en_attente: { label: "En attente", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  en_cours: { label: "En préparation", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Package },
  expediee: { label: "Expédiée", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
  livree: { label: "Livrée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  annulee: { label: "Annulée", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle }
};
function OrderStatusBadge({ status }) {
  const cfg = STATUS_CONFIG$1[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: Package };
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "size-3" }),
    cfg.label
  ] });
}
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const hasInvoice = !!order.invoiceId;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-med-nav", children: order.id }),
          /* @__PURE__ */ jsx(OrderStatusBadge, { status: order.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Commandé le ",
            new Date(order.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
          ] }),
          order.deliveryDate && /* @__PURE__ */ jsxs("span", { children: [
            "Livré le ",
            new Date(order.deliveryDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-med-nav", children: [
            order.total.toFixed(2).replace(".", ","),
            " € TTC"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            order.subtotal.toFixed(2).replace(".", ","),
            " € HT"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          hasInvoice && /* @__PURE__ */ jsx(Link, { to: `/invoices`, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(FileText, { className: "size-3.5" }),
            "Facture"
          ] }) }),
          order.status === "livree" && /* @__PURE__ */ jsx(Link, { to: "/remboursements", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "size-3.5" }),
            "Retour"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setExpanded(!expanded),
            className: "text-muted-foreground hover:text-med-nav transition-colors",
            children: expanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "size-5" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "size-5" })
          }
        )
      ] })
    ] }),
    expanded && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: "Articles commandés" }),
        order.items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "size-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-med-cta/30", children: /* @__PURE__ */ jsx(Package, { className: "size-4" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: `/products/${item.productId}`,
                  className: "text-med-nav hover:text-med-cta line-clamp-1 font-medium text-sm",
                  children: item.name
                }
              ),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Qté : ",
                item.qty
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-med-nav shrink-0", children: [
            (item.unitPrice * item.qty).toFixed(2).replace(".", ","),
            " € HT"
          ] })
        ] }, i)),
        /* @__PURE__ */ jsx(Separator, { className: "mt-1" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Sous-total HT" }),
            /* @__PURE__ */ jsxs("span", { className: "text-med-nav", children: [
              order.subtotal.toFixed(2).replace(".", ","),
              " €"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "TVA" }),
            /* @__PURE__ */ jsxs("span", { className: "text-med-nav", children: [
              order.tva.toFixed(2).replace(".", ","),
              " €"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold", children: [
            /* @__PURE__ */ jsx("span", { className: "text-med-nav", children: "Total TTC" }),
            /* @__PURE__ */ jsxs("span", { className: "text-med-nav", children: [
              order.total.toFixed(2).replace(".", ","),
              " €"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-med-nav mb-0.5", children: "Adresse de livraison" }),
          /* @__PURE__ */ jsxs("p", { children: [
            order.address.name,
            " – ",
            order.address.street,
            ", ",
            order.address.zip,
            " ",
            order.address.city
          ] })
        ] })
      ] })
    ] })
  ] });
}
function CommandesPage() {
  const orders2 = [...data.orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Mes commandes" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav", children: "Historique des commandes" }),
        /* @__PURE__ */ jsx(Link, { to: "/products", children: /* @__PURE__ */ jsx(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground", size: "sm", children: "Nouvelle commande" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8", children: Object.entries(STATUS_CONFIG$1).map(([key, cfg]) => {
        const count = data.orders.filter((o) => o.status === key).length;
        if (count === 0) return null;
        const Icon = cfg.icon;
        return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `size-9 rounded-full flex items-center justify-center ${cfg.color}`, children: /* @__PURE__ */ jsx(Icon, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-med-nav", children: count }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: cfg.label })
          ] })
        ] }, key);
      }) }),
      orders2.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
        /* @__PURE__ */ jsx(Package, { className: "size-14 text-muted-foreground/40 mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-med-nav", children: "Aucune commande" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Vous n'avez pas encore passé de commande." }),
        /* @__PURE__ */ jsx(Link, { to: "/products", className: "mt-5", children: /* @__PURE__ */ jsx(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Parcourir le catalogue" }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: orders2.map((order) => /* @__PURE__ */ jsx(OrderCard, { order }, order.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CommandesPage,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const meta$4 = () => [
  { title: "Passer la commande – Athlea Systems" }
];
const PAYMENT_METHODS = [
  { id: "virement", label: "Virement bancaire", desc: "Délai de traitement : 1–2 jours ouvrés", icon: Building2 },
  { id: "cheque", label: "Chèque professionnel", desc: "À l'ordre d'Athlea Systems", icon: CreditCard },
  { id: "cb", label: "Carte bancaire", desc: "Visa, Mastercard, Amex", icon: CreditCard }
];
function CommandePage() {
  const { items, total, clearCart } = useCart();
  useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(data.user.addresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState("virement");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const tva = total * 0.2;
  const totalTTC = total * 1.2;
  const address = data.user.addresses.find((a) => a.id === selectedAddress);
  if (items.length === 0 && !confirmed) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-med-nav mb-3", children: "Votre panier est vide" }),
        /* @__PURE__ */ jsx(Link, { to: "/products", children: /* @__PURE__ */ jsx(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Parcourir le catalogue" }) })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    clearCart();
    setConfirmed(true);
    setIsSubmitting(false);
  };
  if (confirmed) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30 flex items-center justify-center px-6 py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg w-full text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex size-20 items-center justify-center rounded-full bg-med-available/10", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-10 text-med-available" }) }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-med-nav mb-3", children: "Commande confirmée !" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-2", children: [
          "Votre commande a bien été enregistrée. Vous recevrez un email de confirmation ainsi qu'une facture à l'adresse ",
          /* @__PURE__ */ jsx("strong", { children: data.user.email }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mb-8", children: [
          "Délai de livraison estimé : ",
          /* @__PURE__ */ jsx("strong", { children: "24–48h ouvrées" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/orders", children: /* @__PURE__ */ jsx(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Voir mes commandes" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/products", children: /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Continuer mes achats" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx(Link, { to: "/panier", className: "hover:text-med-cta", children: "Panier" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Commande" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav mb-8", children: "Finaliser la commande" }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base text-med-nav", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "size-4 text-med-cta" }),
              "Adresse de livraison"
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx(RadioGroup, { value: selectedAddress, onValueChange: setSelectedAddress, className: "flex flex-col gap-3", children: data.user.addresses.map((addr) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${selectedAddress === addr.id ? "border-med-cta bg-secondary/50" : "border-border hover:border-med-cta/50"}`,
                  onClick: () => setSelectedAddress(addr.id),
                  children: [
                    /* @__PURE__ */ jsx(RadioGroupItem, { value: addr.id, id: addr.id }),
                    /* @__PURE__ */ jsxs(Label, { htmlFor: addr.id, className: "cursor-pointer flex-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-medium text-med-nav text-sm", children: addr.label }),
                        addr.isDefault && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Par défaut" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: addr.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: addr.street }),
                      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                        addr.zip,
                        " ",
                        addr.city,
                        ", ",
                        addr.country
                      ] })
                    ] })
                  ]
                },
                addr.id
              )) }),
              /* @__PURE__ */ jsx(Link, { to: "/settings", className: "text-xs text-med-cta hover:underline mt-3 inline-block", children: "+ Gérer mes adresses" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base text-med-nav", children: [
              /* @__PURE__ */ jsx(Truck, { className: "size-4 text-med-cta" }),
              "Mode de livraison"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-lg border border-med-cta bg-secondary/50 p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "size-4 rounded-full border-2 border-med-cta mt-0.5 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-med-cta" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: "Livraison standard (24–48h)" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Transport adapté matériel médical · Offerte dès 150 € HT" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-med-available font-medium mt-1", children: "Gratuit" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base text-med-nav", children: [
              /* @__PURE__ */ jsx(CreditCard, { className: "size-4 text-med-cta" }),
              "Mode de paiement"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(RadioGroup, { value: paymentMethod, onValueChange: setPaymentMethod, className: "flex flex-col gap-3", children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === m.id ? "border-med-cta bg-secondary/50" : "border-border hover:border-med-cta/50"}`,
                onClick: () => setPaymentMethod(m.id),
                children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: m.id, id: `pay-${m.id}` }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: `pay-${m.id}`, className: "cursor-pointer", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: m.label }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: m.desc })
                  ] })
                ]
              },
              m.id
            )) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base text-med-nav", children: "Note de commande (optionnel)" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none min-h-20",
                placeholder: "Instructions de livraison, référence interne, numéro de bon de commande…",
                value: note,
                onChange: (e) => setNote(e.target.value)
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-24 rounded-xl border border-border bg-background p-6 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-med-nav", children: "Récapitulatif" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 max-h-60 overflow-y-auto", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground line-clamp-1 flex-1", children: [
              item.name,
              " ",
              /* @__PURE__ */ jsxs("span", { className: "text-xs", children: [
                "×",
                item.qty
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-med-nav shrink-0", children: [
              (item.price * item.qty).toFixed(2).replace(".", ","),
              " €"
            ] })
          ] }, item.productId)) }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Sous-total HT" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-med-nav", children: [
                total.toFixed(2).replace(".", ","),
                " €"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "TVA (20%)" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-med-nav", children: [
                tva.toFixed(2).replace(".", ","),
                " €"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Livraison" }),
              /* @__PURE__ */ jsx("span", { className: "text-med-available font-medium", children: "Offerte" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-med-nav", children: "Total TTC" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-med-nav", children: [
              totalTTC.toFixed(2).replace(".", ","),
              " €"
            ] })
          ] }),
          address && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-med-nav mb-1", children: "Livraison à :" }),
            /* @__PURE__ */ jsx("p", { children: address.name }),
            /* @__PURE__ */ jsx("p", { children: address.street }),
            /* @__PURE__ */ jsxs("p", { children: [
              address.zip,
              " ",
              address.city
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "w-full bg-med-cta hover:bg-med-hover text-primary-foreground",
              size: "lg",
              onClick: handleConfirm,
              disabled: isSubmitting,
              children: isSubmitting ? "Confirmation en cours…" : "Confirmer la commande"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [
            "En confirmant, vous acceptez nos",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/cgu", className: "text-med-cta hover:underline", children: "CGU" })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CommandePage,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => [
  { title: "Mes factures – Athlea Systems" }
];
const STATUS_CONFIG = {
  a_payer: { label: "À payer", color: "bg-med-alert/10 text-med-alert border-med-alert/30", icon: Clock },
  payee: { label: "Payée", color: "bg-med-available/10 text-med-available border-med-available/30", icon: CheckCircle2 },
  en_retard: { label: "En retard", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle }
};
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-muted text-muted-foreground border-border", icon: FileText };
  const Icon = cfg.icon;
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "size-3" }),
    cfg.label
  ] });
}
function PaymentModal({ invoice, onClose, onPaid }) {
  const [step, setStep] = useState("form");
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setStep("success");
    onPaid(invoice.id);
  };
  return /* @__PURE__ */ jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-md", children: step === "form" ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "text-med-nav", children: [
        "Payer la facture ",
        invoice.id
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Montant à régler : ",
        /* @__PURE__ */ jsxs("strong", { children: [
          invoice.total.toFixed(2).replace(".", ","),
          " € TTC"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted/50 p-4 text-sm space-y-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Commande" }),
          /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: invoice.orderId })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Montant HT" }),
          /* @__PURE__ */ jsxs("span", { className: "text-med-nav", children: [
            invoice.subtotal.toFixed(2).replace(".", ","),
            " €"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "TVA" }),
          /* @__PURE__ */ jsxs("span", { className: "text-med-nav", children: [
            invoice.tva.toFixed(2).replace(".", ","),
            " €"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold", children: [
          /* @__PURE__ */ jsx("span", { className: "text-med-nav", children: "Total TTC" }),
          /* @__PURE__ */ jsxs("span", { className: "text-med-nav", children: [
            invoice.total.toFixed(2).replace(".", ","),
            " €"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Numéro de carte" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "0000 0000 0000 0000" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Titulaire" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "Dr. Marie Dupont" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Expiration" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "MM / AA" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "CVV" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "000", type: "password" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center", children: "🔒 Paiement sécurisé SSL · Données non transmises" })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onClose, children: "Annuler" }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: "bg-med-cta hover:bg-med-hover text-primary-foreground gap-2",
          onClick: handlePay,
          disabled: isProcessing,
          children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "size-4" }),
            isProcessing ? "Traitement…" : `Payer ${invoice.total.toFixed(2).replace(".", ",")} €`
          ]
        }
      )
    ] })
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-med-nav", children: "Paiement confirmé" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-6 gap-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex size-16 items-center justify-center rounded-full bg-med-available/10", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-8 text-med-available" }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Votre paiement de ",
        /* @__PURE__ */ jsxs("strong", { children: [
          invoice.total.toFixed(2).replace(".", ","),
          " € TTC"
        ] }),
        " pour la facture",
        " ",
        /* @__PURE__ */ jsx("strong", { children: invoice.id }),
        " a bien été enregistré."
      ] })
    ] }),
    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground", onClick: onClose, children: "Fermer" }) })
  ] }) }) });
}
function FacturesPage() {
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paidIds, setPaidIds] = useState([]);
  const getStatus = (invoice) => {
    if (paidIds.includes(invoice.id)) return "payee";
    return invoice.status;
  };
  const invoices2 = [...data.invoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const pending = invoices2.filter((i) => getStatus(i) !== "payee");
  const paid = invoices2.filter((i) => getStatus(i) === "payee");
  const totalPending = pending.reduce((acc, i) => acc + i.total, 0);
  const InvoiceRow = ({ inv }) => {
    const status = getStatus(inv);
    const isPaid = status === "payee";
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 py-4 border-b border-border last:border-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary", children: /* @__PURE__ */ jsx(FileText, { className: "size-5 text-med-cta" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-med-nav", children: inv.id }),
            /* @__PURE__ */ jsx(StatusBadge, { status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Commande : ",
              inv.orderId
            ] }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Émise le ",
              new Date(inv.date).toLocaleDateString("fr-FR")
            ] }),
            !isPaid && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Échéance : ",
                new Date(inv.dueDate).toLocaleDateString("fr-FR")
              ] })
            ] }),
            isPaid && inv.paidAt && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Payée le ",
                new Date(inv.paidAt).toLocaleDateString("fr-FR")
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-med-nav", children: [
            inv.total.toFixed(2).replace(".", ","),
            " € TTC"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            inv.subtotal.toFixed(2).replace(".", ","),
            " € HT"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(Download, { className: "size-3.5" }),
            "PDF"
          ] }),
          !isPaid && /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              className: "bg-med-cta hover:bg-med-hover text-primary-foreground gap-1.5 text-xs",
              onClick: () => setPayingInvoice(inv),
              children: [
                /* @__PURE__ */ jsx(CreditCard, { className: "size-3.5" }),
                "Payer"
              ]
            }
          )
        ] })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Mes factures" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav mb-8", children: "Gestion des factures" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Total à régler" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-destructive", children: [
            totalPending.toFixed(2).replace(".", ","),
            " € TTC"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            pending.length,
            " facture",
            pending.length !== 1 ? "s" : "",
            " en attente"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Factures payées" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-med-available", children: paid.length }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            paid.reduce((acc, i) => acc + i.total, 0).toFixed(2).replace(".", ","),
            " € TTC réglé"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "En retard" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-med-alert", children: invoices2.filter((i) => getStatus(i) === "en_retard").length }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Nécessite une action immédiate" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "all", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "all", children: [
            "Toutes (",
            invoices2.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "pending", children: [
            "À payer (",
            pending.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "paid", children: [
            "Payées (",
            paid.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "all", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-background px-5", children: invoices2.map((inv) => /* @__PURE__ */ jsx(InvoiceRow, { inv }, inv.id)) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "pending", children: pending.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "size-12 text-med-available mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium text-med-nav", children: "Toutes vos factures sont réglées !" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-background px-5", children: pending.map((inv) => /* @__PURE__ */ jsx(InvoiceRow, { inv }, inv.id)) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "paid", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-background px-5", children: paid.map((inv) => /* @__PURE__ */ jsx(InvoiceRow, { inv }, inv.id)) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    payingInvoice && /* @__PURE__ */ jsx(
      PaymentModal,
      {
        invoice: payingInvoice,
        onClose: () => setPayingInvoice(null),
        onPaid: (id) => {
          setPaidIds((prev) => [...prev, id]);
          setPayingInvoice(null);
        }
      }
    )
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FacturesPage,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function ProduitsLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProduitsLayout
}, Symbol.toStringTag, { value: "Module" }));
function FieldGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "field-group",
      className: cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      ),
      ...props
    }
  );
}
const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "field",
      "data-orientation": orientation,
      className: cn(fieldVariants({ orientation }), className),
      ...props
    }
  );
}
function FieldLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Label,
    {
      "data-slot": "field-label",
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      ),
      ...props
    }
  );
}
function FieldDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "field-description",
      className: cn(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      ...props
    }
  );
}
function SignupForm({
  className,
  ...props
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const validateForm = () => {
    if (!name.trim()) return "Le nom est requis";
    if (!email.trim()) return "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email invalide";
    if (password.length < 8) return "Le mot de passe doit faire au minimum 8 caractères";
    if (password !== confirmPassword) return "Les mots de passe ne correspondent pas";
    return null;
  };
  const signUp = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setIsLoading(false);
            navigate("/");
          },
          onError: (ctx) => {
            var _a;
            setIsLoading(false);
            setError(((_a = ctx.error) == null ? void 0 : _a.message) || "Une erreur est survenue lors de l'inscription");
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      setError((err == null ? void 0 : err.message) || "Une erreur inattendue s'est produite");
    }
  };
  return /* @__PURE__ */ jsx("form", { onSubmit: signUp, className: cn("flex flex-col gap-6", className), ...props, children: /* @__PURE__ */ jsxs(FieldGroup, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Créer un compte" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-balance text-muted-foreground", children: "Inscrivez-vous pour accéder à votre compte" })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 flex-shrink-0" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "name", children: "Nom et prénom" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "name",
          type: "text",
          placeholder: "John Doe",
          value: name,
          onChange: (e) => setName(e.target.value),
          required: true,
          disabled: isLoading
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "email",
          type: "email",
          placeholder: "m@example.com",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsx(FieldDescription, { children: "Nous ne partagerons jamais votre email avec qui que ce soit." })
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "password", children: "Mot de passe" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "password",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsxs(FieldDescription, { className: password.length >= 8 ? "text-green-600" : "", children: [
        password.length >= 8 ? "✓ " : "",
        "Votre mot de passe doit comporter au minimum 8 caractères."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "confirm-password", children: "Confirmer le mot de passe" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "confirm-password",
          type: "password",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          required: true,
          disabled: isLoading
        }
      ),
      confirmPassword && password === confirmPassword && /* @__PURE__ */ jsx(FieldDescription, { className: "text-green-600", children: "✓ Les mots de passe correspondent" })
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Inscription en cours..." : "Créer mon compte" }),
      /* @__PURE__ */ jsxs(FieldDescription, { className: "px-6 text-center", children: [
        "Déjà un compte?",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/login", className: "underline underline-offset-4 hover:text-foreground", children: "Se connecter" })
      ] })
    ] })
  ] }) });
}
const SignupPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-svh lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-6 md:p-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 md:justify-start", children: /* @__PURE__ */ jsxs("a", { href: "#", className: "flex items-center gap-2 font-medium", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(GalleryVerticalEnd, { className: "size-4" }) }),
        "Athlea Systems"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ jsx(SignupForm, {}) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative hidden bg-muted lg:block", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/placeholder.svg",
        alt: "Image",
        className: "absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      }
    ) })
  ] });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SignupPage
}, Symbol.toStringTag, { value: "Module" }));
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        }
      )
    }
  );
}
const meta$2 = () => [
  { title: "Paramètres – Athlea Systems" }
];
function SuccessAlert({ message }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800", children: [
    /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 flex-shrink-0" }),
    /* @__PURE__ */ jsx("p", { children: message })
  ] });
}
function ProfileTab() {
  const [name, setName] = useState(data.user.name);
  const [phone, setPhone] = useState(data.user.phone);
  const [rpps, setRpps] = useState(data.user.rpps);
  const [specialty, setSpecialty] = useState(data.user.specialty);
  const [saved, setSaved] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };
  return /* @__PURE__ */ jsx("form", { onSubmit: handleSave, className: "flex flex-col gap-6", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Informations personnelles" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Vos informations professionnelles affichées sur les commandes et factures." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-4", children: [
      saved && /* @__PURE__ */ jsx(SuccessAlert, { message: "Profil mis à jour avec succès" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nom et prénom" }),
          /* @__PURE__ */ jsx(Input, { id: "name", value: name, onChange: (e) => setName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Adresse e-mail" }),
          /* @__PURE__ */ jsx(Input, { id: "email", type: "email", value: data.user.email, disabled: true, className: "cursor-not-allowed" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Téléphone" }),
          /* @__PURE__ */ jsx(Input, { id: "phone", type: "tel", value: phone, onChange: (e) => setPhone(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "specialty", children: "Spécialité médicale" }),
          /* @__PURE__ */ jsx(Input, { id: "specialty", value: specialty, onChange: (e) => setSpecialty(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "rpps", children: "Numéro RPPS" }),
        /* @__PURE__ */ jsx(Input, { id: "rpps", value: rpps, onChange: (e) => setRpps(e.target.value), placeholder: "11 chiffres" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Répertoire Partagé des Professionnels intervenant dans le système de Santé" })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "self-start bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Enregistrer les modifications" })
    ] })
  ] }) });
}
function AddressesTab() {
  const [addresses, setAddresses] = useState(data.user.addresses);
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);
  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };
  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Adresses de livraison" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Gérez vos adresses pour les livraisons de commandes." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", className: "bg-med-cta hover:bg-med-hover text-primary-foreground gap-1.5", children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
        "Ajouter"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-3", children: [
      saved && /* @__PURE__ */ jsx(SuccessAlert, { message: "Adresse par défaut mise à jour" }),
      addresses.map((addr) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rounded-lg border p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${addr.isDefault ? "border-med-cta bg-secondary/30" : "border-border"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "size-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-med-cta", children: /* @__PURE__ */ jsx(MapPin, { className: "size-4" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: addr.label }),
                  addr.isDefault && /* @__PURE__ */ jsx(Badge, { className: "bg-med-cta text-primary-foreground hover:bg-med-cta text-xs", children: "Par défaut" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: addr.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: addr.street }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  addr.zip,
                  " ",
                  addr.city,
                  ", ",
                  addr.country
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              !addr.isDefault && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "text-xs gap-1", onClick: () => handleSetDefault(addr.id), children: [
                /* @__PURE__ */ jsx(Star, { className: "size-3.5" }),
                "Par défaut"
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "text-xs gap-1", children: [
                /* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }),
                "Modifier"
              ] }),
              !addr.isDefault && /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-xs gap-1 text-destructive hover:text-destructive",
                  onClick: () => handleDelete(addr.id),
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }),
                    "Supprimer"
                  ]
                }
              )
            ] })
          ]
        },
        addr.id
      ))
    ] })
  ] }) });
}
function BillingTab() {
  const [companyName, setCompanyName] = useState(data.user.billing.companyName);
  const [siret, setSiret] = useState(data.user.billing.siret);
  const [tvaIntra, setTvaIntra] = useState(data.user.billing.tvaIntra);
  const [billingAddress, setBillingAddress] = useState(data.user.billing.address);
  const [saved, setSaved] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Informations de facturation" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Ces informations apparaissent sur toutes vos factures Athlea Systems." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-4", children: [
        saved && /* @__PURE__ */ jsx(SuccessAlert, { message: "Informations de facturation enregistrées" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "companyName", children: "Raison sociale / Cabinet" }),
            /* @__PURE__ */ jsx(Input, { id: "companyName", value: companyName, onChange: (e) => setCompanyName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "siret", children: "SIRET" }),
            /* @__PURE__ */ jsx(Input, { id: "siret", value: siret, onChange: (e) => setSiret(e.target.value), placeholder: "000 000 000 00000" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "tvaIntra", children: "N° TVA intracommunautaire" }),
            /* @__PURE__ */ jsx(Input, { id: "tvaIntra", value: tvaIntra, onChange: (e) => setTvaIntra(e.target.value), placeholder: "FR00000000000" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "billingAddress", children: "Adresse de facturation" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "billingAddress",
              value: billingAddress,
              onChange: (e) => setBillingAddress(e.target.value),
              className: "resize-none",
              rows: 2
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "self-start bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Enregistrer" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Documents fiscaux" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Téléchargez vos documents comptables annuels." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: ["2025", "2024"].map((year) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-med-nav", children: [
            "Récapitulatif achats ",
            year
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Toutes commandes et factures ",
            year
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: "Télécharger PDF" })
      ] }, year)) }) })
    ] })
  ] });
}
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orderConfirmed: true,
    orderShipped: true,
    orderDelivered: true,
    invoiceDue: true,
    invoiceOverdue: true,
    refundUpdated: true,
    newProducts: false,
    promotions: false,
    newsletter: false
  });
  const [saved, setSaved] = useState(false);
  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const sections = [
    {
      title: "Commandes",
      items: [
        { key: "orderConfirmed", label: "Confirmation de commande", desc: "Reçu lors de chaque nouvelle commande" },
        { key: "orderShipped", label: "Expédition", desc: "Notification lorsque votre commande est expédiée" },
        { key: "orderDelivered", label: "Livraison", desc: "Confirmation de livraison" }
      ]
    },
    {
      title: "Factures",
      items: [
        { key: "invoiceDue", label: "Rappel d'échéance", desc: "7 jours avant la date d'échéance" },
        { key: "invoiceOverdue", label: "Facture en retard", desc: "Alerte pour les factures dépassées" }
      ]
    },
    {
      title: "Remboursements",
      items: [
        { key: "refundUpdated", label: "Mise à jour remboursement", desc: "Approbation ou refus de vos demandes" }
      ]
    },
    {
      title: "Marketing",
      items: [
        { key: "newProducts", label: "Nouveaux produits", desc: "Alertes sur les nouvelles références du catalogue" },
        { key: "promotions", label: "Promotions", desc: "Offres et remises exclusives" },
        { key: "newsletter", label: "Newsletter mensuelle", desc: "Actualités médicales et produits du mois" }
      ]
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Préférences de notifications" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Gérez les e-mails envoyés par Athlea Systems." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-6", children: [
      saved && /* @__PURE__ */ jsx(SuccessAlert, { message: "Préférences de notifications enregistrées" }),
      sections.map((section, si) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: section.title }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: section.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: item.label }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.desc })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              checked: prefs[item.key],
              onCheckedChange: () => toggle(item.key)
            }
          )
        ] }, item.key)) }),
        si < sections.length - 1 && /* @__PURE__ */ jsx(Separator, { className: "mt-5" })
      ] }, si)),
      /* @__PURE__ */ jsx(Button, { className: "self-start bg-med-cta hover:bg-med-hover text-primary-foreground", onClick: handleSave, children: "Enregistrer les préférences" })
    ] })
  ] }) });
}
function SecurityTab() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const handlePasswordSave = (e) => {
    e.preventDefault();
    setPwdError("");
    if (newPwd !== confirmPwd) {
      setPwdError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPwd.length < 8) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setPwdSaved(true);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setTimeout(() => setPwdSaved(false), 3e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Changer le mot de passe" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Utilisez un mot de passe fort d'au moins 8 caractères." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handlePasswordSave, className: "flex flex-col gap-4", children: [
        pwdSaved && /* @__PURE__ */ jsx(SuccessAlert, { message: "Mot de passe mis à jour avec succès" }),
        pwdError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 flex-shrink-0" }),
          /* @__PURE__ */ jsx("p", { children: pwdError })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "currentPwd", children: "Mot de passe actuel" }),
          /* @__PURE__ */ jsx(Input, { id: "currentPwd", type: "password", value: currentPwd, onChange: (e) => setCurrentPwd(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "newPwd", children: "Nouveau mot de passe" }),
          /* @__PURE__ */ jsx(Input, { id: "newPwd", type: "password", value: newPwd, onChange: (e) => setNewPwd(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPwd", children: "Confirmer le nouveau mot de passe" }),
          /* @__PURE__ */ jsx(Input, { id: "confirmPwd", type: "password", value: confirmPwd, onChange: (e) => setConfirmPwd(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "self-start bg-med-cta hover:bg-med-hover text-primary-foreground", children: "Mettre à jour le mot de passe" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Authentification à deux facteurs" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Ajoutez une couche de sécurité supplémentaire à votre compte." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: "Authentification par application" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Utilisez une application comme Google Authenticator ou Authy" })
        ] }),
        /* @__PURE__ */ jsx(Switch, {})
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Sessions actives" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Gérez les appareils connectés à votre compte." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "flex flex-col gap-3", children: [
        { device: "Chrome · Windows", location: "Paris, France", current: true },
        { device: "Safari · iPhone", location: "Paris, France", current: false }
      ].map((session, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-med-nav", children: session.device }),
            session.current && /* @__PURE__ */ jsx(Badge, { className: "bg-med-available text-primary-foreground hover:bg-med-available text-xs", children: "Session actuelle" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: session.location })
        ] }),
        !session.current && /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "text-destructive border-destructive/50 hover:bg-destructive/10 text-xs", children: "Déconnecter" })
      ] }, i)) })
    ] })
  ] });
}
function SettingsPage() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Paramètres" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav mb-8", children: "Paramètres du compte" }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "profile", orientation: "vertical", className: "flex flex-col sm:flex-row gap-6", children: [
        /* @__PURE__ */ jsx(TabsList, { className: "flex sm:flex-col h-auto sm:w-52 shrink-0 justify-start bg-background border border-border rounded-xl p-2 gap-1", children: [
          { value: "profile", label: "Profil", icon: User },
          { value: "addresses", label: "Adresses", icon: MapPin },
          { value: "billing", label: "Facturation", icon: Building2 },
          { value: "notifications", label: "Notifications", icon: Bell },
          { value: "security", label: "Sécurité", icon: Shield }
        ].map(({ value, label, icon: Icon }) => /* @__PURE__ */ jsxs(
          TabsTrigger,
          {
            value,
            className: "justify-start gap-2.5 px-3 py-2.5 text-sm data-[state=active]:bg-secondary data-[state=active]:text-med-cta w-full",
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "size-4" }),
              label
            ]
          },
          value
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(TabsContent, { value: "profile", children: /* @__PURE__ */ jsx(ProfileTab, {}) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "addresses", children: /* @__PURE__ */ jsx(AddressesTab, {}) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "billing", children: /* @__PURE__ */ jsx(BillingTab, {}) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "notifications", children: /* @__PURE__ */ jsx(NotificationsTab, {}) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "security", children: /* @__PURE__ */ jsx(SecurityTab, {}) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SettingsPage,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => [
  { title: "Mon panier – Athlea Systems" }
];
function PanierPage() {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart();
  const tva = total * 0.2;
  const totalTTC = total * 1.2;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-med-cta", children: "Accueil" }),
        /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
        /* @__PURE__ */ jsx("span", { className: "text-med-nav font-medium", children: "Mon panier" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-med-nav", children: "Mon panier" }),
        count > 0 && /* @__PURE__ */ jsxs(Badge, { className: "bg-med-cta text-primary-foreground hover:bg-med-cta", children: [
          count,
          " article",
          count > 1 ? "s" : ""
        ] })
      ] }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-24 text-center", children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "size-16 text-muted-foreground/50 mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-med-nav", children: "Votre panier est vide" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-xs", children: "Parcourez notre catalogue et ajoutez des produits à votre panier." }),
        /* @__PURE__ */ jsx(Link, { to: "/products", className: "mt-6", children: /* @__PURE__ */ jsxs(Button, { className: "bg-med-cta hover:bg-med-hover text-primary-foreground gap-2", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "size-4" }),
          "Continuer mes achats"
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              count,
              " article",
              count > 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: clearCart,
                className: "text-sm text-destructive hover:underline flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }),
                  "Vider le panier"
                ]
              }
            )
          ] }),
          items.map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex gap-4 rounded-xl border border-border bg-background p-4",
              children: [
                /* @__PURE__ */ jsx("div", { className: "size-20 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-med-cta/30", children: /* @__PURE__ */ jsx("svg", { className: "size-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 1,
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  }
                ) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.reference }),
                      /* @__PURE__ */ jsx(
                        Link,
                        {
                          to: `/products/${item.productId}`,
                          className: "text-sm font-medium text-med-nav hover:text-med-cta leading-tight line-clamp-2",
                          children: item.name
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => removeItem(item.productId),
                        className: "text-muted-foreground hover:text-destructive transition-colors shrink-0",
                        "aria-label": "Supprimer",
                        children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg border border-border", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => updateQty(item.productId, item.qty - 1),
                          className: "flex size-8 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-l-lg",
                          children: /* @__PURE__ */ jsx(Minus, { className: "size-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "w-10 text-center text-sm font-medium text-med-nav", children: item.qty }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => updateQty(item.productId, item.qty + 1),
                          className: "flex size-8 items-center justify-center text-med-nav hover:bg-secondary transition-colors rounded-r-lg",
                          children: /* @__PURE__ */ jsx(Plus, { className: "size-3.5" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-med-nav", children: [
                        (item.price * item.qty).toFixed(2).replace(".", ","),
                        " € HT"
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        item.price.toFixed(2).replace(".", ","),
                        " € / unité"
                      ] })
                    ] })
                  ] })
                ] })
              ]
            },
            item.productId
          )),
          /* @__PURE__ */ jsx(Link, { to: "/products", className: "mt-2", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", children: [
            /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 rotate-180" }),
            "Continuer mes achats"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-24 rounded-xl border border-border bg-background p-6 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-med-nav", children: "Récapitulatif" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Sous-total HT" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-med-nav", children: [
                total.toFixed(2).replace(".", ","),
                " €"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "TVA (20%)" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-med-nav", children: [
                tva.toFixed(2).replace(".", ","),
                " €"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Livraison" }),
              /* @__PURE__ */ jsx("span", { className: "text-med-available font-medium", children: "Offerte" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-med-nav", children: "Total TTC" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-med-nav", children: [
              totalTTC.toFixed(2).replace(".", ","),
              " €"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/commande", children: /* @__PURE__ */ jsx(Button, { className: "w-full bg-med-cta hover:bg-med-hover text-primary-foreground", size: "lg", children: "Passer la commande" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Paiement sécurisé · Livraison 24–48h" }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsx(Link, { to: "/orders", className: "text-xs text-med-cta hover:underline text-center", children: "Historique des commandes" }),
            /* @__PURE__ */ jsx(Link, { to: "/invoices", className: "text-xs text-med-cta hover:underline text-center", children: "Gérer mes factures" })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PanierPage,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const slides = [
  {
    id: 1,
    title: "Offre speciale : -20% sur les equipements medicaux",
    description: "Profitez de notre promotion exceptionnelle sur une large selection d'equipements medicaux professionnels. Offre limitee.",
    ctaText: "Decouvrir l'offre",
    ctaLink: "/products",
    bgColor: "bg-med-nav"
  },
  {
    id: 2,
    title: "Nouveautes : Gamme de soins dermatologiques",
    description: "Decouvrez notre nouvelle gamme de produits dermatologiques recommandes par les professionnels de sante.",
    ctaText: "Voir la gamme",
    ctaLink: "/categories",
    bgColor: "bg-med-cta"
  },
  {
    id: 3,
    title: "Livraison gratuite des 49 euros d'achat",
    description: "Commandez vos produits de sante en toute serenite. Livraison offerte partout en France metropolitaine.",
    ctaText: "Commander maintenant",
    ctaLink: "/products",
    bgColor: "bg-med-nav"
  }
];
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);
  useEffect(() => {
    const interval = setInterval(nextSlide, 5e3);
    return () => clearInterval(interval);
  }, [nextSlide]);
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden", "aria-label": "Promotions", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex transition-transform duration-500 ease-in-out",
        style: { transform: `translateX(-${currentSlide * 100}%)` },
        children: slides.map((slide) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `flex min-w-full flex-col items-center justify-center px-6 py-20 text-primary-foreground md:py-28 lg:py-36 ${slide.bgColor}`,
            children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-3xl flex-col items-center gap-6 text-center", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  className: "text-2xl leading-tight font-semibold text-balance md:text-4xl lg:text-5xl",
                  style: { fontFamily: "var(--font-heading)" },
                  children: slide.title
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "max-w-xl text-base leading-relaxed text-primary-foreground/90 md:text-lg", children: slide.description }),
              /* @__PURE__ */ jsx(Link, { to: slide.ctaLink, children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "lg",
                  className: "bg-primary-foreground text-med-nav hover:bg-primary-foreground/90",
                  children: slide.ctaText
                }
              ) })
            ] })
          },
          slide.id
        ))
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "absolute top-1/2 left-4 -translate-y-1/2 bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30 hover:text-primary-foreground",
        onClick: prevSlide,
        "aria-label": "Diapositive precedente",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5" })
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "absolute top-1/2 right-4 -translate-y-1/2 bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30 hover:text-primary-foreground",
        onClick: nextSlide,
        "aria-label": "Diapositive suivante",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2", children: slides.map((_, index) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setCurrentSlide(index),
        className: `h-2.5 rounded-full transition-all ${index === currentSlide ? "w-8 bg-primary-foreground" : "w-2.5 bg-primary-foreground/50"}`,
        "aria-label": `Aller a la diapositive ${index + 1}`
      },
      index
    )) })
  ] });
}
function FixedTextSection() {
  return /* @__PURE__ */ jsx("section", { className: "bg-secondary px-6 py-12 md:py-16", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl text-center", children: [
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "mb-4 text-2xl font-semibold text-med-nav md:text-3xl",
        style: { fontFamily: "var(--font-heading)" },
        children: "Votre sante, notre priorite"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl text-base leading-relaxed text-med-nav/80 md:text-lg", children: "MediShop est votre partenaire sante en ligne. Nous proposons une large gamme de produits medicaux, d'equipements de soin et de bien-etre, selectionnes avec soin par nos pharmaciens. Livraison rapide, prix competitifs et conseils personnalises pour repondre a tous vos besoins." })
  ] }) });
}
const categories = [
  {
    id: 1,
    name: "Equipements medicaux",
    icon: /* @__PURE__ */ jsx(Stethoscope, { className: "size-8" }),
    href: "/categories/equipements-medicaux",
    productCount: 124
  },
  {
    id: 2,
    name: "Medicaments",
    icon: /* @__PURE__ */ jsx(Pill, { className: "size-8" }),
    href: "/categories/medicaments",
    productCount: 356
  },
  {
    id: 3,
    name: "Soins cardiovasculaires",
    icon: /* @__PURE__ */ jsx(Heart, { className: "size-8" }),
    href: "/categories/soins-cardiovasculaires",
    productCount: 89
  },
  {
    id: 4,
    name: "Puericulture",
    icon: /* @__PURE__ */ jsx(Baby, { className: "size-8" }),
    href: "/categories/puericulture",
    productCount: 203
  },
  {
    id: 5,
    name: "Optique",
    icon: /* @__PURE__ */ jsx(Eye, { className: "size-8" }),
    href: "/categories/optique",
    productCount: 67
  },
  {
    id: 6,
    name: "Orthopedie",
    icon: /* @__PURE__ */ jsx(Bone, { className: "size-8" }),
    href: "/categories/orthopedie",
    productCount: 145
  },
  {
    id: 7,
    name: "Dermatologie",
    icon: /* @__PURE__ */ jsx(Droplets, { className: "size-8" }),
    href: "/categories/dermatologie",
    productCount: 178
  },
  {
    id: 8,
    name: "Hygiene & Prevention",
    icon: /* @__PURE__ */ jsx(Shield, { className: "size-8" }),
    href: "/categories/hygiene-prevention",
    productCount: 234
  }
];
function CategoriesGrid() {
  return /* @__PURE__ */ jsx("section", { className: "px-6 py-14 md:py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10 text-center", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          className: "mb-3 text-2xl font-semibold text-med-nav md:text-3xl",
          style: { fontFamily: "var(--font-heading)" },
          children: "Nos categories"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground", children: "Parcourez notre selection de produits medicaux par categorie" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", children: categories.map((category) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: category.href,
        className: "group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-all hover:border-med-cta hover:shadow-md",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex size-16 items-center justify-center rounded-full bg-secondary text-med-cta transition-colors group-hover:bg-med-cta group-hover:text-primary-foreground", children: category.icon }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "text-sm font-semibold text-med-nav md:text-base",
                style: { fontFamily: "var(--font-heading)" },
                children: category.name
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              category.productCount,
              " produits"
            ] })
          ] })
        ]
      },
      category.id
    )) })
  ] }) });
}
const topProducts = [
  {
    id: 1,
    name: "Tensiometre automatique bras",
    price: "49,90",
    originalPrice: "69,90",
    badge: "Promo",
    available: true
  },
  {
    id: 2,
    name: "Oxymetre de pouls digital",
    price: "29,90",
    available: true
  },
  {
    id: 3,
    name: "Thermometre infrarouge sans contact",
    price: "34,50",
    badge: "Top vente",
    available: true
  },
  {
    id: 4,
    name: "Kit premiers secours complet",
    price: "24,90",
    available: true
  },
  {
    id: 5,
    name: "Masques chirurgicaux (boite de 50)",
    price: "12,90",
    available: true
  },
  {
    id: 6,
    name: "Gel hydroalcoolique 500ml",
    price: "8,90",
    originalPrice: "11,90",
    badge: "Promo",
    available: true
  },
  {
    id: 7,
    name: "Bande de contention elastique",
    price: "15,50",
    available: false
  },
  {
    id: 8,
    name: "Stethoscope professionnel",
    price: "89,90",
    badge: "Nouveau",
    available: true
  }
];
function TopProducts() {
  return /* @__PURE__ */ jsx("section", { className: "bg-muted px-6 py-14 md:py-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10 text-center", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          className: "mb-3 text-2xl font-semibold text-med-nav md:text-3xl",
          style: { fontFamily: "var(--font-heading)" },
          children: "Les Top Produits du moment"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground", children: "Notre selection de produits incontournables" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", children: topProducts.map((product) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/products/${product.id}`,
        className: "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-med-cta hover:shadow-md",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative aspect-square w-full bg-secondary", children: [
            /* @__PURE__ */ jsx("div", { className: "flex size-full items-center justify-center text-med-cta/30", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-16",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 1,
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  }
                )
              }
            ) }),
            product.badge && /* @__PURE__ */ jsx(Badge, { className: "absolute top-3 left-3 bg-med-cta text-primary-foreground hover:bg-med-cta", children: product.badge }),
            !product.available && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/60", children: /* @__PURE__ */ jsx(Badge, { className: "bg-muted-foreground text-primary-foreground hover:bg-muted-foreground", children: "Indisponible" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2 p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "line-clamp-2 text-sm font-medium text-med-nav", children: product.name }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-lg font-semibold text-med-nav", style: { fontFamily: "var(--font-heading)" }, children: [
                product.price,
                " ",
                "EUR"
              ] }),
              product.originalPrice && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground line-through", children: [
                product.originalPrice,
                " ",
                "EUR"
              ] })
            ] }),
            product.available && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "size-2 rounded-full bg-med-available" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-med-available", children: "En stock" })
            ] })
          ] })
        ]
      },
      product.id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/products", children: /* @__PURE__ */ jsx(
      Button,
      {
        size: "lg",
        className: "bg-med-cta text-primary-foreground hover:bg-med-hover",
        children: "Voir tous les produits"
      }
    ) }) })
  ] }) });
}
const meta = () => {
  return [
    { title: "Athlea Systems - Votre pharmacie en ligne" },
    {
      name: "description",
      content: "Achetez vos produits medicaux en ligne. Large choix, livraison rapide et prix competitifs."
    }
  ];
};
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsx(HeroCarousel, {}),
      /* @__PURE__ */ jsx(FixedTextSection, {}),
      /* @__PURE__ */ jsx(CategoriesGrid, {}),
      /* @__PURE__ */ jsx(TopProducts, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await authClient.signIn.email(
        {
          email,
          password
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setIsLoading(false);
            navigate("/");
          },
          onError: (ctx) => {
            var _a;
            setIsLoading(false);
            setError(((_a = ctx.error) == null ? void 0 : _a.message) || "Une erreur est survenue lors de la connexion");
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      setError((err == null ? void 0 : err.message) || "Une erreur inattendue s'est produite");
    }
  };
  return /* @__PURE__ */ jsx("form", { onSubmit: signIn, className: cn("flex flex-col gap-6", className), ...props, children: /* @__PURE__ */ jsxs(FieldGroup, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Connexion" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-balance text-muted-foreground", children: "Entrez votre adresse email et votre mot de passe pour vous connecter à votre compte." })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 flex-shrink-0" }),
      /* @__PURE__ */ jsx("p", { children: error })
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "email",
          type: "email",
          placeholder: "m@example.com",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          disabled: isLoading
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "password", children: "Mot de passe" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "ml-auto text-sm underline-offset-4 hover:underline",
            children: "Mot de passe oublié?"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "password",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          disabled: isLoading
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Field, { children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Connexion en cours..." : "Connexion" }),
      /* @__PURE__ */ jsxs(FieldDescription, { className: "text-center", children: [
        "Pas de compte?",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/register", className: "underline underline-offset-4 hover:text-foreground", children: "S'inscrire" })
      ] })
    ] })
  ] }) });
}
const LoginPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-svh lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-6 md:p-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 md:justify-start", children: /* @__PURE__ */ jsxs("a", { href: "#", className: "flex items-center gap-2 font-medium", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(GalleryVerticalEnd, { className: "size-4" }) }),
        "Athlea Systems"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ jsx(LoginForm, {}) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative hidden bg-muted lg:block", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/placeholder.svg",
        alt: "Image",
        className: "absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      }
    ) })
  ] });
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LoginPage
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B6K-2R2z.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/components-DUfeWTCP.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-CuVo3frr.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/components-DUfeWTCP.js", "/assets/cart-context-MQg65yoj.js"], "css": ["/assets/root-DJxzhIwt.css"] }, "routes/products._index": { "id": "routes/products._index", "parentId": "routes/products", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products._index-C_KBU1wQ.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/input-Dmn_gCvz.js", "/assets/badge-DJ2ap7AT.js", "/assets/select-VZ7SRCT5.js", "/assets/separator-BZTPneVE.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-HIjXai62.js", "/assets/index-DfWK7mxH.js", "/assets/label-CRlmOMCh.js", "/assets/data-D08N24yF.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/chevron-down-CGPl3Ovj.js", "/assets/chevron-up-BGYnZGcW.js"], "css": [] }, "routes/remboursements": { "id": "routes/remboursements", "parentId": "root", "path": "remboursements", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/remboursements-B50X1dQO.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/tabs-QEWwe7xy.js", "/assets/separator-BZTPneVE.js", "/assets/badge-DJ2ap7AT.js", "/assets/label-CRlmOMCh.js", "/assets/textarea-z8xz6vAW.js", "/assets/select-VZ7SRCT5.js", "/assets/dialog-CRPMifTp.js", "/assets/footer-BXh9h2bv.js", "/assets/data-D08N24yF.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/plus-w_IerHFo.js", "/assets/rotate-ccw-DOWmgUTP.js", "/assets/circle-check-BsaBgNCF.js", "/assets/package-Cq3tIxxR.js", "/assets/clock-Chsmtqui.js", "/assets/index-HIjXai62.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-DfWK7mxH.js", "/assets/chevron-down-CGPl3Ovj.js", "/assets/chevron-up-BGYnZGcW.js", "/assets/auth-client-COXqqDaB.js", "/assets/cart-context-MQg65yoj.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/products.$id": { "id": "routes/products.$id", "parentId": "routes/products", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products._id-C6rjSF3M.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/badge-DJ2ap7AT.js", "/assets/separator-BZTPneVE.js", "/assets/index-HIjXai62.js", "/assets/chevron-down-CGPl3Ovj.js", "/assets/cart-context-MQg65yoj.js", "/assets/data-D08N24yF.js", "/assets/circle-alert-HrUjtBXV.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/minus-iszHja3B.js", "/assets/plus-w_IerHFo.js", "/assets/circle-check-big-DdRcmwED.js", "/assets/shopping-cart-B-YoZ12C.js", "/assets/package-Cq3tIxxR.js"], "css": [] }, "routes/orders": { "id": "routes/orders", "parentId": "root", "path": "commandes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/orders-D6OmYFkY.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/separator-BZTPneVE.js", "/assets/footer-BXh9h2bv.js", "/assets/data-D08N24yF.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/rotate-ccw-DOWmgUTP.js", "/assets/circle-check-BsaBgNCF.js", "/assets/truck-COlEmfNo.js", "/assets/package-Cq3tIxxR.js", "/assets/clock-Chsmtqui.js", "/assets/file-text-BMM2gScZ.js", "/assets/chevron-up-BGYnZGcW.js", "/assets/chevron-down-CGPl3Ovj.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-HIjXai62.js", "/assets/auth-client-COXqqDaB.js", "/assets/cart-context-MQg65yoj.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/commande": { "id": "routes/commande", "parentId": "root", "path": "commande", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/commande-CyTuq8QM.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/label-CRlmOMCh.js", "/assets/separator-BZTPneVE.js", "/assets/index-HIjXai62.js", "/assets/footer-BXh9h2bv.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-DfWK7mxH.js", "/assets/card-BxEqdc0Z.js", "/assets/badge-DJ2ap7AT.js", "/assets/cart-context-MQg65yoj.js", "/assets/data-D08N24yF.js", "/assets/components-DUfeWTCP.js", "/assets/circle-check-BsaBgNCF.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/truck-COlEmfNo.js", "/assets/credit-card-Dn_YhSAw.js", "/assets/auth-client-COXqqDaB.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/invoices": { "id": "routes/invoices", "parentId": "root", "path": "factures", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/invoices-p7rEUMTa.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/tabs-QEWwe7xy.js", "/assets/separator-BZTPneVE.js", "/assets/dialog-CRPMifTp.js", "/assets/input-Dmn_gCvz.js", "/assets/label-CRlmOMCh.js", "/assets/footer-BXh9h2bv.js", "/assets/data-D08N24yF.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/circle-check-BsaBgNCF.js", "/assets/file-text-BMM2gScZ.js", "/assets/credit-card-Dn_YhSAw.js", "/assets/circle-alert-HrUjtBXV.js", "/assets/clock-Chsmtqui.js", "/assets/index-HIjXai62.js", "/assets/sheet-CYSVPnMH.js", "/assets/auth-client-COXqqDaB.js", "/assets/cart-context-MQg65yoj.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/products": { "id": "routes/products", "parentId": "root", "path": "produits", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products-Bi53ZJsn.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/footer-BXh9h2bv.js", "/assets/button-B-7LPkcq.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-HIjXai62.js", "/assets/auth-client-COXqqDaB.js", "/assets/cart-context-MQg65yoj.js", "/assets/components-DUfeWTCP.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/register-bOiJtDHi.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/field-BiQJnFQW.js", "/assets/input-Dmn_gCvz.js", "/assets/auth-client-COXqqDaB.js", "/assets/circle-alert-HrUjtBXV.js", "/assets/label-CRlmOMCh.js"], "css": [] }, "routes/settings": { "id": "routes/settings", "parentId": "root", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/settings-JYu_5J_u.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/input-Dmn_gCvz.js", "/assets/label-CRlmOMCh.js", "/assets/textarea-z8xz6vAW.js", "/assets/tabs-QEWwe7xy.js", "/assets/card-BxEqdc0Z.js", "/assets/separator-BZTPneVE.js", "/assets/index-HIjXai62.js", "/assets/index-DfWK7mxH.js", "/assets/sheet-CYSVPnMH.js", "/assets/badge-DJ2ap7AT.js", "/assets/footer-BXh9h2bv.js", "/assets/data-D08N24yF.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/shield-BgN8qOFP.js", "/assets/plus-w_IerHFo.js", "/assets/trash-2-DQXePixQ.js", "/assets/circle-alert-HrUjtBXV.js", "/assets/circle-check-big-DdRcmwED.js", "/assets/auth-client-COXqqDaB.js", "/assets/cart-context-MQg65yoj.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/panier": { "id": "routes/panier", "parentId": "root", "path": "panier", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/panier-Xn9-ohY_.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/separator-BZTPneVE.js", "/assets/badge-DJ2ap7AT.js", "/assets/footer-BXh9h2bv.js", "/assets/cart-context-MQg65yoj.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/shopping-cart-B-YoZ12C.js", "/assets/trash-2-DQXePixQ.js", "/assets/minus-iszHja3B.js", "/assets/plus-w_IerHFo.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-HIjXai62.js", "/assets/auth-client-COXqqDaB.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DJTsSmff.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/footer-BXh9h2bv.js", "/assets/button-B-7LPkcq.js", "/assets/components-DUfeWTCP.js", "/assets/chevron-right-d0KjUpBB.js", "/assets/shield-BgN8qOFP.js", "/assets/badge-DJ2ap7AT.js", "/assets/sheet-CYSVPnMH.js", "/assets/index-HIjXai62.js", "/assets/auth-client-COXqqDaB.js", "/assets/cart-context-MQg65yoj.js", "/assets/shopping-cart-B-YoZ12C.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-V-fU0Had.js", "imports": ["/assets/index-D5yq2knj.js", "/assets/button-B-7LPkcq.js", "/assets/field-BiQJnFQW.js", "/assets/input-Dmn_gCvz.js", "/assets/auth-client-COXqqDaB.js", "/assets/circle-alert-HrUjtBXV.js", "/assets/label-CRlmOMCh.js"], "css": [] } }, "url": "/assets/manifest-89df8b38.js", "version": "89df8b38" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/products._index": {
    id: "routes/products._index",
    parentId: "routes/products",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/remboursements": {
    id: "routes/remboursements",
    parentId: "root",
    path: "remboursements",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/products.$id": {
    id: "routes/products.$id",
    parentId: "routes/products",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/orders": {
    id: "routes/orders",
    parentId: "root",
    path: "commandes",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/commande": {
    id: "routes/commande",
    parentId: "root",
    path: "commande",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/invoices": {
    id: "routes/invoices",
    parentId: "root",
    path: "factures",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/products": {
    id: "routes/products",
    parentId: "root",
    path: "produits",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/panier": {
    id: "routes/panier",
    parentId: "root",
    path: "panier",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route11
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
