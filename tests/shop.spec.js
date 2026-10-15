import { test, expect } from '@playwright/test';

test('navega cinco vistas, conserva favoritos y carrito sin errores', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Muévete/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/01-inicio.png' });
  await page.getByRole('link', { name: /Explorar colección/ }).click();
  await expect(page).toHaveURL(/#\/catalogo\?ver=coleccion$/);
  await expect(page.locator('.product-card')).toHaveCount(9);
  await page.locator('.product-card').last().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0)
        )
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .getByRole('button', { name: 'Agregar a favoritos: Órbita Cobalto', exact: true })
    .click();
  await page.locator('.catalog').screenshot({ path: 'docs/02-catalogo.png' });
  await page.getByRole('link', { name: 'Favoritos (1)' }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.screenshot({ path: 'docs/03-favoritos.png', fullPage: true });
  await page
    .getByRole('link', { name: 'Ver detalles de Órbita Cobalto', exact: true })
    .click();
  await expect(page.locator('.selected-size-caption')).toHaveText(
    'Selecciona una talla para tu próximo par'
  );
  await page.getByRole('dialog').getByRole('button', { name: '39', exact: true }).click();
  await expect(page.locator('.selected-size-caption')).toHaveText(
    'Talla seleccionada: 39'
  );
  await page.getByRole('dialog').getByRole('button', { name: '38', exact: true }).click();
  await expect(page.locator('.selected-size-caption')).toHaveText(
    'Talla seleccionada: 38'
  );
  await page.getByRole('button', { name: 'Agregar al carrito' }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toHaveText(
    'Producto agregado al carrito.'
  );
  await page.screenshot({ path: 'docs/04-detalle.png', fullPage: true });
  await page.getByRole('link', { name: 'Ver carrito →' }).click();
  await expect(page.getByRole('status')).toContainText('Bs 429');
  await page.getByRole('button', { name: 'Aumentar cantidad de Órbita Cobalto' }).click();
  await expect(page.getByRole('status')).toContainText('Bs 858');
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Bs 858');
  await page.screenshot({ path: 'docs/05-carrito.png', fullPage: true });
  await page.goBack();
  await expect(page).toHaveURL(/#\/producto\/1$/);
  expect(errors).toEqual([]);
});

test('filtros, rutas inválidas y almacenamiento corrupto', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('tenis-carrito', '{invalid'));
  await page.goto('/#/catalogo');
  await page.reload();
  await page.getByRole('searchbox').fill('inexistente');
  await expect(
    page.getByRole('heading', { name: 'No encontramos resultados' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(page.locator('.product-card')).toHaveCount(9);
  await page.getByRole('link', { name: 'Mujer', exact: true }).click();
  await page.getByRole('button', { name: 'Running', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.goto('/#/producto/999');
  await expect(
    page.getByRole('heading', { name: 'Producto no encontrado' })
  ).toBeVisible();
  await page.goto('/#/ruta-inexistente');
  await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
});

test('navegación móvil sin desbordamiento horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.getByRole('link', { name: 'Todos', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Elige tu próximo par' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBe(true);
  await page.screenshot({ path: 'docs/06-movil.png' });
});

test('categorías y botones de la cabecera', async ({ page }) => {
  await page.goto('/');
  for (const [category, count] of [
    ['Hombre', 3],
    ['Mujer', 3],
    ['Niños', 3],
    ['Ofertas', 5],
    ['Todos', 9],
  ]) {
    const link = page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name: category, exact: true });
    await link.click();
    await expect(page.locator('.product-card')).toHaveCount(count);
    await expect(link).toHaveAttribute('aria-current', 'page');
    await expect(
      page.getByRole('heading', { name: 'Elige tu próximo par' })
    ).toBeVisible();
  }
  await page.getByRole('link', { name: 'Buscar', exact: true }).click();
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('400 16px "DM Sans"'))).toBe(
    true
  );
  expect(
    await page.evaluate(() => document.fonts.check('700 32px "Space Grotesk"'))
  ).toBe(true);
  const searchBounds = await page.locator('.search-box').boundingBox();
  const filtersBounds = await page.locator('.filter-scroll').boundingBox();
  const sortBounds = await page.getByLabel('Ordenar productos').boundingBox();
  expect(searchBounds.x + searchBounds.width).toBeLessThanOrEqual(filtersBounds.x);
  expect(filtersBounds.x + filtersBounds.width).toBeLessThanOrEqual(sortBounds.x);
  await page.getByRole('searchbox').fill('Vector Azul');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Favoritos (0)' }).click();
  await expect(
    page.getByRole('heading', { name: 'Favoritos', exact: true })
  ).toBeVisible();
  await page.getByRole('link', { name: 'Carrito (0)' }).click();
  await expect(page.getByRole('heading', { name: /Listos para/ })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('link', { name: 'Buscar', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Buscar', exact: true }).click();
  await expect(page.getByRole('searchbox')).toBeFocused();
});

test('modal de producto conserva el catálogo y permite cerrar y validar talla', async ({
  page,
}) => {
  await page.goto('/#/catalogo?categoria=Mujer');
  const productLink = page.getByRole('link', {
    name: 'Ver detalles de Arena Club',
    exact: true,
  });
  await productLink.click();
  const modal = page.getByRole('dialog', { name: 'Arena Club' });
  await expect(modal).toBeVisible();
  await expect(page.locator('body')).toHaveClass('locked');
  await expect(page.locator('.product-card')).toHaveCount(3);
  const closeButton = modal.getByRole('button', { name: 'Cerrar detalles' });
  const addButton = modal.getByRole('button', { name: 'Agregar al carrito' });
  await closeButton.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(addButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();
  await page.screenshot({ path: 'docs/09-refactor-modal.png' });
  await modal.getByRole('button', { name: 'Agregar al carrito' }).click();
  await expect(modal.getByRole('alert')).toHaveText(
    'Selecciona una talla para continuar.'
  );
  await expect(
    page.getByRole('link', { name: 'Carrito (0)', includeHidden: true })
  ).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/catalogo\?categoria=Mujer$/);
  await expect(productLink).toBeFocused();
  await productLink.click();
  await modal.getByRole('button', { name: 'Cerrar detalles' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await productLink.click();
  await expect(modal).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/#/producto/1');
  await expect(page.getByRole('dialog', { name: 'Órbita Cobalto' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Órbita Cobalto' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBe(true);
  await page.screenshot({ path: 'docs/07-modal-movil.png' });
  await page.getByRole('button', { name: 'Cerrar detalles' }).click();
  await expect(page).toHaveURL(/#\/catalogo$/);
  await expect(page.locator('body')).not.toHaveClass('locked');
});

test('desplegable visual ordena y funciona con teclado y en móvil', async ({ page }) => {
  await page.goto('/#/catalogo?ver=coleccion');
  const trigger = page.getByRole('button', { name: 'Ordenar productos', exact: true });
  await trigger.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.screenshot({ path: 'docs/08-dropdown.png' });
  await page.getByRole('option', { name: /Menor precio/ }).click();
  await expect(page.locator('.product-card h3').first()).toHaveText('Lino Natural');
  await expect(trigger).toBeFocused();
  await trigger.press('ArrowDown');
  await page.getByRole('listbox').press('ArrowDown');
  await page.getByRole('listbox').press('Enter');
  await expect(page.locator('.product-card h3').first()).toHaveText('Cima Pro');
  await trigger.click();
  await page.getByRole('listbox').press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('heading', { name: 'Elige tu próximo par' }).click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  const bounds = await page.locator('.dropdown-panel').boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'Cerrar opciones' }).click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
});

async function seedCart(page, qty = 1) {
  await page.goto('/');
  await page.evaluate(
    (quantity) =>
      localStorage.setItem(
        'tenis-carrito',
        JSON.stringify([{ id: 2, size: 36, qty: quantity }])
      ),
    qty
  );
  await page.goto('/#/carrito');
  await page.reload();
}

async function completePreferences(page, method = 'pickup') {
  await page.getByRole('button', { name: 'Departamento', exact: true }).click();
  await page.getByRole('option', { name: /Cochabamba/ }).click();
  await page
    .getByRole('radio', {
      name: method === 'pickup' ? /Retiro en tienda/ : /Envío nacional/,
    })
    .check();
  const tomorrow = await page.evaluate(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });
  await page.getByLabel(/Fecha preferida/).fill(tomorrow);
  await page.getByRole('checkbox', { name: /Entiendo que esta compra/ }).check();
}

test('formulario valida, confirma, limpia el carrito y vuelve al catálogo', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await seedCart(page);
  await page.screenshot({ path: 'docs/11-carrito-spa.png', fullPage: true });
  const checkout = page.getByRole('button', { name: 'Finalizar compra', exact: true });
  await expect(checkout).toHaveCSS('background-color', 'rgb(23, 23, 23)');
  await checkout.hover();
  await expect(checkout).toHaveCSS('background-color', 'rgb(216, 58, 67)');
  await checkout.click();
  await expect(page).toHaveURL(/#\/checkout$/);
  const confirm = page.getByRole('button', { name: 'Confirmar compra' });
  await confirm.click();
  await expect(page.getByRole('alert')).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Departamento', exact: true })
  ).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.field-error')).toHaveCount(4);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/12-formulario-errores.png', fullPage: true });
  await completePreferences(page);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Bs 389');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/13-formulario-valido.png', fullPage: true });
  await confirm.click();
  const modal = page.getByRole('dialog', { name: '¡Compra exitosa!' });
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Bs 389');
  await expect(modal).toContainText('Cochabamba');
  await expect(modal).toContainText('No se realizó ningún cobro.');
  await page.screenshot({ path: 'docs/10-compra-exitosa.png' });
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
  await expect(confirm).toBeFocused();
  await expect(page.getByLabel(/Fecha preferida/)).not.toHaveValue('');
  await confirm.click();
  await modal.getByRole('button', { name: 'Volver al catálogo' }).click();
  await expect(page).toHaveURL(/#\/catalogo\?ver=coleccion$/);
  await expect(page.getByRole('link', { name: 'Carrito (0)' })).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'Carrito (0)' }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu carrito está vacío' })
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('fecha inválida, envío calculado y formulario móvil', async ({ page }) => {
  await seedCart(page);
  await page.getByRole('button', { name: 'Finalizar compra' }).click();
  await completePreferences(page, 'delivery');
  await expect(page.getByRole('status')).toContainText('Bs 414');
  await page.getByLabel(/Fecha preferida/).fill('2000-01-01');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await expect(page.getByRole('alert')).toContainText('Elige una fecha desde mañana');
  await expect(page.getByLabel(/Fecha preferida/)).toHaveAttribute(
    'aria-invalid',
    'true'
  );
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('radio', { name: /Retiro en tienda/ }).check();
  await expect(page.getByRole('status')).toContainText('Bs 389');
  await page.getByRole('link', { name: 'Volver al carrito', exact: true }).click();
  await page.getByRole('button', { name: 'Aumentar cantidad de Pulso Negro' }).click();
  await page.getByRole('button', { name: 'Finalizar compra' }).click();
  await completePreferences(page, 'delivery');
  await expect(page.getByRole('status')).toContainText('Bs 778');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/14-formulario-movil.png', fullPage: true });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBe(true);
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  const modal = page.getByRole('dialog', { name: '¡Compra exitosa!' });
  await expect(modal).toBeVisible();
  const bounds = await modal.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
});

test('ruta de confirmación vacía y movimiento reducido', async ({ page }) => {
  await page.goto('/#/checkout');
  await expect(
    page.getByRole('heading', { name: 'Primero elige tu próximo par' })
  ).toBeVisible();
  await expect(page.getByRole('form')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explorar catálogo →' }).click();
  await page.getByRole('link', { name: 'Inicio', exact: true }).first().click();
  await expect(page.locator('.hero-image img')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.product-card').first()).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const card = page.locator('.product-card').first();
  await card.hover();
  await expect
    .poll(() =>
      card.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42)
    )
    .toBeLessThan(-5);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('transform', 'none');
});
