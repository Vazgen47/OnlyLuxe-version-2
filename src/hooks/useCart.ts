import { useStore } from '../context/StoreContext';

/**
 * Custom hook providing quick cart actions and computed values
 */
export function useCart() {
  const { cart, products, addToCart, removeFromCart, updateCartQuantity, clearCart } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.id);
    return sum + (prod ? prod.priceAMD * item.quantity : 0);
  }, 0);

  const cartWithProducts = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.id),
  }));

  return {
    cart,
    cartWithProducts,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
