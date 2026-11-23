# DROP - Smart Water Distribution & Management

DROP is a responsive React single-page app for household tank management, supplier operations, delivery requests, and administration. It uses the existing Vite, React, Material UI, and React Router setup. The app starts empty. Create a household, supplier, or admin demo account from the registration page.

All user accounts, passwords, tanks, supplier records, delivery requests, and complaints are held in React state and saved in this browser's LocalStorage. Passwords are stored as plain text for this frontend demonstration. Use **Clear local data** in the portal sidebar to remove the saved records and start over.

## Run locally

```sh
npm install
npm run dev
```

`react-toastify` is used for shared success and error notifications. `npm run build` creates a production build.

## Main areas

- Public landing page, local login and registration, and role-based navigation.
- Household dashboard, tank management, supplier comparison, delivery requests, tracking, and profile.
- Supplier dashboard, request decisions, delivery status updates, delivery history, and business settings.
- Admin statistics, user suspension and activation, supplier verification, request management, and complaint resolution.
- Search, filters, validated forms, status feedback, empty states, and responsive layouts.

## How it works

`src/App.jsx` provides the Material UI theme, React Router, and app provider. Route elements select public or role-specific pages; `PortalRoute`, `Guard`, and `AppFrame` keep each portal inside its matching role layout. These checks are for the local demonstration only.

`AppContext` owns account and application records with React state. Effects save changes to `drop-data-v2` and `drop-user-v2` in LocalStorage. Page components use the `useApp` hook to read that context and call actions such as `register`, `login`, `patch`, and `reset`. Registration adds an account; supplier registration also creates its business record. Changes to tanks, suppliers, requests, and admin records update shared state and persist in the browser.

Pages call `setNotice(message, type)` after an action. `App.jsx` observes notices and displays them with React Toastify as success or error toasts. The priority and matching functions in `src/data.js` are ordinary JavaScript helpers used by request and supplier pages.

Authentication and role checks are frontend demonstrations only. They do not provide real security. Register an Admin demo account to access the admin area; this is intentionally available in the public registration form for coursework demonstrations.

## Algorithms (`src/data.js`)

1. `prioritizeRequests` orders requests by lower tank water percentage, higher urgency, then earlier creation time (longer waiting). Missing or invalid tank readings are ranked after valid readings; invalid urgency and time values use safe fallback ranks.
2. `matchSuppliers` first filters out unavailable suppliers and suppliers without enough capacity. It sorts remaining suppliers by lower price, then shorter local sample distance. It uses no maps or external services.

## Project layout

- `src/App.jsx` - Application entry and route table.
- `src/Context/AppContext.jsx` - Shared app state, account actions, and LocalStorage persistence.
- `src/Hooks/useApp.js` - Custom hook for the app context.
- `src/components/Layout/` - Public header, portal navigation, role guard, and shared shell.
- `src/components/Shared/` - Reusable page headings, metrics, tables, status chips, and forms.
- `src/components/Household/` - Reusable tank display components.
- `src/Pages/Public/` and `src/Pages/Auth/` - Landing, login, and registration pages.
- `src/Pages/Household/` - Household dashboard, tank tools, supplier matching, requests, and profile.
- `src/Pages/Supplier/` - Supplier dashboard, request queue, and delivery history.
- `src/Pages/Admin/` - Admin overview and management pages.
- `src/data.js` - Empty initial state and the two JavaScript algorithms.
- `src/Theam/Theam.js` - Shared Material UI theme; filename spelling retained.
- `src/App.css` and `src/index.css` - Responsive presentation and global styles.
