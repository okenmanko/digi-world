import type { Metadata } from "next";
import ProductClient from "./ProductClient";
import { getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Mahsulot | Digi World",
      description: "Digi World mahsulot sahifasi.",
    };
  }

  return {
    title: `${product.name} | Digi World`,
    description: product.descriptionRu || product.shortRu || product.name,
    openGraph: {
      title: `${product.name} | Digi World`,
      description: product.descriptionRu || product.shortRu || product.name,
      type: "website",
    },
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductClient params={params} />;
}