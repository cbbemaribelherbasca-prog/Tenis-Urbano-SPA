const benefits = [
  ['Envíos nacionales', 'Entrega segura en todo el país.'],
  ['Compra protegida', 'Tus datos siempre están seguros.'],
  ['Cambios fáciles', 'Hasta 30 días para cambiar tu talla.'],
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Beneficios de compra">
      {benefits.map(([title, description], index) => (
        <article key={title}>
          <span>0{index + 1}</span>
          <div>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
