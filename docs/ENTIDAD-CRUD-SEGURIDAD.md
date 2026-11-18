# Entidad principal, permisos CRUD y seguridad

## Alcance actual

La entidad principal de Tenis Urbano es **Producto**. Describe cada modelo que se
presenta en el catálogo, favoritos, detalle y carrito. Actualmente existe como un
objeto JavaScript en `src/data/products.js`; no hay una base de datos, autenticación,
API ni panel administrativo.

El catálogo se mantiene mediante cambios en el repositorio. Los permisos que siguen
son una **política propuesta para una futura API**, no una autorización ya aplicada
por la SPA. El visitante actual puede consultar el catálogo y modificar su selección
local, pero no dispone de operaciones para editar el catálogo desde la interfaz.

## Campos de Producto

| Campo actual  | Tipo en el proyecto | Responsabilidad                                                   | Ejemplo del catálogo                        |
| ------------- | ------------------- | ----------------------------------------------------------------- | ------------------------------------------- |
| `id`          | `number`            | Identificador único utilizado por las rutas, favoritos y carrito. | `2`                                         |
| `name`        | `string`            | Nombre comercial del modelo.                                      | Pulso Negro                                 |
| `audience`    | `string`            | Público del modelo: Hombre, Mujer o Niños.                        | Hombre                                      |
| `style`       | `string`            | Estilo usado por los filtros: Running, Urbano o Casual.           | Running                                     |
| `color`       | `string`            | Descripción del color.                                            | Negro / Crema                               |
| `price`       | `number`            | Precio actual en bolivianos.                                      | `389`                                       |
| `oldPrice`    | `number` o `null`   | Precio anterior, cuando existe una oferta.                        | `469`                                       |
| `image`       | `string`            | Referencia a una imagen local que Vite resuelve a una URL.        | `assets/tenis-negro.png`                    |
| `badge`       | `string`            | Etiqueta visual de novedad o descuento.                           | -17%                                        |
| `description` | `string`            | Descripción del modelo mostrada en el modal.                      | Silueta robusta con suela de gran tracción… |

El registro de ejemplo pertenece al catálogo de demostración y no contiene datos
personales. Las tallas disponibles se definen en la interfaz; **no son un campo de
Producto**. Tampoco existen campos de stock, propietario o rol dentro del modelo
actual.

El carrito referencia al producto mediante una línea `{ id, size, qty }`. Los
favoritos guardan identificadores. Precio, nombre e imagen se obtienen del catálogo,
en lugar de duplicarse en la línea persistida del carrito.

## Matriz CRUD propuesta

**C:** crear, **R:** leer, **U:** actualizar y **D:** eliminar.

Roles propuestos:

- **Visitante:** consulta el catálogo público y gestiona su selección.
- **Administrador de catálogo:** identidad autenticada y autorizada para gestionar
  productos en una futura API. Hoy esa responsabilidad corresponde al mantenimiento
  del repositorio; no existe ese rol dentro de la aplicación.

| Dato                         | C: crear                                               | R: leer | U: actualizar                                    | D: eliminar                                                                |
| ---------------------------- | ------------------------------------------------------ | ------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| `id`                         | Servicio del servidor al crear un producto autorizado. | Todos.  | Nadie; permanece estable.                        | Administrador, al eliminar el producto completo.                           |
| `name`, `description`        | Administrador.                                         | Todos.  | Administrador.                                   | Administrador, al eliminar el producto completo.                           |
| `audience`, `style`, `color` | Administrador.                                         | Todos.  | Administrador, con valores válidos.              | Administrador, al eliminar el producto completo.                           |
| `image`                      | Administrador.                                         | Todos.  | Administrador, usando recursos permitidos.       | Administrador, al sustituir el recurso o eliminar el producto.             |
| `price`                      | Administrador.                                         | Todos.  | Administrador, con precio válido.                | Administrador, al eliminar el producto completo.                           |
| `oldPrice`                   | Administrador.                                         | Todos.  | Administrador.                                   | Administrador puede quitarlo con `null`.                                   |
| `badge`                      | Administrador.                                         | Todos.  | Administrador; debe ser coherente con la oferta. | Administrador puede retirar la etiqueta; el tipo actual requiere un texto. |

Eliminar un producto debe contemplar sus referencias en carritos y favoritos. Esa
política de eliminación y sus efectos todavía no están implementados en el backend,
porque no existe uno. El visitante nunca obtiene permisos de escritura sobre el
catálogo por agregar un producto a su carrito.

En la SPA actual, cualquier persona que utilice el mismo perfil del navegador puede
leer o modificar el carrito y los favoritos de ese perfil. `localStorage` no distingue
identidades ni garantiza que una selección pertenezca a un usuario autenticado.

## Regla de seguridad indispensable

**Toda creación, modificación o eliminación de productos debe autorizarse en el
servidor para cada solicitud y denegarse por defecto si la identidad no tiene el
permiso correspondiente.**

Ocultar botones en React, cambiar la URL o guardar un indicador de administrador en
`localStorage` no aplica esa regla. En una futura API, un visitante que envíe una
solicitud de modificación de precio directamente debe ser rechazado y el producto
debe permanecer sin cambios. Una solicitud autorizada también debe validar sus
campos y permitir únicamente los que el rol puede modificar.

Además, una compra real debe recalcular precios, promociones y envío desde datos
confiables del servidor; los importes enviados por el navegador no son una fuente
de autoridad. En esta versión solo existe una confirmación local de demostración,
sin cobros ni pedidos enviados a un servidor.

## Duda técnica específica

**Cuando exista una API, ¿conviene desactivar un producto o borrarlo físicamente si
su identificador ya está referenciado por carritos o pedidos, y qué respuesta recibirá
el cliente al intentar confirmar una selección con ese producto?**

Resolverlo define la integridad de las referencias y el comportamiento visible de
la compra. Hoy no hay historial de pedidos ni un campo de disponibilidad, por lo que
no se puede asumir una solución ya implementada.

## Respuesta que detecta una regla incompleta

> La regla «solo el administrador ve el botón Editar» queda incompleta: ocultar el
> botón no impediría que otra persona enviara una solicitud directamente a la API.
> Falta comprobar el permiso en el servidor para cada operación y validar los campos
> modificables. Una prueba útil sería intentar cambiar `price` sin autorización y
> verificar que se rechace la solicitud y que el precio original no cambie. También
> revisaría el almacenamiento del carrito: en un equipo compartido, otra persona con
> el mismo perfil del navegador puede ver la selección anterior.

Esta respuesta queda preparada para el debate; no se publicó en ningún servicio
externo. La consulta de un identificador de producto público no constituye por sí
sola un acceso indebido: el riesgo aparece cuando se permiten escrituras sin permiso
o se exponen datos que debían ser privados.

## Evidencia de la revisión

- Los campos de la tabla se contrastaron con `src/data/products.js`.
- La estructura y persistencia del carrito y favoritos se contrastaron con
  `src/context/ShopContext.jsx`.
- No se añadieron roles ficticios, autenticación aparente ni cambios al comportamiento
  del sitio. Las comprobaciones de una futura API son criterios propuestos, no
  resultados de pruebas ejecutadas contra un servidor existente.
