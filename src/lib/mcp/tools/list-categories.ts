import { defineTool } from "@lovable.dev/mcp-js";
import { categories } from "@/lib/products";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description: "List all product categories available in the Noora storefront.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: categories.map((c) => c.name).join(", ") }],
    structuredContent: { categories: categories.map((c) => c.name) },
  }),
});