import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { money } from '../data/products';
import { departments, deliveryWindow, validateCheckout } from '../data/checkout';
import Dropdown from '../components/Dropdown';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import OrderSummary, { cartSubtotal } from '../components/OrderSummary';
import PurchaseSteps from '../components/PurchaseSteps';

const initialValues = { department: '', method: '', date: '', accepted: false };
const fieldLabels = {
  department: 'Departamento',
  method: 'Modalidad de entrega',
  date: 'Fecha preferida',
  accepted: 'Confirmación de demostración',
};

export default function Checkout() {
  const { cart, clearCart } = useShop();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const summary = useRef(null);
  const range = deliveryWindow();
  const departmentOptions = useMemo(
    () =>
      departments.map((value) => ({
        value,
        label: value,
        description: 'Cobertura nacional',
      })),
    []
  );
  const subtotal = cartSubtotal(cart);
  const shipping = values.method === 'delivery' && subtotal < 500 ? 25 : 0;
  const completeCount = Object.keys(initialValues).filter((key) =>
    Boolean(values[key])
  ).length;

  function update(name, value) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted || errors[name]) setErrors(validateCheckout(next));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setAttempted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setCompleted(true);
  }

  function finish() {
    clearCart();
    setCompleted(false);
    navigate('/catalogo?ver=coleccion', { replace: true });
  }

  if (!cart.length)
    return (
      <section className="catalog">
        <EmptyState title="Primero elige tu próximo par">
          Agrega un producto y una talla al carrito para continuar con la confirmación.
        </EmptyState>
      </section>
    );

  return (
    <section className="catalog checkout-page">
      <PurchaseSteps current="checkout" />
      <div className="page-intro">
        <div>
          <p className="eyebrow">Último paso · Sin cobros reales</p>
          <h1>
            Tu próximo par,
            <br />
            <em>más cerca.</em>
          </h1>
        </div>
        <p>
          Elige cómo recibirlo y confirma tu selección.
          <br />
          Solo necesitas tus preferencias de entrega.
        </p>
      </div>
      <div className="commerce-layout">
        <form
          className="checkout-form"
          noValidate
          onSubmit={submit}
          aria-labelledby="checkout-form-title"
        >
          <div className="form-section-heading">
            <div>
              <span className="section-number">01</span>
              <h2 id="checkout-form-title">Preferencias de entrega</h2>
            </div>
            <span className="form-progress">{completeCount} de 4 completos</span>
          </div>
          <p className="form-intro">
            Los campos con * son obligatorios. Esta experiencia utiliza solo tus
            preferencias de entrega, sin información personal ni de pago.
          </p>
          {Object.keys(errors).length > 0 && (
            <div className="form-error-summary" ref={summary} tabIndex={-1} role="alert">
              <strong>Revisa los campos para continuar</strong>
              <ul>
                {Object.entries(errors).map(([name, error]) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => document.getElementById(name)?.focus()}
                    >
                      {fieldLabels[name]}: {error}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <FormField
            id="department"
            label="Departamento"
            help="Selecciona el destino de esta demostración."
            error={errors.department}
          >
            <Dropdown
              inputId="department"
              label="Departamento"
              value={values.department}
              options={departmentOptions}
              placeholder="Elige un departamento"
              onChange={(value) => update('department', value)}
              invalid={Boolean(errors.department)}
              describedBy={`department-help ${errors.department ? 'department-error' : ''}`}
            />
          </FormField>
          <fieldset
            className="delivery-options"
            aria-describedby={errors.method ? 'method-error' : undefined}
          >
            <legend>
              Modalidad de entrega <span aria-hidden="true">*</span>
            </legend>
            <label
              className={`delivery-option ${values.method === 'pickup' ? 'is-selected' : ''}`}
            >
              <input
                id="method"
                type="radio"
                name="method"
                value="pickup"
                checked={values.method === 'pickup'}
                onChange={() => update('method', 'pickup')}
                aria-invalid={Boolean(errors.method)}
                aria-describedby={errors.method ? 'method-error' : undefined}
              />
              <span>
                <strong>Retiro en tienda</strong>
                <small>Recoge tu selección en el punto de entrega</small>
              </span>
              <b>Gratis</b>
            </label>
            <label
              className={`delivery-option ${values.method === 'delivery' ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name="method"
                value="delivery"
                checked={values.method === 'delivery'}
                onChange={() => update('method', 'delivery')}
                aria-invalid={Boolean(errors.method)}
                aria-describedby={errors.method ? 'method-error' : undefined}
              />
              <span>
                <strong>Envío nacional</strong>
                <small>Sin costo en compras desde Bs 500</small>
              </span>
              <b>{subtotal >= 500 ? 'Gratis' : 'Bs 25'}</b>
            </label>
            {errors.method && (
              <p className="field-error" id="method-error">
                {errors.method}
              </p>
            )}
          </fieldset>
          <FormField
            id="date"
            label="Fecha preferida"
            help="Desde mañana y hasta 30 días a partir de hoy."
            error={errors.date}
          >
            <input
              id="date"
              type="date"
              min={range.min}
              max={range.max}
              value={values.date}
              onChange={(event) => update('date', event.target.value)}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={`date-help ${errors.date ? 'date-error' : ''}`}
              required
            />
          </FormField>
          <div className="demo-consent">
            <label>
              <input
                id="accepted"
                type="checkbox"
                checked={values.accepted}
                onChange={(event) => update('accepted', event.target.checked)}
                aria-invalid={Boolean(errors.accepted)}
                aria-describedby={errors.accepted ? 'accepted-error' : undefined}
                required
              />
              <span>
                Entiendo que esta compra es una demostración y que no se realizará ningún
                cobro. *
              </span>
            </label>
            {errors.accepted && (
              <p className="field-error" id="accepted-error">
                {errors.accepted}
              </p>
            )}
          </div>
          <div className="form-actions">
            <Link className="back-link" to="/carrito">
              <span aria-hidden="true">← </span>Volver al carrito
            </Link>
            <button id="confirm-order" className="primary-button" type="submit">
              Confirmar compra <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
        <OrderSummary
          cart={cart}
          shipping={shipping}
          showShipping
          shippingPending={!values.method}
        >
          <div className="order-assurance">
            <span aria-hidden="true">✓</span>
            <p>
              Tu selección está guardada.
              <br />
              <strong>Puedes revisar el carrito antes de confirmar.</strong>
            </p>
          </div>
        </OrderSummary>
      </div>
      {completed && (
        <Modal
          className="checkout-modal"
          labelledBy="checkout-title"
          describedBy="checkout-description"
          closeLabel="Cerrar confirmación"
          returnFocusSelector="#confirm-order"
          onClose={() => setCompleted(false)}
        >
          <div className="checkout-success-icon" aria-hidden="true">
            ✓
          </div>
          <p className="eyebrow">El siguiente paso es tuyo</p>
          <h2 id="checkout-title">¡Compra exitosa!</h2>
          <p id="checkout-description">
            Tu selección se confirmó correctamente en esta demostración. No se realizó
            ningún cobro.
          </p>
          <div className="confirmation-delivery">
            <span>{values.department}</span>
            <span>
              {values.method === 'pickup' ? 'Retiro en tienda' : 'Envío nacional'}
            </span>
            <span>{values.date.split('-').reverse().join('/')}</span>
          </div>
          <div className="checkout-summary">
            <span>Total confirmado</span>
            <strong>{money(subtotal + shipping)}</strong>
          </div>
          <button className="primary-button" type="button" onClick={finish}>
            Volver al catálogo
          </button>
        </Modal>
      )}
    </section>
  );
}
