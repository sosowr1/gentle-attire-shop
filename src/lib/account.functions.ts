import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ---------- Profile ----------
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ display_name: z.string().min(1).max(80) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ display_name: data.display_name })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Favorites ----------
export const listMyFavorites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("favorites")
      .select("product_id, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ product_id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("favorites")
      .select("id")
      .eq("user_id", context.userId)
      .eq("product_id", data.product_id)
      .maybeSingle();
    if (existing) {
      const { error } = await context.supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { favorited: false };
    }
    const { error } = await context.supabase
      .from("favorites")
      .insert({ user_id: context.userId, product_id: data.product_id });
    if (error) throw new Error(error.message);
    return { favorited: true };
  });

// ---------- Cart ----------
const CartItemSchema = z.object({
  product_id: z.string(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().int().positive(),
});

export const getMyCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("cart_items")
      .select("product_id, size, color, quantity")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const replaceMyCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ items: z.array(CartItemSchema) }).parse(d))
  .handler(async ({ data, context }) => {
    // Full replace: simplest & idempotent.
    const { error: delErr } = await context.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", context.userId);
    if (delErr) throw new Error(delErr.message);
    if (data.items.length > 0) {
      const { error } = await context.supabase.from("cart_items").insert(
        data.items.map((it) => ({ ...it, user_id: context.userId })),
      );
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- Orders ----------
const OrderItemSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
});

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, status, total, created_at, order_items(product_id, product_name, size, color, quantity, unit_price)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ items: z.array(OrderItemSchema).min(1) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const total = data.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const { data: order, error } = await context.supabase
      .from("orders")
      .insert({ user_id: context.userId, total, status: "pending" })
      .select("id")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Order failed");
    const { error: itErr } = await context.supabase.from("order_items").insert(
      data.items.map((it) => ({ ...it, order_id: order.id })),
    );
    if (itErr) throw new Error(itErr.message);
    // Clear cart after successful order
    await context.supabase.from("cart_items").delete().eq("user_id", context.userId);
    return { id: order.id, total };
  });