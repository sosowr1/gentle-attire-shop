import { defineMcp } from "@lovable.dev/mcp-js";
import listCategoriesTool from "./tools/list-categories";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";

export default defineMcp({
  name: "noora-mcp",
  title: "Noora — Modest Fashion",
  version: "0.1.0",
  instructions:
    "Tools to browse the Noora storefront: list categories, list products (with optional category and price filters), and fetch a single product's full details by id.",
  tools: [listCategoriesTool, listProductsTool, getProductTool],
});