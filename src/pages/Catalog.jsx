import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import Dropdown from '../components/Dropdown';

const sortOptions = [
  { value: 'featured', label: 'Destacados', description: 'Nuestra selección para ti' },
  { value: 'low', label: 'Menor precio', description: 'Del más económico al más caro' },
  { value: 'high', label: 'Mayor precio', description: 'Del más caro al más económico' },
];
export default function Catalog() {
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('Todos');
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const searchInput = useRef(null);
  const catalogSection = useRef(null);
  const requestedCategory = params.get('categoria');
  const Title = location.pathname === '/' ? 'h2' : 'h1';
  const category = ['Hombre', 'Mujer', 'Niños', 'Ofertas'].includes(requestedCategory)
    ? requestedCategory
    : 'Todos';
  function setCategory(value) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value === 'Todos') next.delete('categoria');
      else next.set('categoria', value);
      next.delete('buscar');
      return next;
    });
  }
  useEffect(() => {
    if (params.get('buscar') === '1') {
      searchInput.current?.focus();
      catalogSection.current?.scrollIntoView();
    } else if (params.get('ver') === 'coleccion') {
      catalogSection.current?.scrollIntoView();
    }
  }, [location.key, params]);
  const [sort, setSort] = useState('featured');
  const visible = products.filter(
    (product) =>
      (category === 'Todos' ||
        (category === 'Ofertas' ? product.oldPrice : product.audience === category)) &&
      (style === 'Todos' || product.style === style) &&
      `${product.name} ${product.style} ${product.color}`
        .toLocaleLowerCase('es')
        .includes(search.toLocaleLowerCase('es'))
  );
  if (sort !== 'featured')
    visible.sort((a, b) => (sort === 'low' ? a.price - b.price : b.price - a.price));
  return (
    <>
      <section className="catalog" id="catalogo" ref={catalogSection}>
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Catálogo</p>
            <Title>Elige tu próximo par</Title>
          </div>
          <p role="status">
            <span className="result-dot" aria-hidden="true" />
            {visible.length} modelos disponibles
          </p>
        </div>
        <div className="controls">
          <label className="search-box">
            <Icon name="search" />
            <input
              ref={searchInput}
              type="search"
              aria-label="Buscar productos"
              placeholder="Buscar por nombre o estilo…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="filter-scroll" role="group" aria-label="Filtrar por estilo">
            {['Todos', 'Running', 'Urbano', 'Casual'].map((value) => (
              <button
                key={value}
                className={`chip ${style === value ? 'active' : ''}`}
                aria-pressed={style === value}
                onClick={() => setStyle(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <Dropdown
            label="Ordenar productos"
            value={sort}
            options={sortOptions}
            onChange={setSort}
          />
        </div>
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {!visible.length && (
          <div className="empty-state">
            <h2>No encontramos resultados</h2>
            <button
              className="text-button"
              onClick={() => {
                setSearch('');
                setCategory('Todos');
                setStyle('Todos');
                setSort('featured');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </>
  );
}
