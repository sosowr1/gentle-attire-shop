import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProduct } from "@/lib/products";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Get full details for a single Noora product by its id.",
  inputSchema: {
    id: z.string().min(1).describe("The product id (e.g. 'abaya-soie-medine')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const p = getProduct(id);
    if (!p) {
      return {
        content: [{ type: "text", text: `No product found with id "${id}".` }],
        isError: true,
      };
    }
    const details = {
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      fabric: p.fabric,
      description: p.description,
      sizes: p.sizes,
      colors: p.colors.map((c) => c.name),
      isNew: !!p.isNew,
    };
    return {
      content: [
        {
          type: "text",
          text: `${p.name} — ${p.price}€\nCategory: ${p.category}\nMatière: ${p.fabric}\nTailles: ${p.sizes.join(", ")}\nCouleurs: ${details.colors.join(", ")}\n\n${p.description}`,
        },
      ],
      structuredContent: { product: details },
    };
  },
});