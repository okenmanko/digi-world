export type Category = {
  slug: string;
  nameUz: string;
  nameRu: string;
  keywords: string[];
};

export const categories: Category[] = [
  {
    slug: "tv",
    nameUz: "Televizorlar",
    nameRu: "Телевизоры",
    keywords: ["tv", "televizor", "телевизор", "smart tv", "android tv"],
  },
  {
    slug: "microwave",
    nameUz: "Mikroto‘lqinli pechlar",
    nameRu: "Микроволновки",
    keywords: ["microwave", "mikroto", "микроволновка", "печь"],
  },
  {
    slug: "smartphones",
    nameUz: "Smartfonlar",
    nameRu: "Смартфоны",
    keywords: ["smartphone", "telefon", "phone", "iphone", "samsung", "смартфон"],
  },
  {
    slug: "home-appliances",
    nameUz: "Maishiy texnika",
    nameRu: "Бытовая техника",
    keywords: ["maishiy", "бытовая", "texnika", "техника"],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}