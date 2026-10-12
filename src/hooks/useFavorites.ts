import { useStore } from '../context/StoreContext';

/**
 * Custom hook providing quick favorites actions and computed values
 */
export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = useStore();

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    totalFavorites: favorites.length,
  };
}
