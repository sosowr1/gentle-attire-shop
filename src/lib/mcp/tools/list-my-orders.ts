import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseAsUser } from "../user-client";

export default defineTool({
  name: "list_my_orders",
  title: "List my orders",
  description: "Returns the signed-in customer's orders (id, status, total, date).",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseAsUser(ctx.getToken()!);
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total, created_at")
      .order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }], structuredContent: { orders: data ?? [] } };
  },
});