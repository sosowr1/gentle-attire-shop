import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAsUser } from "../user-client";
import { products } from "@/lib/products";

export default defineTool({
  name: "add_favorite",
  title: "Add favorite",
  description: "Add a product to the signed-in customer's favorites.",
  inputSchema: { product_id: z.string().describe("Product id from list_products / get_product.") },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ product_id }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    if (!products.find((p) => p.id === product_id))
      return { content: [{ type: "text", text: `Unknown product_id: ${product_id}` }], isError: true };
    const supabase = supabaseAsUser(ctx.getToken()!);
    const { error } = await supabase.from("favorites").upsert({ user_id: ctx.getUserId(), product_id }, { onConflict: "user_id,product_id" });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Added ${product_id} to favorites.` }] };
  },
});