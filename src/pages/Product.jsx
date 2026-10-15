import { useEffect, useRef, useState } from 'react';
import Modal from '../components/Modal';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { money, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';

export default function Product() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const product = products.find((item) => String(item.id) === id);
  const { addToCart, favorites, toggleFavorite } = useShop();
  const [size, setSize] = useState(null);
  const [message, setMessage] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const firstSize = useRef(null);

  useEffect(() => {
    setSize(null);
    setMessage('');
    setSizeError(false);
  }, [id]);

  function close() {
    if (location.state?.backgroundLocation) navigate(-1);
    else navigate('/catalogo', { replace: true });
  }

  if (!product) {
    return (
      <EmptyState title="Producto no encontrado">
        Este modelo no existe en el catálogo.
      </EmptyState>
    );
  }

  const favorite = favorites.includes(product.id);
  const backgroundLocation = location.state?.backgroundLocation;
  return (
    <Modal
      key={product.id}
      className="product-modal"
      labelledBy="product-title"
      describedBy="product-description"
      closeLabel="Cerrar detalles"
      onClose={close}
      returnFocusSelector={`[data-product-link="${product.id}"]`}
      shouldRestoreFocus={() =>
        backgroundLocation &&
        `#${backgroundLocation.pathname}${backgroundLocation.search}${backgroundLocation.hash}` ===
          window.location.hash
      }
    >
      <div className="modal-image-wrap">
        <img src={product.image} alt={product.name} />
        <p className="selected-size-caption" aria-live="polite" aria-atomic="true">
          {size ? (
            <>
              Talla seleccionada: <strong>{size}</strong>
            </>
          ) : (
            'Selecciona una talla para tu próximo par'
          )}
        </p>
      </div>
      <div className="modal-info">
        <p className="product-brand">TENIS URBANO</p>
        <h2 id="product-title">{product.name}</h2>
        <div className="modal-price">
          {product.oldPrice && <span>{money(product.oldPrice)}</span>}
          <strong>{money(product.price)}</strong>
          {product.oldPrice && <b>{product.badge}</b>}
        </div>
        <p className="modal-description" id="product-description">
          {product.description}
        </p>
        <div className="detail-row">
          <span>Color</span>
          <strong>{product.color}</strong>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!size) {
              setSizeError(true);
              firstSize.current?.focus();
              return;
            }
            addToCart(product.id, size);
            setMessage('Producto agregado al carrito.');
          }}
        >
          <fieldset
            className="size-fieldset"
            aria-describedby={sizeError ? 'size-error' : undefined}
          >
            <legend>Selecciona tu talla</legend>
            <div className="sizes">
              {[35, 36, 37, 38, 39, 40, 41, 42].map((value, index) => (
                <button
                  key={value}
                  ref={index === 0 ? firstSize : undefined}
                  type="button"
                  className={`size-button ${size === value ? 'active' : ''}`}
                  aria-pressed={size === value}
                  onClick={() => {
                    setSize(value);
                    setSizeError(false);
                    setMessage('');
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          {sizeError && (
            <p className="size-error" id="size-error" role="alert">
              Selecciona una talla para continuar.
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className={`favorite-large ${favorite ? 'active' : ''}`}
              aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-pressed={favorite}
              onClick={() => toggleFavorite(product.id)}
            >
              <Icon name="heart" />
            </button>
            <button className="primary-button" type="submit">
              Agregar al carrito
            </button>
          </div>
        </form>
        <ul className="detail-list">
          <li>Envío nacional disponible</li>
          <li>Cambios dentro de 30 días</li>
          <li>Pago seguro</li>
        </ul>
        {message && (
          <>
            <p role="status">{message}</p>
            <Link className="text-button" to="/carrito">
              Ver carrito →
            </Link>
          </>
        )}
      </div>
    </Modal>
  );
}
