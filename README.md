<div align="center">

# UniShop

**A campus marketplace where students buy and sell electronics, fashion, study materials and everyday essentials.**

Buyers, sellers and admins each get their own workspace, on one full-stack React and Express app.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-live_chat-010101?logo=socketdotio)
![Stripe](https://img.shields.io/badge/Stripe-payments-635BFF?logo=stripe&logoColor=white)

</div>

## What it does

### For buyers
- Browse and filter the catalogue by category, price and rating, and open product pages with variants, reviews and seller details.
- Keep a wishlist and a cart that is saved between visits, then check out across several sellers in one order.
- Pay by card through Stripe. In demo mode, Mobile Money (MTN, Telecel Cash, AT Money) is also available, with Ghanaian number validation.
- Track orders, download PDF invoices, and get help through support tickets or live chat.

### For sellers
- A seller dashboard covering products, stock, orders, payouts and sales analytics.
- A public storefront page for each seller.
- Price and stock changes are saved together. The server checks ownership and reserved stock, so a seller can never oversell.

### For admins
- Analytics over 7, 30 or 90 days, with order export.
- Management of users, categories, products, reviews, promotions, banners and payouts.
- Homepage settings with a preview before publishing.
- A contact inbox, support tickets and live chat with customers.
- Packing slips for orders.

### Usability
The interface was reworked after a usability (HCI) review of real tasks: finding a product, checking out, managing stock and getting help. The problems found and how each was fixed are documented in [docs/HCI_USABILITY_ANALYSIS.md](docs/HCI_USABILITY_ANALYSIS.md).

## Tech stack

| Part | Built with |
|---|---|
| Frontend | React 19, React Router 7, Tailwind CSS 4, Framer Motion, Recharts, Tabler Icons, jsPDF |
| Backend | Node.js, Express, Socket.io, JWT authentication, express-validator, Helmet, rate limiting |
| Data | MySQL / MariaDB |
| Payments and email | Stripe (card), SendGrid / Nodemailer |

```
frontend/   React app: src/pages (buyer, seller/, admin/), src/components, src/context
backend/    Express API: src/routes, src/controllers, src/services, schema setup and seed scripts
docs/       usability analysis
```

## Try the demo

Open `/demo` and pick **Buyer**, **Seller** or **Admin**. Each button fills in a real login form, so it never skips authentication. [PORTFOLIO_WALKTHROUGH.md](PORTFOLIO_WALKTHROUGH.md) has:
- the sample accounts
- a five-minute presentation script
- notes on the engineering

Demo mode simulates payments, so no real money or card details are involved.

## Run it locally

You need Node.js 20.19+ or 22.12+ and a MySQL or MariaDB server.

1. Install everything:
   ```
   npm run install:all
   ```
2. Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`.
   - Fill in your database details.
   - Set `JWT_SECRET` to a random value of at least 32 characters.
   - Keep both files private.
3. Create the tables:
   ```
   cd backend && npm run db:init
   ```
4. Add accounts, using one of these:
   - **Demo (a separate database only):** set `PORTFOLIO_DEMO=true` and run `npm run demo:setup` to create the shared sample accounts.
   - **Private installation:** keep demo mode off and run `node create_admin.js`. It needs `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of 16 or more characters, and it never overwrites existing accounts.
5. Start both parts, in two terminals:
   ```
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

If you change the API's signing key, restart the API. Everyone will then need to sign in again.

## Tests

```
cd backend && npm test
```

The backend tests cover:
- settings permissions
- the limits on what the cart and payments accept
- Mobile Money number rules
- product validation and stock rules
