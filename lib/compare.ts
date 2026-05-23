export type CompareItem = {
  slug: string;
};

const COMPARE_KEY = "digi_world_compare";

export function getCompare(): CompareItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCompare(compare: CompareItem[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  window.dispatchEvent(new Event("compare-updated"));
}

export function isCompare(slug: string) {
  return getCompare().some((item) => item.slug === slug);
}

export function toggleCompare(slug: string) {
  const compare = getCompare();
  const exists = compare.some((item) => item.slug === slug);

  if (exists) {
    saveCompare(compare.filter((item) => item.slug !== slug));
    return;
  }

  saveCompare([...compare, { slug }]);
}

export function removeFromCompare(slug: string) {
  saveCompare(getCompare().filter((item) => item.slug !== slug));
}

export function clearCompare() {
  saveCompare([]);
}

export function getCompareCount() {
  return getCompare().length;
}