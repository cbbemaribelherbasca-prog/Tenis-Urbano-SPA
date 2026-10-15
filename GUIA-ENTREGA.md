# Guía para trasladar, ejecutar y subir la entrega React

Esta guía acompaña al proyecto. El README se mantiene centrado en los componentes y sus responsabilidades.

## 1. Archivo para adjuntar

Enviar `entrega/H3-Tenis-Urbano.zip`. Contiene el código React actualizado, imágenes, fuentes declaradas como dependencias, configuración, pruebas, capturas y documentación. No contiene dependencias instaladas, resultados generados ni la carpeta `.git`.

## 2. Requisitos de la otra máquina

- Node.js: el proyecto admite las versiones exigidas por Vite, `20.19.x` o posteriores de la rama 20, o `22.12.0` en adelante. La versión usada para verificar esta entrega es `22.17.0`.
- npm, incluido con Node.js. La entrega fue verificada con npm `10.9.2`.
- Git, para conservar el historial y subir cambios.
- Un navegador actualizado.
- Conexión a Internet para descargar las dependencias la primera vez.
- Una cuenta de GitHub con permiso de escritura en el repositorio de destino.

Comprobación desde una terminal:

```powershell
node --version
npm --version
 git --version
```

No hace falta instalar React globalmente: las dependencias están declaradas en `package.json`.

## 3. Preparar el proyecto y conservar su historial

Si la carpeta original ya es un clon del repositorio, abrir una terminal allí y consultar:

```powershell
git status
git remote -v
```

Conservar cualquier trabajo pendiente antes de copiar la entrega. Mantener la carpeta `.git` existente y comprobar que `origin` corresponde a `https://github.com/cbbemaribelherbasca-prog/Tenis-Urbano.git`.

Si la carpeta original solo contiene los archivos descargados y no tiene `.git`, crear un clon en otra carpeta para disponer del historial del mismo proyecto:

```powershell
git clone https://github.com/cbbemaribelherbasca-prog/Tenis-Urbano.git Tenis-Urbano-React
cd Tenis-Urbano-React
```

En la carpeta del repositorio:

```powershell
git switch -c entrega/h3-react
```

Extraer el ZIP y copiar su contenido directamente a la raíz del repositorio, reemplazando los archivos anteriores cuando corresponda. `package.json`, `index.html` y la carpeta `src` deben quedar al mismo nivel; evitar una carpeta adicional que contenga toda la entrega.

Conservar todos los archivos del ZIP, incluidos `.gitignore`, `.prettierignore` y `.prettierrc.json`. Los archivos principales son:

- `src/`, `assets/`, `public/`, `tests/` y `docs/`.
- `index.html`, `styles.css`, `package.json` y `package-lock.json`.
- `vite.config.js`, `playwright.config.js` y las configuraciones de formato.
- `README.md` y esta guía.
- `app.js`, conservado como referencia de la versión anterior.

## 4. Instalar y revisar el sitio

Desde la raíz, donde está `package.json`:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abrir la dirección que muestra la terminal, normalmente `http://127.0.0.1:5173/#/`. Mantener la terminal abierta; `Ctrl+C` detiene el servidor. Si el puerto está ocupado, usar la dirección alternativa que indique Vite.

El servidor procesa React y sus dependencias. El archivo HTML no se abre directamente con doble clic ni mediante Live Server para esta entrega.

La revisión visual incluye la portada, categorías, búsqueda, ordenamiento, favoritos, modal de producto, talla seleccionada y carrito. El cambio de talla actualiza la línea debajo de la imagen.

## 5. Comprobaciones opcionales

Comprobar compilación y formato:

```powershell
npm.cmd run build
npm.cmd run format:check
```

Para revisar la compilación:

```powershell
npm.cmd run preview
```

La dirección de vista previa normalmente es `http://127.0.0.1:4173/#/`.

Las pruebas automatizadas usan Microsoft Edge instalado:

```powershell
npm.cmd test
```

Si la máquina no tiene Edge, las pruebas necesitan ese navegador o la configuración equivalente para Chromium. Esto no impide ejecutar el sitio con los comandos del paso 4. La entrega fue verificada con nueve pruebas aprobadas.

## 6. Qué se sube y qué se excluye

`.gitignore` excluye únicamente estas carpetas:

| Carpeta              | Motivo                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| `node_modules/`      | Dependencias que se recuperan con `npm.cmd ci`.                        |
| `dist/`              | Compilación generada.                                                  |
| `test-results/`      | Resultados temporales de pruebas.                                      |
| `playwright-report/` | Reportes generados.                                                    |
| `entrega/`           | Archivo ZIP para traslado; el repositorio conserva el código extraído. |

El código de `src/`, las imágenes de `assets/`, `public/`, las pruebas, la documentación, `package.json` y `package-lock.json` sí se incluyen en el commit. No agregar claves, tokens, contraseñas ni datos personales.

## 7. Subir la versión React al mismo repositorio

Desde la raíz del repositorio:

```powershell
git status --short
git add .
git diff --cached --stat
```

Revisar la lista de archivos preparados antes del commit. Las carpetas excluidas no deben aparecer. Después:

```powershell
git commit -m "Implementar shell React con componentes y rutas"
git push -u origin entrega/h3-react
```

GitHub puede solicitar autenticación. Usar una cuenta con permiso de escritura. En esta máquina, el intento anterior fue rechazado con HTTP 403 porque la cuenta autenticada no tenía ese permiso; cambiar únicamente el nombre o correo del commit no cambia la cuenta autenticada.

En GitHub, crear un Pull Request desde `entrega/h3-react` hacia `main`, revisar los cambios y fusionarlo. El enlace de la rama permite revisar la entrega antes de fusionarla:

https://github.com/cbbemaribelherbasca-prog/Tenis-Urbano/tree/entrega/h3-react

Ese enlace estará disponible después de completar la subida. El enlace principal mostrará la nueva versión cuando se fusione el Pull Request.

## 8. Revisar después de la subida

La otra persona puede clonar el repositorio y abrir la rama entregada:

```powershell
git clone --branch entrega/h3-react https://github.com/cbbemaribelherbasca-prog/Tenis-Urbano.git
cd Tenis-Urbano
npm.cmd ci
npm.cmd run dev
```

Si el cambio ya está fusionado en `main`, puede clonar sin `--branch entrega/h3-react`. La URL local del sitio funciona en la máquina donde está ejecutándose el servidor.
