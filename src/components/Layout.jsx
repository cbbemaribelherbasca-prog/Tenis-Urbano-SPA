import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Icon from './Icon';
import Benefits from './Benefits';
export default function Layout() {
  const { favorites, cart } = useShop();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const category = new URLSearchParams(location.search).get('categoria') || 'Todos';
  const main = useRef(null);
  const menuButton = useRef(null);
  const routeLabels = {
    '/': 'Inicio',
    '/catalogo': 'Colección',
    '/favoritos': 'Favoritos',
    '/carrito': 'Carrito',
    '/checkout': 'Confirmar compra',
  };
  useEffect(() => {
    setOpen(false);
    document.title = `${routeLabels[location.pathname] || 'Producto'} · Tenis Urbano`;
    const viewingCatalog =
      location.pathname === '/catalogo' &&
      (new URLSearchParams(location.search).get('buscar') === '1' ||
        new URLSearchParams(location.search).get('ver') === 'coleccion');
    if (!viewingCatalog) {
      main.current?.focus();
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <div className="topbar">
        Envíos gratis en compras mayores a Bs 500 · Cambios hasta 30 días
      </div>
      <header className="header">
        <button
          ref={menuButton}
          className="icon-btn mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="main-nav"
        >
          ☰
        </button>
        <Link className="logo" to="/" aria-label="Tenis Urbano, inicio">
          TENIS<span>URBANO</span>
        </Link>
        <nav
          id="main-nav"
          className={`nav ${open ? 'open' : ''}`}
          aria-label="Navegación principal"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          {['Todos', 'Hombre', 'Mujer', 'Niños', 'Ofertas'].map((value) => {
            const active = location.pathname === '/catalogo' && category === value;
            return (
              <Link
                key={value}
                className={`nav-link ${value === 'Ofertas' ? 'nav-sale' : ''} ${active ? 'active' : ''}`}
                to={
                  value === 'Todos'
                    ? '/catalogo'
                    : `/catalogo?categoria=${encodeURIComponent(value)}`
                }
                aria-current={active ? 'page' : undefined}
              >
                {value}
              </Link>
            );
          })}
        </nav>
        <div className="header-actions">
          <Link
            className="icon-btn search-action"
            to="/catalogo?buscar=1"
            aria-label="Buscar"
            title="Buscar"
          >
            <Icon name="search" />
          </Link>
          <NavLink
            className="icon-btn counter-button"
            to="/favoritos"
            aria-label={`Favoritos (${favorites.length})`}
            title="Favoritos"
          >
            <Icon name="heart" />
            <span>{favorites.length}</span>
          </NavLink>
          <NavLink
            className="icon-btn counter-button"
            to="/carrito"
            aria-label={`Carrito (${cart.reduce((sum, item) => sum + item.qty, 0)})`}
            title="Carrito"
          >
            <Icon name="cart" />
            <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
          </NavLink>
        </div>
      </header>
      <div className="journey-bar">
        <nav className="journey-nav" aria-label="Recorrer la tienda">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/catalogo">Colección</NavLink>
          <NavLink to="/favoritos">Mis favoritos</NavLink>
          <NavLink to="/carrito">Mi carrito</NavLink>
        </nav>
        <span className="journey-message">
          Diseñados para seguir tu ritmo <span aria-hidden="true">↗</span>
        </span>
      </div>
      <main id="main-content" ref={main} tabIndex={-1}>
        {location.pathname !== '/' && (
          <nav className="breadcrumbs" aria-label="Ubicación actual">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              {routeLabels[location.pathname] || 'Producto'}
            </span>
          </nav>
        )}
        <Outlet />
      </main>
      <Benefits />
      <footer>
        <Link className="logo logo-light" to="/">
          TENIS<span>URBANO</span>
        </Link>
        <p>Calzado para moverte a tu manera.</p>
        <span>© 2026 Tenis Urbano</span>
      </footer>
    </>
  );
}
