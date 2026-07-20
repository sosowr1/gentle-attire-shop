import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "./products";
import { supabase } from "@/integrations/supabase/client";
import { getMyCart, replaceMyCart } from "./account.functions";

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, quantity: number) => void;
  clear: () => void;
  isAuthenticated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "noora-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || userId) return; // when signed in, DB is source of truth
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated, userId]);

  // Auth-aware sync: on sign-in, merge local into DB then read DB.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    async function sync(uid: string | null) {
      if (!uid) return;
      try {
        const remote = (await getMyCart()) as CartItem[] | { product_id: string; size: string; color: string; quantity: number }[];
        const remoteItems: CartItem[] = (remote as any[]).map((r) => ({
          productId: r.product_id ?? r.productId,
          size: r.size,
          color: r.color,
          quantity: r.quantity,
        }));
        // Merge current local items on top
        const merged: CartItem[] = [...remoteItems];
        for (const local of items) {
          const idx = merged.findIndex(
            (m) => m.productId === local.productId && m.size === local.size && m.color === local.color,
          );
          if (idx >= 0) merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + local.quantity };
          else merged.push(local);
        }
        if (cancelled) return;
        setItems(merged);
        localStorage.removeItem(STORAGE_KEY);
        await replaceMyCart({
          data: {
            items: merged.map((i) => ({
              product_id: i.productId,
              size: i.size,
              color: i.color,
              quantity: i.quantity,
            })),
          },
        });
      } catch (e) {
        console.error("cart sync failed", e);
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) void sync(uid);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        // signed out — clear cart
        setItems([]);
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
      } else {
        void sync(uid);
      }
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Persist to DB whenever items change while signed in.
  useEffect(() => {
    if (!hydrated || !userId) return;
    const t = setTimeout(() => {
      void replaceMyCart({
        data: {
          items: items.map((i) => ({
            product_id: i.productId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
        },
      }).catch((e) => console.error("cart save failed", e));
    }, 400);
    return () => clearTimeout(t);
  }, [items, hydrated, userId]);

  const addItem = useCallback((incoming: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === incoming.productId &&
          i.size === incoming.size &&
          i.color === incoming.color,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + incoming.quantity };
        return next;
      }
      return [...prev, incoming];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, quantity: number) => {
    setItems((prev) =>
      prev.map((i, idx) => (idx === index ? { ...i, quantity: Math.max(1, quantity) } : i)),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => {
      const p = products.find((p) => p.id === i.productId);
      return s + (p ? p.price * i.quantity : 0);
    }, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQty,
      clear: () => setItems([]),
      isAuthenticated: !!userId,
    };
  }, [items, isOpen, addItem, removeItem, updateQty, userId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}