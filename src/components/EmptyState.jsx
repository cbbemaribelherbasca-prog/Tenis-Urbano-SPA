import { Link } from 'react-router-dom';
export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{children}</p>
      <Link className="hero-cta" to="/catalogo">
        Explorar catálogo →
      </Link>
    </div>
  );
}
