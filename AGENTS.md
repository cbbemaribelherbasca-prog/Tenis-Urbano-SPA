# Project guidance

## Scope and product

This file applies to the entire repository. Tenis Urbano is a Spanish-language,
Bolivia-focused footwear demo built with React, React Router, Vite, and plain CSS.
Prices use bolivianos (`Bs`). Preserve accents and UTF-8 encoding.

The active application starts at `index.html` and `src/main.jsx`. Root `app.js` and
the historical `tenis-urbano-html-css-js/` directory belong to the original static
site; do not load them into the React app or edit them for ordinary SPA changes.

Inspect the working tree before editing. Existing modified and untracked files may
contain ongoing user work; preserve unrelated changes and do not reset the checkout.

## Architecture

- `src/App.jsx`: route definitions and background-location routing for product modals.
- `src/pages/`: route-specific views: Home, Catalog, Favorites, Product, Cart, Checkout.
- `src/components/`: reusable UI, including Layout, Modal, Dropdown, ProductCard,
  FormField, OrderSummary, and PurchaseSteps.
- `src/context/ShopContext.jsx`: shared favorites/cart state and persistence.
- `src/data/products.js`: product catalog, asset resolution, and `money` formatting.
- `src/data/checkout.js`: department choices, delivery date limits, and form validation.
- `tests/shop.spec.js`: Playwright browser tests and screenshot evidence.
- `docs/`: visual evidence and refactor documentation.
- `entrega/`: ignored delivery ZIPs and staging copies, not the editable source of truth.

Use functional components, hooks, JSX, and ES modules. Follow the existing JavaScript
stack; do not add TypeScript, a UI framework, or another state/router library unless
the task calls for it. Reuse existing components before creating alternatives.

## Navigation and state contracts

The app uses `HashRouter` for static hosting. Keep these routes working through
navigation, direct links, reloads, and browser Back/Forward:

| Route             | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `/#/`             | Home and collection preview              |
| `/#/catalogo`     | Searchable, filterable collection        |
| `/#/favoritos`    | Saved products                           |
| `/#/producto/:id` | Product dialog over its originating view |
| `/#/carrito`      | Quantities and order summary             |
| `/#/checkout`     | Validated delivery-preferences form      |

Preserve the `categoria`, `buscar=1`, and `ver=coleccion` query conventions. Use React
Router links and navigation instead of document reloads or DOM-built HTML.

- Product links carry `backgroundLocation`. Closing the modal preserves the source
  view, filters, focus, and scroll position. Direct product links still work.
- `ShopProvider` owns favorites and cart changes. Keep the existing localStorage keys
  `tenis-favoritos` and `tenis-carrito` compatible and tolerate malformed or unavailable
  storage. A cart line is identified by product ID and size.
- Keep transient field values and validation errors local to Checkout. They are not
  persisted or sent to a server.
- Opening the success dialog does not clear the cart. Its **Volver al catálogo**
  action clears the cart and returns to the collection. Dismissing the dialog keeps
  the form values and cart intact.

## Checkout and privacy

This is a demonstration, not a payment integration. Do not introduce real charges,
credentials, tokens, personal data, or examples containing personal information.
The current form requests only department, delivery method, preferred date, and
acknowledgment that the purchase is a demo.

Preserve these rules unless the user requests a change:

- Department must be one of the nine configured departments.
- Delivery method is pickup or national shipping.
- Preferred date is a real local-calendar date from tomorrow through 30 days ahead.
- Demo acknowledgment is required before confirmation.
- Pickup is free. National shipping costs Bs 25 below Bs 500 and is free from Bs 500.

Keep validation in `validateCheckout`, recompute dates at runtime, and format prices
with `money`. Reuse `OrderSummary` and `cartSubtotal` so displayed amounts agree
across views. Do not replace validation with a success message shown unconditionally.

## Styling and accessibility

