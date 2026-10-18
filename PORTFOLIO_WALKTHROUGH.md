# UniShop portfolio walkthrough

UniShop demonstrates a React 19 storefront with seller and admin workspaces, an Express/MySQL API, role-based permissions, persistent cart and wishlist, simulated checkout, and real-time support.

## Start the current demo

Open http://127.0.0.1:5173/demo. Pick Buyer, Seller, or Admin and sign in using the prefilled form. These are shared seeded accounts, and changes persist in this local demo database.

| Role | Email | Password |
| --- | --- | --- |
| Buyer | kwame@example.com | Password@123 |
| Seller | seller1@technova.com | Password@123 |
| Admin | admin@nexstore.com | Admin@123 |

## Five-minute presentation

1. Buyer: filter the catalog, open a product, select a variant, save a favourite, and add to cart.
2. Checkout: use a sample Ghana address, select card, review the order, initialize the sandbox, and complete the clearly marked demo payment. No payment information or real money is required in portfolio mode.
3. Seller: open Inventory, edit an existing listing, change its price or stock, save, and check the storefront result. Open seller analytics.
4. Admin: choose a 7-, 30-, or 90-day analytics period and export recent orders. Change a homepage setting and preview it.
5. Support: submit a sample contact message, then open Admin → Contact Inbox to mark it read or resolved. Signed-in support tickets and live chat are separate demonstrations.

## Explain the engineering

- Product metadata, prices, and stock edits share a transaction. Ownership and reserved stock are checked on the server.
- Analytics uses database records and the selected date period. Empty periods display an honest empty state.
- Account roles are enforced by the API; demo role buttons fill real login forms rather than bypass authentication.
- Cart errors, loading states, input validation, and responsive layouts are part of the demonstration.
- Regression tests cover settings permissions, cart/payment boundaries, product validation, and stock rules.

## Local setup

Use Node 20.19+ or 22.12+ and a compatible running MySQL/MariaDB database. Install dependencies in frontend and backend. Configure backend/.env with DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT=3001 and PORTFOLIO_DEMO=true. On a new, empty database run npm run db:init from backend; then run npm run demo:setup. Setup adds missing portfolio tables/columns and missing demo accounts without resetting existing data or passwords. Existing seeded catalog records are retained.

Set VITE_API_URL=http://localhost:3001/api/v1 and VITE_PORTFOLIO_DEMO=true in frontend/.env. Run npm start in backend and npm run dev in frontend. Run npm test in backend and npm run build in frontend to verify.

Portfolio mode intentionally exposes sample credentials and simulates payments. Use a dedicated demo database. It is a portfolio presentation, not a claim of production payment readiness. Some seed scripts in the repository reset sample data; they are not needed for the setup above.

## Screenshots to capture

- Storefront and responsive catalog.
- Product detail, cart and demo order confirmation.
- Seller product price/stock editor.
- Admin analytics with a populated period.
- Storefront settings and contact inbox.

## Next optional portfolio improvements

Add a narrated walkthrough video, a clean deployment with disposable demo data, a frontend browser-test suite, and a concise architecture diagram. Advanced production finance, multi-server infrastructure and business traction are outside the current portfolio scope.
