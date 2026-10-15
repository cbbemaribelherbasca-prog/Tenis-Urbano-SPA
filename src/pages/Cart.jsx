import { Link, useLocation, useNavigate } from 'react-router-dom';
import { money, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import PurchaseSteps from '../components/PurchaseSteps';

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, changeQuantity } = useShop();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  return (
    <section className="catalog cart-view">
      <PurchaseSteps />
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            Tu selección · {count} {count === 1 ? 'par' : 'pares'}
          </p>
          <h1>
            Listos para
            <br />
            <em>salir contigo.</em>
          </h1>
        </div>
        <p>
          Revisa tus tallas y cantidades.
          <br />
          El próximo paso lo decides tú.
        </p>
      </div>
      {cart.length ? (
        <div className="commerce-layout">
          <div className="cart-items-panel">
            <div className="panel-heading">
              <h2>Carrito</h2>
              <Link className="back-link" to="/catalogo">
                Seguir explorando ↗
              </Link>
            </div>
            {cart.map((item) => {
              const product = products.find((product) => product.id === item.id);
              return (
                <article className="cart-line-item" key={`${item.id}-${item.size}`}>
                  <Link
                    className="cart-product-image"
                    to={`/producto/${product.id}`}
                    state={{ backgroundLocation: location }}
                    data-product-link={product.id}
                    aria-label={`Ver ${product.name}`}
                  >
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="cart-line-details">
                    <span className="product-category">
                      {product.audience} · {product.style}
                    </span>
                    <Link
                      to={`/producto/${product.id}`}
                      state={{ backgroundLocation: location }}
                    >
                      {product.name}
                    </Link>
                    <small>
                      Talla {item.size} · {product.color}
                    </small>
                    <div className="qty">
                      <button
                        aria-label={`Reducir cantidad de ${product.name}`}
                        onClick={() => changeQuantity(item.id, item.size, -1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        aria-label={`Aumentar cantidad de ${product.name}`}
                        onClick={() => changeQuantity(item.id, item.size, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-end">
                    <strong>{money(product.price * item.qty)}</strong>
                    <button
                      className="remove-btn"
                      aria-label={`Eliminar ${product.name}`}
                      onClick={() => changeQuantity(item.id, item.size, -item.qty)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
            <div className="cart-bottom-note">
              <span aria-hidden="true">↺</span> Tu selección se conserva cuando vuelves.
            </div>
          </div>
          <OrderSummary cart={cart}>
            <button
              id="checkout-button"
              className="primary-button checkout-button"
              type="button"
              onClick={() => navigate('/checkout')}
            >
              Finalizar compra <span aria-hidden="true">↗</span>
            </button>
            <p className="shipping-hint">Retiro gratis · Envío sin costo desde Bs 500</p>
          </OrderSummary>
        </div>
      ) : (
        <EmptyState title="Tu carrito está vacío">
          Elige un modelo y una talla para comenzar.
        </EmptyState>
      )}
    </section>
  );
}
