import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAsUser } from "../user-client";

export default defineTool({
  name: "get_my_order",
  title: "Get my order",
  description: "Returns full details (line items) for one of the signed-in customer's orders.",
  inputSchema: { order_id: z.string().uuid() },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ order_id }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseAsUser(ctx.getToken()!);
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total, created_at, order_items(product_id, product_name, size, color, quantity, unit_price)")
      .eq("id", order_id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Order not found" }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
  },
});