import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import p7 from "@/assets/product-7.jpg";
import p8 from "@/assets/product-8.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Abayas" | "Hijabs" | "Ensembles" | "Accessoires";
  colors: { name: string; hex: string }[];
  sizes: string[];
  fabric: string;
  description: string;
  isNew?: boolean;
};

const beige = { name: "Beige sable", hex: "#e8dcc4" };
const nude = { name: "Nude", hex: "#d8c1a8" };
const taupe = { name: "Taupe", hex: "#a89a8a" };
const cream = { name: "Blanc cassé", hex: "#f5f0e6" };
const cognac = { name: "Cognac", hex: "#a0724a" };

export const products: Product[] = [
  {
    id: "abaya-soie-medine",
    name: "Abaya Soie de Médine",
    price: 89,
    image: p1,
    category: "Abayas",
    colors: [nude, beige, taupe],
    sizes: ["S", "M", "L", "XL"],
    fabric: "100% soie sablée",
    description:
      "Une abaya fluide et intemporelle, taillée dans une soie sablée d'exception. Tombé impeccable pour une allure noble au quotidien.",
    isNew: true,
  },
  {
    id: "ensemble-cotele-nude",
    name: "Ensemble Côtelé Nude",
    price: 74,
    image: p2,
    category: "Ensembles",
    colors: [nude, taupe],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Maille côtelée — 82% viscose, 18% élasthanne",
    description:
      "Ensemble deux pièces en maille côtelée douce, coupe ajustée respectueuse et confort absolu.",
    isNew: true,
  },
  {
    id: "hijab-mousseline-premium",
    name: "Hijab Mousseline Premium",
    price: 35,
    image: p3,
    category: "Hijabs",
    colors: [nude, cream, taupe, cognac],
    sizes: ["Unique"],
    fabric: "Mousseline de soie légère",
    description:
      "Notre best-seller. Voile fluide, opaque et respirant. Ourlet main pour une finition parfaite.",
  },
  {
    id: "robe-longue-sahra",
    name: "Robe Longue Sahra",
    price: 79,
    image: p4,
    category: "Abayas",
    colors: [beige, cream],
    sizes: ["S", "M", "L"],
    fabric: "Viscose fluide certifiée",
    description:
      "Robe longue à ceinture élastiquée, silhouette légère et féminine. Idéale du bureau aux réceptions.",
  },
  {
    id: "abaya-brodee-noor",
    name: "Abaya Brodée Noor",
    price: 129,
    image: p5,
    category: "Abayas",
    colors: [taupe, nude],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Crêpe premium, broderie main",
    description:
      "Broderies réalisées à la main sur un crêpe premium — une pièce d'exception pour les grandes occasions.",
    isNew: true,
  },
  {
    id: "hijab-soie-cognac",
    name: "Hijab Soie Cognac",
    price: 42,
    image: p6,
    category: "Hijabs",
    colors: [cognac, nude],
    sizes: ["Unique"],
    fabric: "Sergé de soie",
    description:
      "Éclat naturel et tombé structuré. Le sergé de soie sublime chaque drapé.",
  },
  {
    id: "kimono-ivoire-madina",
    name: "Kimono Ivoire Madina",
    price: 89,
    image: p7,
    category: "Ensembles",
    colors: [cream, beige],
    sizes: ["S/M", "L/XL"],
    fabric: "Crêpe fluide",
    description:
      "Kimono long à porter ouvert sur une tenue épurée. Coupe ample et fluide.",
    isNew: true,
  },
  {
    id: "ceinture-cuir-elyssa",
    name: "Ceinture Cuir Elyssa",
    price: 45,
    image: p8,
    category: "Accessoires",
    colors: [cognac, taupe],
    sizes: ["S", "M", "L"],
    fabric: "Cuir pleine fleur",
    description:
      "Ceinture en cuir pleine fleur pour structurer abayas et robes longues.",
  },
];

export const categories = [
  { name: "Abayas", slug: "Abayas" },
  { name: "Hijabs", slug: "Hijabs" },
  { name: "Ensembles", slug: "Ensembles" },
  { name: "Accessoires", slug: "Accessoires" },
] as const;

export const getProduct = (id: string) => products.find((p) => p.id === id);