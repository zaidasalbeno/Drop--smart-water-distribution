# DROP

DROP is a responsive water delivery demo for household tank tracking, local supplier listings, delivery requests, and admin review. It uses React, Vite, Material UI, React Router, and browser LocalStorage.

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run lint` to check the source.

## Local demo admin

- Email: `admin@drop.local`
- Password: `DropAdmin2026!`

Household and supplier accounts can be registered in the app. Admin registration is disabled. Supplier accounts need to add their price, capacity, and availability in their profile before they can receive matching delivery requests.

The app saves accounts and records in this browser's LocalStorage. Passwords are stored as plain text, and the role checks are client side; use this app for demonstration only. **Clear local data** in the portal sidebar resets browser data and restores the demo admin account.

## Main features

- Household tank tracking and refill requests.
- Supplier listings, search, availability and capacity checks.
- Supplier request handling and delivery history.
- Admin review of users, suppliers, requests, and complaints.
- Role based routes and responsive layouts.

## Project map

- `src/App.jsx` - providers and route table.
- `src/Context/AppContext.jsx` - shared state, account actions, and persistence.
- `src/data.js` - initial demo account and request/supplier ranking helpers.
- `src/Pages/` - public, auth, household, supplier, and admin screens.
- `src/components/` - shared layout and interface components.
- `src/styles/` - landing, portal, responsive, and theme styles.
- `src/Theam/Theam.js` - Material UI theme.
