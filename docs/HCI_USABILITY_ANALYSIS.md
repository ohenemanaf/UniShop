# UniShop — HCI & Usability Analysis

This analysis guides the UniShop upgrade. Every problem below comes from the current code, with a file reference, so each fix can be checked.

## 1. Users

| User | Who they are | Device and context |
| --- | --- | --- |
| **Guest** | A student browsing without an account | Phone, often on mobile data, between lectures |
| **Buyer (customer)** | A registered student buying items | Mostly phone, some laptop |
| **Seller** | A student or small campus vendor selling items | Phone for orders, laptop for listings |
| **Admin** | The team that runs the platform | Laptop, long working sessions |

## 2. User goals

- **Guest:** find out what is for sale and what it costs, quickly and without signing up.
- **Buyer:** find the right item at a fair price, pay in a familiar way, and track the order until it arrives.
- **Seller:** list items quickly, keep stock and prices correct, fulfil orders, and get paid.
- **Admin:** keep the marketplace safe and running: approve sellers, moderate content, resolve support issues, and track performance.

## 3. Main tasks

| User | Main tasks |
| --- | --- |
| Guest | Search, filter by category and price, sort, open a product, read reviews |
| Buyer | Register or log in, add to cart or wishlist, check out (address, payment, review), track orders, download an invoice, leave a review, contact support or use live chat |
| Seller | Apply to sell, create or edit a product with variants and images, update stock and price, move orders from Pending to Shipped to Delivered, add tracking numbers, view analytics, request a payout |
| Admin | Approve seller applications, manage users and roles, manage categories, banners and promos, moderate reviews, process payouts, answer tickets and live chat, view analytics, change store settings |

## 4. Interface elements

- **Navigation:** top navbar (search, cart, notifications, theme toggle, account menu), mobile menu, admin and seller sidebars (`AdminLayout.jsx`, `SellerLayout.jsx`).
- **Search:** full-screen search overlay (`SearchOverlay.jsx`).
- **Catalog:** product grid and cards with image, price, sale or sold-out badge, star rating, wishlist heart and Quick Add (`ProductCard.jsx`); a filter panel with a price slider, categories and a sort dropdown (`Products.jsx`).
- **Product page:** image gallery, variant selector, quantity, Add to Cart, reviews and recommendations (`ProductDetail.jsx`).
- **Cart:** slide-out mini cart (`MiniCart.jsx`) and a full cart page.
- **Checkout:** three-step stepper (Shipping, Payment, Review), address form, payment options, promo code field (`Checkout.jsx`).
- **Feedback:** toasts (`ToastContext.jsx`), global loader, inline validation messages, empty states.
- **Dashboards:** stat tiles, Recharts graphs, data tables, status badges, image upload.
- **Support:** floating live chat bubble (`LiveChat.jsx`), support tickets, contact form.

## 5. Interaction methods

- Tap and click (buttons, cards, links), with hover effects on desktop
- Typing into search, forms and chat
- Dragging the price-range slider
- Selecting from dropdowns, radio buttons and variant chips
- Swiping and scrolling through galleries and product grids on phones
- Moving step by step through checkout
- Receiving real-time updates through Socket.io (new orders, chat messages)
- Light and dark theme toggle
- Keyboard navigation and screen readers. These are only partly supported (see problems 3 and 5).

## 6. Possible usability problems

