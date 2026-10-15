import { Link, useLocation } from 'react-router-dom';
import { money } from '../data/products';
import { useShop } from '../context/ShopContext';
export default function ProductCard({ product }) {
  const location = useLocation();
  const modalState = { backgroundLocation: location };
  const { favorites, toggleFavorite } = useShop();
  const favorite = favorites.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-media">
        <Link
          to={`/producto/${product.id}`}
          state={modalState}
          data-product-link={product.id}
          aria-label={`Ver detalles de ${product.name}`}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <span className="badge">{product.badge}</span>
        <button
          className={`favorite-btn ${favorite ? 'active' : ''}`}
          aria-label={`${favorite ? 'Quitar de' : 'Agregar a'} favoritos: ${product.name}`}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(product.id)}
        >
          {favorite ? '♥' : '♡'}
        </button>
        <Link className="quick-view" to={`/producto/${product.id}`} state={modalState}>
          Ver detalles
        </Link>
      </div>
      <div className="product-info">
        <span className="product-category">
          {product.audience} · {product.style}
        </span>
        <h3>
          <Link to={`/producto/${product.id}`} state={modalState}>
            {product.name}
          </Link>
        </h3>
        <div className="product-price">
          {product.oldPrice && (
            <span className="old-price">{money(product.oldPrice)}</span>
          )}
          {money(product.price)}
        </div>
        <span className="product-color">{product.color}</span>
      </div>
    </article>
  );
}
