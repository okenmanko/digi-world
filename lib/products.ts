export type Product = {
  id: number;
  slug: string;
  name: string;
  categoryUz: string;
  categoryRu: string;
  price: number;
  oldPrice?: number;
  currency: "so‘m";
  emoji: string;
  badgeUz: string;
  badgeRu: string;
  shortUz: string;
  shortRu: string;
  descriptionUz: string;
  descriptionRu: string;
  specs: {
    label: string;
    value: string;
  }[];
  inStock: boolean;
  rating: number;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "moonx-smart-tv-43",
    name: "MOONX Smart TV 43”",
    categoryUz: "Televizorlar",
    categoryRu: "Телевизоры",
    price: 2990000,
    oldPrice: 3450000,
    currency: "so‘m",
    emoji: "📺",
    badgeUz: "Smart TV",
    badgeRu: "Smart TV",
    shortUz:
      "Uy va ofis uchun zamonaviy Smart TV. Yorqin tasvir va qulay boshqaruv.",
    shortRu:
      "Современный Smart TV для дома и офиса. Яркое изображение и удобное управление.",
    descriptionUz:
      "MOONX Smart TV 43” — YouTube, Netflix, kino va kundalik foydalanish uchun qulay televizor. Zamonaviy dizayn, katta ekran va Smart funksiyalar bilan Digi World mijozlari uchun mos tanlov.",
    descriptionRu:
      "MOONX Smart TV 43” — удобный телевизор для YouTube, Netflix, фильмов и ежедневного использования. Современный дизайн, большой экран и Smart функции.",
    specs: [
      { label: "Diagonal", value: "43 inch" },
      { label: "Resolution", value: "4K Ultra HD" },
      { label: "System", value: "Android TV" },
      { label: "Wi-Fi", value: "Yes" },
      { label: "HDMI", value: "3" },
      { label: "USB", value: "2" },
      { label: "Warranty", value: "12 months" },
    ],
    inStock: true,
    rating: 4.9,
  },
  {
    id: 2,
    slug: "moonx-smart-tv-32",
    name: "MOONX Smart TV 32”",
    categoryUz: "Televizorlar",
    categoryRu: "Телевизоры",
    price: 1990000,
    oldPrice: 2350000,
    currency: "so‘m",
    emoji: "📺",
    badgeUz: "Android TV",
    badgeRu: "Android TV",
    shortUz:
      "Ixcham Smart TV. Oshxona, yotoqxona yoki kichik xona uchun qulay.",
    shortRu:
      "Компактный Smart TV. Подходит для кухни, спальни или небольшой комнаты.",
    descriptionUz:
      "MOONX Smart TV 32” kichik xonalar uchun qulay yechim. Smart ilovalar, Wi-Fi va oddiy boshqaruv orqali kundalik foydalanishga mos.",
    descriptionRu:
      "MOONX Smart TV 32” — удобное решение для небольших комнат. Smart приложения, Wi-Fi и простое управление.",
    specs: [
      { label: "Diagonal", value: "32 inch" },
      { label: "Resolution", value: "HD" },
      { label: "System", value: "Android TV" },
      { label: "Wi-Fi", value: "Yes" },
      { label: "HDMI", value: "2" },
      { label: "Warranty", value: "12 months" },
    ],
    inStock: true,
    rating: 4.8,
  },
  {
    id: 3,
    slug: "midea-microwave",
    name: "Midea Microwave",
    categoryUz: "Mikrovolnovkalar",
    categoryRu: "Микроволновки",
    price: 899000,
    oldPrice: 1090000,
    currency: "so‘m",
    emoji: "🔥",
    badgeUz: "Kitchen",
    badgeRu: "Kitchen",
    shortUz: "Oshxona uchun ixcham va qulay mikroto‘lqinli pech.",
    shortRu: "Компактная и удобная микроволновая печь для кухни.",
    descriptionUz:
      "Midea mikroto‘lqinli pechi ovqat isitish, muzdan tushirish va kundalik oshxona ishlari uchun qulay. Minimal dizayn va oddiy boshqaruvga ega.",
    descriptionRu:
      "Микроволновая печь Midea подходит для разогрева, разморозки и ежедневного использования на кухне. Минимальный дизайн и простое управление.",
    specs: [
      { label: "Type", value: "Microwave oven" },
      { label: "Control", value: "Mechanical" },
      { label: "Usage", value: "Home / office" },
      { label: "Warranty", value: "12 months" },
    ],
    inStock: true,
    rating: 4.7,
  },
  {
    id: 4,
    slug: "inverter-conditioner",
    name: "Inverter Conditioner",
    categoryUz: "Konditsionerlar",
    categoryRu: "Кондиционеры",
    price: 4990000,
    oldPrice: 5600000,
    currency: "so‘m",
    emoji: "❄️",
    badgeUz: "Cooling",
    badgeRu: "Cooling",
    shortUz: "Yozgi mavsum uchun tejamkor inverter konditsioner.",
    shortRu: "Экономичный инверторный кондиционер для летнего сезона.",
    descriptionUz:
      "Inverter konditsioner uy va ofis uchun salqinlikni tez ta’minlaydi. Energiya tejamkor ishlash, jim rejim va zamonaviy dizayn.",
    descriptionRu:
      "Инверторный кондиционер быстро охлаждает дом или офис. Экономичная работа, тихий режим и современный дизайн.",
    specs: [
      { label: "Type", value: "Inverter" },
      { label: "Mode", value: "Cooling / heating" },
      { label: "Usage", value: "Home / office" },
      { label: "Warranty", value: "12 months" },
    ],
    inStock: true,
    rating: 4.9,
  },
  {
    id: 5,
    slug: "hoffmann-air-cleaner",
    name: "Hoffmann Air Cleaner",
    categoryUz: "Havo tozalagichlar",
    categoryRu: "Очистители воздуха",
    price: 1490000,
    oldPrice: 1750000,
    currency: "so‘m",
    emoji: "🌬️",
    badgeUz: "Clean Air",
    badgeRu: "Clean Air",
    shortUz: "Uy va ofis havosini tozalash uchun zamonaviy qurilma.",
    shortRu: "Современное устройство для очистки воздуха дома и в офисе.",
    descriptionUz:
      "Hoffmann havo tozalagich xonadagi chang, hid va havoni yaxshilash uchun qulay yechim. Zamonaviy ko‘rinish va oddiy foydalanish.",
    descriptionRu:
      "Очиститель воздуха Hoffmann помогает улучшить качество воздуха в комнате, уменьшить пыль и запахи. Современный вид и простое использование.",
    specs: [
      { label: "Type", value: "Air cleaner" },
      { label: "Usage", value: "Home / office" },
      { label: "Mode", value: "Multi-speed" },
      { label: "Warranty", value: "12 months" },
    ],
    inStock: true,
    rating: 4.8,
  },
  {
    id: 6,
    slug: "samsung-refrigerator",
    name: "Samsung Refrigerator",
    categoryUz: "Muzlatgichlar",
    categoryRu: "Холодильники",
    price: 6990000,
    oldPrice: 7500000,
    currency: "so‘m",
    emoji: "🧊",
    badgeUz: "No Frost",
    badgeRu: "No Frost",
    shortUz: "Katta oila uchun sig‘imli va zamonaviy muzlatgich.",
    shortRu: "Вместительный и современный холодильник для большой семьи.",
    descriptionUz:
      "Samsung muzlatgichi kundalik foydalanish uchun sig‘imli, ishonchli va zamonaviy yechim. Uy oshxonasi uchun premium tanlov.",
    descriptionRu:
      "Холодильник Samsung — вместительное, надёжное и современное решение для ежедневного использования. Премиальный выбор для кухни.",
    specs: [
      { label: "Type", value: "Refrigerator" },
      { label: "Cooling", value: "No Frost" },
      { label: "Usage", value: "Home" },
      { label: "Warranty", value: "12 months" },
    ],
    inStock: true,
    rating: 4.9,
  },
];

export function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategories(lang: "uz" | "ru") {
  const allLabel = lang === "uz" ? "Barchasi" : "Все";

  const categories = products.map((product) =>
    lang === "uz" ? product.categoryUz : product.categoryRu
  );

  return [allLabel, ...Array.from(new Set(categories))];
}