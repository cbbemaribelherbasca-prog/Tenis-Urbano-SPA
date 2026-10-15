import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import EmptyState from './components/EmptyState';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Favorites from './pages/Favorites';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
export default function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route
            path="producto/:id"
            element={
              <>
                <Catalog />
                <Product />
              </>
            }
          />
          <Route path="carrito" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="*"
            element={
              <EmptyState title="Página no encontrada">
                Utiliza la navegación para volver a la tienda.
              </EmptyState>
            }
          />
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="producto/:id" element={<Product />} />
        </Routes>
      )}
    </>
  );
}
