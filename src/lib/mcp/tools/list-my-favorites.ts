import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseAsUser } from "../user-client";
import { products } from "@/lib/products";

export default defineTool({
  name: "list_my_favorites",
  title: "List my favorites",
  description: "Returns the signed-in customer's favorite products (name, price, category).",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseAsUser(ctx.getToken()!);
    const { data, error } = await supabase.from("favorites").select("product_id, created_at").order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? []).map((f) => {
      const p = products.find((x) => x.id === f.product_id);
      return p ? { id: p.id, name: p.name, price: p.price, category: p.category } : { id: f.product_id };
    });
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }], structuredContent: { items } };
  },
});