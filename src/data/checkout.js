export const departments = [
  'Beni',
  'Chuquisaca',
  'Cochabamba',
  'La Paz',
  'Oruro',
  'Pando',
  'Potosí',
  'Santa Cruz',
  'Tarija',
];

function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function deliveryWindow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const lastDay = new Date();
  lastDay.setDate(lastDay.getDate() + 30);
  return { min: localDate(tomorrow), max: localDate(lastDay) };
}

export function validateCheckout(values, range = deliveryWindow()) {
  const errors = {};
  if (!departments.includes(values.department))
    errors.department = 'Selecciona un departamento para la entrega.';
  if (!['pickup', 'delivery'].includes(values.method))
    errors.method = 'Selecciona cómo quieres recibir tu selección.';
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(values.date) &&
    !Number.isNaN(Date.parse(`${values.date}T12:00:00`)) &&
    localDate(new Date(`${values.date}T12:00:00`)) === values.date;
  if (!validDate || values.date < range.min || values.date > range.max)
    errors.date = 'Elige una fecha desde mañana y dentro de los próximos 30 días.';
  if (!values.accepted)
    errors.accepted = 'Confirma que entiendes que esta compra es de demostración.';
  return errors;
}
