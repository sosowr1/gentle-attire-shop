import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCategoriesTool from "./tools/list-categories";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import listMyFavoritesTool from "./tools/list-my-favorites";
import addFavoriteTool from "./tools/add-favorite";
import removeFavoriteTool from "./tools/remove-favorite";
import getMyCartTool from "./tools/get-my-cart";
import listMyOrdersTool from "./tools/list-my-orders";
import getMyOrderTool from "./tools/get-my-order";

// Direct Supabase issuer — the .lovable.cloud proxy is rejected by mcp-js.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "noora-mcp",
  title: "Noora — Modest Fashion",
  version: "0.2.0",
  instructions:
    "Tools for the Noora storefront. Public catalog: list_categories, list_products, get_product. Signed-in customer: list_my_favorites, add_favorite, remove_favorite, get_my_cart, list_my_orders, get_my_order.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listCategoriesTool,
    listProductsTool,
    getProductTool,
    listMyFavoritesTool,
    addFavoriteTool,
    removeFavoriteTool,
    getMyCartTool,
    listMyOrdersTool,
    getMyOrderTool,
  ],
});