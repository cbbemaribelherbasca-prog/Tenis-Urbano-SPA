import { products } from '../data/products';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
export default function Favorites() {
  const { favorites } = useShop();
  return (
    <section className="catalog">
      <p className="eyebrow">Tu lista</p>
      <h1>Favoritos</h1>
      {favorites.length ? (
        <div className="product-grid">
          {products
            .filter((product) => favorites.includes(product.id))
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
        <EmptyState title="Todavía no tienes favoritos">
          Guarda los modelos que te gustan con el corazón del catálogo.
        </EmptyState>
      )}
    </section>
  );
}
