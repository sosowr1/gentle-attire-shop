import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { products } from "@/lib/products";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List Noora products. Optionally filter by category and/or maximum price.",
  inputSchema: {
    category: z
      .enum(["Abayas", "Hijabs", "Ensembles", "Accessoires"])
      .optional()
      .describe("Restrict results to one category."),
    maxPrice: z
      .number()
      .positive()
      .optional()
      .describe("Only include products at or below this price (EUR)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, maxPrice }) => {
    const items = products
      .filter((p) => !category || p.category === category)
      .filter((p) => maxPrice == null || p.price <= maxPrice)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        isNew: !!p.isNew,
      }));

    const text = items.length
      ? items.map((p) => `- ${p.name} (${p.category}) — ${p.price}€ [id: ${p.id}]`).join("\n")
      : "No products match those filters.";

    return {
      content: [{ type: "text", text }],
      structuredContent: { products: items, count: items.length },
    };
  },
});