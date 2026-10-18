# UniShop: Premium University Marketplace

**UniShop** is a full-stack, premium e-commerce platform specifically designed as a university marketplace. It allows students to easily buy, sell, and trade items such as electronics, fashion, study materials, and everyday essentials within their campus community. 

The system features a sleek, mobile-first design with smooth micro-interactions, providing a luxury browsing experience.

## 🚀 Key Features

*   **Multi-Vendor Ecosystem**: 
    *   **Buyers**: Browse products, maintain a wishlist, manage carts, submit product reviews, and check out seamlessly.
    *   **Sellers**: Access a dedicated "Seller Dashboard" to manage inventory, track orders, monitor analytics, and handle payouts.
    *   **Admins**: Full platform oversight, including user management, category control, live chat support, and system-wide analytics.
*   **Premium User Experience (UX)**:
    *   Built with a modern, responsive design using Tailwind CSS.
    *   Uses Framer Motion for page transitions, product reveals, and interaction feedback.
*   **Real-time Features**: Includes a floating Live Chat widget powered by Socket.io, allowing instant communication for support and inquiries.
*   **Robust State Management**: Utilizes React Context API to manage authentication state, cart functionality, and shared storefront settings.

## 💻 Tech Stack

**Frontend (Client)**
*   **Framework**: React 19 (Vite 8)
*   **Routing**: React Router v7
*   **Styling**: Tailwind CSS 
*   **Animations**: Framer Motion
*   **Icons**: Tabler Icons

**Backend (Server)**
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Real-time**: Socket.io
*   **Database**: MySQL / MariaDB

## 📁 Project Structure
*   `/frontend/`: Contains the React Vite application. Key directories include `/src/pages` (routing endpoints), `/src/components` (reusable UI elements), and `/src/context` (global state).
*   `/backend/`: Contains the Node/Express server. Key directories include `/src/routes` (API endpoints), `/src/controllers` (business logic), and `/src/services` (email, database initialization).

## 🛠️ Getting Started

### Prerequisites
*   Node.js (20.19+ or 22.12+)
*   NPM or Yarn
*   A running SQL database instance

### Installation
1. Clone the repository.
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Create a `.env` file in the backend directory with your database credentials.
5. Run the development server:
   *   Backend: `cd backend && node src/app.js`
   *   Frontend: `cd frontend && npm run dev`


## Portfolio demo

Start at `/demo` for the buyer, seller and admin walkthrough. See [PORTFOLIO_WALKTHROUGH.md](./PORTFOLIO_WALKTHROUGH.md) for verified sample accounts, setup, presentation steps and testing. Portfolio mode uses simulated payments and shared sample data. Current frontend: React 19, React Router 7, Tailwind CSS 4 and Vite 8; use Node 20.19+ or 22.12+.