| # | Problem | Where | Why it matters | Severity |
| --- | --- | --- | --- | --- |
| 1 | **Guests lose their place at login.** Tapping Add to Cart or Wishlist while signed out goes to `/login` without remembering the page. After login the user lands on the home page, not the product. | `ProductCard.jsx:55,81`, `ProductDetail.jsx:125,146,171` | Breaks the user's flow at the moment they are ready to buy. | High |
| 2 | **No guest cart.** The cart page needs an account (`ProtectedRoute`), and adding an item forces sign-up first. | `App.jsx` (`/cart` route), `CartContext.jsx` | Forcing sign-up before the user has decided to buy is a well-known cause of abandoned carts. | High |
| 3 | **Checkout labels are not linked to their inputs.** There are no `htmlFor` or `id` pairs, so screen readers do not announce the field names and clicking a label does not focus its input. The same applies to Account Settings, seller product forms and admin product forms. | `Checkout.jsx:301–327`, `AccountSettings.jsx`, `AdminProductCreate.jsx` | Accessibility (WCAG 1.3.1 and 4.1.2), and the target users are mostly on small touch screens. | High |
| 4 | **Mobile Money is hidden.** MTN MoMo, Vodafone Cash, AirtelTigo, bank transfer and cash on delivery are defined, but a filter keeps only "card". | `Checkout.jsx:386` | Most Ghanaian students pay with Mobile Money, so the only option shown is the one they use least. | High (product decision) |
| 5 | **Quick Add only appears on mouse hover.** It is invisible until hover (`opacity-0 group-hover`), so keyboard users never see it. It also silently adds the *first* variant, so a buyer can get the wrong size or colour without being told. | `ProductCard.jsx` (Quick Add overlay, `handleAddToCart`) | The feature is hard to discover, and the user is not told which variant was added. | Medium |
| 6 | **Browser `alert()` and `confirm()` pop-ups** are used for errors and deletions. They are inconsistent with the app's own toasts, block the whole page, and offer no undo. | `ProductDetail.jsx:160,188`, `SellerOrders.jsx:117,147`, `SellerProducts.jsx:56–78`, `Invoice.jsx:67`, six admin pages | Inconsistent feedback; "Are you sure?" pop-ups get dismissed by habit. | Medium |
| 7 | **Buttons are placed inside a link.** The wishlist and Quick Add buttons sit inside the card's `<Link>`. | `ProductCard.jsx` | Screen readers announce the controls confusingly, and the markup is invalid HTML. | Medium |
| 8 | **Very small text.** Badges and rating counts are 9–11px on cards. | `ProductCard.jsx` | Hard to read on phones and in bright sunlight. | Low |
| 9 | **Generic error messages.** Some messages, such as "Mock checkout failed" and "Error updating wishlist", do not tell the user what to do next. | `Checkout.jsx:226`, `ProductDetail.jsx:160` | The user has no way to recover from the error. | Low |

## 7. Possible improvements

| Fixes problem | Improvement | Effort |
| --- | --- | --- |
| 1 | Pass `state={{ from: location }}` on every redirect to login, and after login return the user to that page and finish the action they started. | Small (frontend only) |
| 2 | Keep a guest cart in `localStorage` and merge it into the account cart at login. Require sign-in only at checkout. | Medium (frontend and backend merge endpoint) |
| 3 | Add matching `id` and `htmlFor` to every form field, `aria-invalid` and `aria-describedby` on fields with errors, and the correct `autoComplete` values for addresses. | Small |
| 4 | Show Mobile Money first, at least in demo mode with a clear "simulated" label. Add MoMo phone-number entry and validation. | Medium (depends on the payment provider) |
| 5 | Show Quick Add on keyboard focus as well as hover (`group-focus-within`). If a product has more than one variant, open a variant picker instead of guessing. Name the variant in the "added to cart" toast. | Small |
| 6 | Replace `alert()` with the existing toast system. Replace `confirm()` with one reusable confirmation dialog, and offer Undo for reversible deletions. | Medium |
| 7 | Restructure the card so the link covers the image and title, with the buttons placed beside it rather than inside it. | Small |
| 8 | Set a 12px minimum for supporting text and 14px for prices. | Small |
| 9 | Rewrite error messages to say what happened and what to do next. | Small |

## 8. Evaluation methods

1. **Heuristic evaluation:** 3–5 evaluators score each screen against Nielsen's 10 heuristics. Fast, and the table above is a first pass.
2. **Cognitive walkthrough** of the main flows: guest to first purchase, seller listing a new item, admin approving a seller. Ask at each step: will the user know what to do, and will they see that it worked?
3. **Think-aloud usability testing** with 5 students per role on real phones. Measure:
   - task completion rate
   - time on task
   - number of errors
   - number of times the user needs help
4. **SUS (System Usability Scale)** questionnaire after testing. A score above 68 is above average. Compare the score before and after the upgrade.
5. **Accessibility audit:** Lighthouse and axe DevTools on each main page, plus a keyboard-only run through checkout.
6. **Funnel analytics after release:** measure drop-off at product view → add to cart → checkout → payment. A/B test changes such as the guest cart.

## Summary for the presentation

UniShop serves four kinds of user: guests, student buyers, student sellers and admins. Buyers want to find items and pay quickly, sellers want to list items and get paid, and admins want to keep the marketplace safe. The interface is modern and mobile-first. The biggest usability problems come at the moment a user decides to buy:

- signing in loses their place
- there is no guest cart
- Mobile Money, the payment method most students use, is hidden
- some checkout fields cannot be used with a screen reader

The upgrade fixes these first, then makes feedback consistent. Success is measured with think-aloud tests, SUS scores taken before and after, and an accessibility audit.
