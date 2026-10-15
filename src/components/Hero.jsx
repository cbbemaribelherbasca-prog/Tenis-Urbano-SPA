import { Link } from 'react-router-dom';
import heroImage from '../../assets/tenis-cobalto.png';

export default function Hero() {
  return (
    <section className="hero hero-refined">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="collection-dot" aria-hidden="true" />
          Colección urbana / 2026
        </p>
        <h1>
          Muévete
          <br />
          con <em>estilo.</em>
        </h1>
        <p className="hero-text">
          Diseño, comodidad y actitud para acompañarte en cada paso.
        </p>
        <Link className="hero-cta" to="/catalogo?ver=coleccion">
          Explorar colección <span aria-hidden="true">↗</span>
        </Link>
        <p className="hero-note">Tu ciudad. Tu ritmo. Tu próximo par.</p>
        <div className="hero-facts">
          <span>
            <strong>09</strong> modelos, una actitud
          </span>
          <span>
            <strong>30</strong> días para cambiar tu talla
          </span>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Tenis blanco con detalles azules" />
        <div className="hero-label">
          <span>Edición limitada</span>
          <strong>Órbita Cobalto</strong>
        </div>
        <span className="hero-edition" aria-hidden="true">
          URBANO / 26
        </span>
      </div>
    </section>
  );
}
