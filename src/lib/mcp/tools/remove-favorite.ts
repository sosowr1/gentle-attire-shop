import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAsUser } from "../user-client";

export default defineTool({
  name: "remove_favorite",
  title: "Remove favorite",
  description: "Remove a product from the signed-in customer's favorites.",
  inputSchema: { product_id: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ product_id }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseAsUser(ctx.getToken()!);
    const { error } = await supabase.from("favorites").delete().eq("user_id", ctx.getUserId()).eq("product_id", product_id);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Removed ${product_id} from favorites.` }] };
  },
});