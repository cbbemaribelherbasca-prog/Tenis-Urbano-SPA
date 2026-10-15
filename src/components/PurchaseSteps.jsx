import { Link } from 'react-router-dom';

export default function PurchaseSteps({ current = 'cart' }) {
  return (
    <nav className="purchase-steps" aria-label="Progreso de compra">
      <Link to="/catalogo">
        <span>01</span> Colección
      </Link>
      <span className="step-line" aria-hidden="true" />
      <Link to="/carrito" aria-current={current === 'cart' ? 'step' : undefined}>
        <span>02</span> Tu selección
      </Link>
      <span className="step-line" aria-hidden="true" />
      <span
        className="purchase-step"
        aria-current={current === 'checkout' ? 'step' : undefined}
      >
        <span>03</span> Confirmación
      </span>
    </nav>
  );
}
