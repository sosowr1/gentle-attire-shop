import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseAsUser } from "../user-client";
import { products } from "@/lib/products";

export default defineTool({
  name: "get_my_cart",
  title: "Get my cart",
  description: "Returns the signed-in customer's synced cart items with computed subtotal.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseAsUser(ctx.getToken()!);
    const { data, error } = await supabase.from("cart_items").select("product_id, size, color, quantity");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    let subtotal = 0;
    const items = (data ?? []).map((it) => {
      const p = products.find((x) => x.id === it.product_id);
      const line = p ? p.price * it.quantity : 0;
      subtotal += line;
      return { ...it, name: p?.name, unit_price: p?.price, line_total: line };
    });
    const result = { items, subtotal, currency: "EUR" };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  },
});