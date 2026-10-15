# Tenis Urbano · H3 · SPA navegable y formulario

Versión renovada de la tienda de calzado con React y React Router. Incluye seis rutas, catálogo interactivo, favoritos, carrito persistente y un formulario funcional de confirmación de compra de demostración.

Repositorio del proyecto: [Tenis Urbano](https://github.com/cbbemaribelherbasca-prog/Tenis-Urbano).

La evidencia de este documento corresponde a la versión local actual. Su publicación en GitHub Pages se realiza con el workflow incluido en `.github/workflows/deploy.yml` después de subir los cambios a `main`.

## Presentación y navegación

La nueva identidad utiliza una portada oscura, acentos verdes, tarjetas con bordes redondeados y animaciones de entrada y elevación al pasar el cursor. Los detalles se abren en un modal con fondo oscurecido, manteniendo la vista de origen.

La navegación combina categorías, accesos a Inicio, Colección, Favoritos y Carrito, una indicación de ubicación y pasos de compra. La portada pertenece a Inicio; las categorías abren directamente el catálogo. La interfaz es adaptable a escritorio y móvil y utiliza las fuentes DM Sans y Space Grotesk incluidas localmente.

| Vista            | Ruta              | Evidencia                                            |
| ---------------- | ----------------- | ---------------------------------------------------- |
| Inicio           | `/#/`             | [Portada renovada](docs/01-inicio.png)               |
| Colección        | `/#/catalogo`     | [Catálogo y filtros](docs/02-catalogo.png)           |
| Favoritos        | `/#/favoritos`    | [Productos guardados](docs/03-favoritos.png)         |
| Producto         | `/#/producto/:id` | [Modal y talla seleccionada](docs/04-detalle.png)    |
| Carrito          | `/#/carrito`      | [Selección y resumen](docs/11-carrito-spa.png)       |
| Confirmar compra | `/#/checkout`     | [Formulario completo](docs/13-formulario-valido.png) |

Las categorías se representan con el parámetro `categoria`, por ejemplo `/#/catalogo?categoria=Mujer`. La búsqueda de la cabecera utiliza `buscar=1` para enfocar el campo. El enlace Explorar colección lleva a `/#/catalogo?ver=coleccion`. Las rutas mantienen el comportamiento Atrás/Adelante y admiten recarga directa; la ruta de confirmación vacía presenta un enlace al catálogo.

## Flujo principal

1. Inicio → Explorar colección → filtrar o buscar un modelo.
2. Abrir el producto en el modal, elegir una talla y observar la confirmación debajo de la imagen.
3. Agregar al carrito → revisar cantidades y total.
4. Finalizar compra → completar las preferencias de entrega.
5. Confirmar compra → ver el modal Compra exitosa con el total y las preferencias elegidas.
6. Volver al catálogo → vaciar el carrito y regresar a la colección.

Los favoritos pueden guardarse desde las tarjetas y revisarse en su propia vista. El formulario permite volver al carrito antes de confirmar. Cerrar la confirmación con X o Escape conserva los valores del formulario y devuelve el foco al botón de confirmación.

## Formulario funcional

El formulario utiliza exclusivamente preferencias de entrega; no solicita nombres, correos, direcciones, tarjetas ni datos personales. La confirmación es local y no realiza cobros ni envía información a servicios externos.

| Campo           | Validación y retroalimentación                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| Departamento    | Debe ser uno de los nueve departamentos disponibles.                                                        |
| Modalidad       | Es obligatorio elegir retiro en tienda o envío nacional.                                                    |
| Fecha preferida | Debe ser una fecha válida desde mañana y dentro de los próximos 30 días. Se comprueba nuevamente al enviar. |
| Confirmación    | Es obligatorio aceptar que la compra es una demostración.                                                   |

Un envío vacío o inválido muestra un resumen enfocado de errores y mensajes junto a cada campo. Los enlaces del resumen llevan al control correspondiente. Los mensajes se actualizan al corregir los valores y la confirmación solo aparece después de validar todos los campos.

El resumen recalcula el total al cambiar la modalidad: el retiro es gratis; el envío nacional cuesta Bs 25 y es gratis desde Bs 500. Antes de elegir la modalidad, la entrega figura como Por definir.

[Evidencia de errores](docs/12-formulario-errores.png) · [Formulario válido](docs/13-formulario-valido.png) · [Confirmación](docs/10-compra-exitosa.png) · [Formulario móvil](docs/14-formulario-movil.png)

## Manejo del estado

| Estado                   | Ubicación y comportamiento                                                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Favoritos y carrito      | `ShopProvider`, compartido entre rutas y conservado en `localStorage`. Incluye producto, talla y cantidad; tolera datos almacenados inválidos o almacenamiento no disponible.                              |
| Categoría                | Parámetro de la URL, sincronizado con la navegación principal.                                                                                                                                             |
| Búsqueda, estilo y orden | Estado local de `Catalog`; modifica la lista sin recargar el documento.                                                                                                                                    |
| Modal de producto        | La ruta conserva la ubicación de origen; el diálogo restaura el foco y la posición al cerrarse.                                                                                                            |
| Talla                    | Estado local de `Product`, con indicador visible y validación antes de agregar al carrito.                                                                                                                 |
| Preferencias y errores   | Estado local de `Checkout`, sin persistir ni enviar esos valores a un servidor. Se conservan al cerrar el modal de éxito mientras la vista sigue abierta y se reinician al salir de la vista o recargarla. |
| Confirmación             | Estado local de `Checkout`; volver al catálogo limpia el carrito compartido y su persistencia.                                                                                                             |

## Componentes y reutilización

| Componente                        | Responsabilidad                                                                                                                  |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `App`                             | Relaciona las seis rutas con las vistas, permite el modal sobre la vista anterior y contempla páginas inexistentes.              |
| `Layout`                          | Cabecera, navegación activa, ubicación actual, foco al cambiar de vista, beneficios y footer.                                    |
| `Hero`                            | Portada y acceso a la colección.                                                                                                 |
| `Catalog` y `ProductCard`         | Búsqueda, filtros, orden y tarjetas de producto. Las mismas tarjetas se utilizan en Favoritos.                                   |
| `Product`                         | Contenido del detalle, talla, favoritos y agregado al carrito.                                                                   |
| `Modal`                           | Diálogo reutilizable con cierre, fondo inerte, ciclo de foco y recuperación del foco. Se utiliza en Producto y Checkout.         |
| `Cart`                            | Cantidades, eliminación y acceso al formulario.                                                                                  |
| `Checkout`                        | Preferencias de entrega, validación, errores y confirmación.                                                                     |
| `FormField`                       | Etiqueta, ayuda y error de cada campo.                                                                                           |
| `Dropdown`                        | Selector reutilizable con opciones, teclado, estado inválido y descripción accesible; se utiliza en ordenamiento y departamento. |
| `OrderSummary`                    | Resumen, subtotal, entrega y total; se comparte entre Carrito y Checkout.                                                        |
| `PurchaseSteps`                   | Indicador de progreso común a Carrito y Checkout.                                                                                |
| `ShopProvider`                    | Operaciones y persistencia de favoritos y carrito.                                                                               |
| `EmptyState`, `Benefits` e `Icon` | Mensajes de recuperación, beneficios e iconos comunes.                                                                           |

El código separa vistas en `pages`, componentes compartidos en `components`, estado en `context` y catálogo y reglas de validación en `data`. `src/experience.css` define la identidad visual renovada sobre los estilos existentes.

**Decisión de reutilización:** compartir `OrderSummary` evita calcular o presentar totales de forma diferente entre el carrito y el formulario. `Modal` centraliza la interacción accesible y `FormField` mantiene consistentes las etiquetas, ayudas y mensajes de validación.

## Mejora de accesibilidad

Al enviar datos inválidos, el foco pasa al resumen de errores, anunciado mediante `role="alert"`. Cada campo se relaciona con su etiqueta, ayuda y error mediante identificadores y `aria-describedby`; los errores se marcan con `aria-invalid`. Esto permite localizar el problema sin depender únicamente del color.

Los modales mantienen Tab y Shift+Tab dentro del diálogo, admiten Escape y devuelven el foco al elemento de origen. Los selectores admiten flechas y Enter. Las rutas tienen título y navegación activa, existe un enlace para saltar al contenido y las animaciones se desactivan cuando el usuario solicita movimiento reducido.

## Prueba realizada y resultados

La compilación de producción y la comprobación de formato finalizaron correctamente. Las **nueve pruebas de navegador** cubren:

1. Cinco vistas conectadas, imágenes, favoritos, talla y carrito persistente sin errores de consola en el recorrido.
2. Filtros, rutas inválidas y almacenamiento corrupto.
3. Navegación móvil sin desbordamiento horizontal.
4. Categorías, iconos, fuentes y orden visual de controles.
5. Modal, foco por teclado, cierre, talla, recarga y enlaces directos.
6. Ordenamiento con mouse y teclado, y selector móvil.
7. Formulario vacío → cuatro errores → corrección → confirmación → carrito vacío persistente.
8. Fecha pasada rechazada, envío de Bs 25, retiro gratis, envío gratis desde Bs 500 y confirmación móvil.
9. Acceso al formulario sin carrito y respeto de movimiento reducido, junto con la animación al habilitar movimiento.

**Ejemplo verificable:** con Pulso Negro, talla 36 y una unidad, el subtotal es Bs 389. Envío nacional da Bs 414; retiro da Bs 389. Una fecha pasada bloquea el envío y enfoca el resumen de errores. Con una fecha válida y los campos completos, aparece Compra exitosa. Al volver al catálogo, el contador queda en cero y el carrito sigue vacío después de recargar.

Las capturas corresponden a datos de demostración sin información personal. El repositorio y los archivos de entrega no requieren claves ni tokens de usuario.
