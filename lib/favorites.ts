
export type FavoriteItem = {
  slug: string;
};

const FAVORITES_KEY = "digi_world_favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteItem[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event("favorites-updated"));
}

export function isFavorite(slug: string) {
  return getFavorites().some((item) => item.slug === slug);
}

export function addToFavorites(slug: string) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.slug === slug);

  if (!exists) {
    favorites.push({ slug });
  }

  saveFavorites(favorites);
}

export function removeFromFavorites(slug: string) {
  const updated = getFavorites().filter((item) => item.slug !== slug);
  saveFavorites(updated);
}

export function toggleFavorite(slug: string) {
  if (isFavorite(slug)) {
    removeFromFavorites(slug);
  } else {
    addToFavorites(slug);
  }
}

export function clearFavorites() {
  saveFavorites([]);
}

export function getFavoritesCount() {
  return getFavorites().length;
}