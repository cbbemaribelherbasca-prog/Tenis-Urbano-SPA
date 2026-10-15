import { createContext, useContext, useEffect, useState } from 'react';
import { products } from '../data/products';
const ShopContext = createContext(null);
function read(key, validate) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter(validate) : [];
  } catch {
    return [];
  }
}
const exists = (id) => products.some((product) => product.id === id);
export function ShopProvider({ children }) {
  const [favorites, setFavorites] = useState(() => read('tenis-favoritos', exists));
  const [cart, setCart] = useState(() =>
    read(
      'tenis-carrito',
      (item) =>
        item &&
        exists(item.id) &&
        Number.isInteger(item.qty) &&
        item.qty > 0 &&
        [35, 36, 37, 38, 39, 40, 41, 42].includes(item.size)
    )
  );
  useEffect(() => {
    try {
      localStorage.setItem('tenis-favoritos', JSON.stringify(favorites));
      localStorage.setItem('tenis-carrito', JSON.stringify(cart));
    } catch {
      /* Funciona también sin almacenamiento. */
    }
  }, [favorites, cart]);
  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }
  function addToCart(id, size) {
    setCart((current) =>
      current.some((item) => item.id === id && item.size === size)
        ? current.map((item) =>
            item.id === id && item.size === size ? { ...item, qty: item.qty + 1 } : item
          )
        : [...current, { id, size, qty: 1 }]
    );
  }
  function changeQuantity(id, size, delta) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  }
  function clearCart() {
    setCart([]);
  }
  return (
    <ShopContext.Provider
      value={{ favorites, cart, toggleFavorite, addToCart, changeQuantity, clearCart }}
    >
      {children}
    </ShopContext.Provider>
  );
}
export const useShop = () => useContext(ShopContext);
