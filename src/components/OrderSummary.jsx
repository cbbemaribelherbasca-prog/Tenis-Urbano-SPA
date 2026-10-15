import { money, products } from '../data/products';

export function cartSubtotal(cart) {
  return cart.reduce(
    (sum, item) =>
      sum + products.find((product) => product.id === item.id).price * item.qty,
    0
  );
}

export default function OrderSummary({
  cart,
  shipping = 0,
  showShipping = false,
  shippingPending = false,
  children,
}) {
  const subtotal = cartSubtotal(cart);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  return (
    <aside className="order-summary" aria-label="Resumen de tu selección">
      <p className="eyebrow">Casi tuyos</p>
      <h2>Tu próximo paso.</h2>
      <div className="summary-mini-items">
        {cart.map((item) => {
          const product = products.find((product) => product.id === item.id);
          return (
            <div className="summary-mini-item" key={`${item.id}-${item.size}`}>
              <img src={product.image} alt="" />
              <div>
                <strong>{product.name}</strong>
                <small>
                  Talla {item.size} · {item.qty} {item.qty === 1 ? 'par' : 'pares'}
                </small>
              </div>
              <span>{money(product.price * item.qty)}</span>
            </div>
          );
        })}
      </div>
      <div className="summary-line">
        <span>
          {count} {count === 1 ? 'par seleccionado' : 'pares seleccionados'}
        </span>
        <span>{money(subtotal)}</span>
      </div>
      {showShipping && (
        <div className="summary-line">
          <span>Entrega</span>
          <span>
            {shippingPending ? 'Por definir' : shipping ? money(shipping) : 'Sin costo'}
          </span>
        </div>
      )}
      <div className="total-row" role="status">
        <span>Total</span>
        <strong>{money(subtotal + shipping)}</strong>
      </div>
      {children}
      <p className="summary-note">Demostración interactiva · Sin cobros reales</p>
    </aside>
  );
}