CSS loads in this order: `styles.css`, `src/shell.css`, `src/experience.css`.
`experience.css` defines the current navy/green design. Inspect existing selectors
before adding overrides; avoid escalating specificity or duplicating whole sections.
Fonts come from local Fontsource dependencies, not external font requests. Import
assets through Vite so they remain available in production under a repository path.

- Preserve responsive layouts without horizontal overflow; check desktop and mobile.
- Honor `prefers-reduced-motion` for card, image, and dialog animation.
- Provide visible keyboard focus, meaningful labels, and semantic controls.
- Reuse `Modal` for dialogs: accessible title/description, inert background, scroll
  lock, Tab/Shift+Tab cycling, Escape/X/outside-click closing, and focus restoration.
  Keep router and purchase decisions in the caller rather than in Modal.
- Reuse Dropdown keyboard handling and its invalid/described-by support.
- Associate field labels, help, and errors using IDs, `aria-describedby`, and
  `aria-invalid`. Invalid submissions focus the error summary with `role="alert"`;
  error-summary controls focus the corresponding fields.
- Keep navigation state, breadcrumbs, purchase steps, and document titles coherent.

## Commands and verification

Run commands from the repository root. Use Node.js 22.12+ in the Node 22 release line;
Node 22.17.0 was used during development. `npm ci` installs the locked dependencies.
On Windows PowerShell, use `npm.cmd` if script policy blocks `npm.ps1`; changing
machine-wide execution policy is unnecessary.

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
npm.cmd run format:check
npm.cmd test
```

Development normally uses `http://127.0.0.1:5173/#/`; preview normally uses port 4173.
Do not use `file://` or Live Server for the React source. Apply Prettier only to files
being changed when the working tree contains unrelated edits. Configuration uses
two-space indentation, single quotes, a 90-character print width, and ES5 trailing
commas. There is no configured lint or type-check script; do not report those checks
as passed.

For behavior changes, run the build and relevant browser checks. For changes spanning
navigation, state, or forms, run the full Playwright suite. For documentation-only
changes, inspect the content and check formatting; a browser run is not required.
Add assertions for meaningful user behavior rather than implementation details.

Playwright currently targets installed Microsoft Edge (`channel: 'msedge'`), uses
port 5173, and defaults to reduced motion. The suite includes an explicit animation
check with motion enabled. Screenshots are written into `docs/`; inspect regenerated
evidence for visual changes. Use runtime-relative dates in tests, not fixed future dates.

For focused tests in PowerShell, invoke Playwright directly if npm drops arguments:

```powershell
.\node_modules\.bin\playwright.cmd test --grep "modal"
```

`TEST_PRODUCTION=1` selects preview in the Playwright web-server configuration. Build
first and ensure a development server is not being reused on port 5173 before
claiming a production test. Report checks actually run and any limitations.

## Documentation, delivery, and deployment

Keep `README.md` in Spanish and aligned with the current routes, flow, state,
validation, accessibility, and evidence. The user prefers installation commands in
`GUIA-ENTREGA.md` or a delivery guide, not in the README. Keep reported test counts
and screenshots consistent with actual results.

When packaging is requested, assemble ZIPs from explicit file lists. Exclude `.git`,
`node_modules/`, `dist/`, test output, secrets, and recursive ZIP/staging copies.
Include `package.json` and `package-lock.json`. A full academic delivery includes
tests, README, and evidence; a runtime-only package needs source, assets, public
files, configuration, lockfile, and execution guidance. Do not silently remove
features or replace the working project's package metadata to create a reduced ZIP.

`.gitignore` excludes generated directories; source, assets, documentation, workflow,
and the lockfile must remain committable. Edit active source files rather than copies
inside `entrega/` or compiled output in `dist/`.

GitHub Pages deployment is defined in `.github/workflows/deploy.yml`: push to `main`
or manual dispatch, dependency installation, Vite build with base `/Tenis-Urbano/`,
then publication of `dist`. Pages must use GitHub Actions as its source. Keep the
base consistent with the repository URL if its name changes. A local build, commit,
or prepared ZIP does not prove the public site was deployed; verify the deployment
before claiming publication.
