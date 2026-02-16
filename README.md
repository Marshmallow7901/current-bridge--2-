<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18xErBL4eSDyg0yooBqw8ufs2KLGOCGGc

## Product Guide

Current is a crypto-to-fiat bridge experience that blends a premium landing page with a multi-tab terminal. Users can explore the protocol on the landing view, then sign in to access the dashboard where swaps, payments, and account activity are managed in one place.

### How It Works (User Flow)

1. Landing page
    - The user explores the protocol overview, features, and security highlights.
    - Calls-to-action route to the terminal or whitepaper.

2. Authentication
    - The user signs in with an email address.
    - The app creates a local session and a mock identity profile.

3. Terminal dashboard
    - The user can swap crypto to ZAR, view balances, pay bills, and track activity.
    - Data is persisted locally in the browser so the session feels stateful.

### Core Features

- Landing experience
   - High-impact hero section, protocol feature grid, and security callouts.
   - Marquee-style market banner for ambient activity.

- Swap terminal
   - Converts selected assets to ZAR using live market prices.
   - Displays deterministic volatility and settlement confirmation.
   - Writes each swap to the transaction ledger.

- Assets view
   - Snapshot of holdings and portfolio changes.
   - Uses live price data for valuations.

- Payments terminal
   - Bill payments and peer transfers from the ZAR balance.
   - Saved payees and recurring payments for faster settlement.

- Activity ledger
   - Expandable transaction records with status and details.

- AI advisor (Ci)
   - Optional Gemini-powered advisor for contextual insights.
   - Gracefully degrades when no API key is set.

### Data and Persistence

- All user data is stored locally in the browser using localStorage.
- This includes balances, transactions, saved payees, and recurring schedules.
- The ledger sync indicator reflects local persistence status.

### API Usage

- Live price quotes and historical data are fetched from Coingecko.
- Gemini is used only for optional AI advisor responses.
- If no Gemini key is provided, AI features show an offline message.

## CV-Ready Project Description

Current is a premium crypto-to-fiat bridge web app that combines a public marketing site with an authenticated financial terminal. Users can explore the protocol, then sign in to access a dashboard for live swaps, ZAR payments, asset balances, and transaction history. The experience is designed to feel like a secure, institutional-grade console while remaining easy to use.

### What It Does Today

- Landing experience with protocol messaging, features, and security highlights.
- Email-based sign-in that creates a local session profile.
- Swap terminal that converts crypto to ZAR using live price feeds.
- Payments terminal for bill settlement and peer transfers from ZAR balance.
- Activity ledger with expandable transaction details.
- Optional AI advisor (Ci) for contextual insights.

### What It Will Do When Fully Built

- Real authentication and KYC flow with verified user profiles.
- Bank-grade transaction processing and external settlement rails.
- Real card issuance and card management workflows.
- Live on-chain transaction tracking and explorer links.
- Production-grade analytics, alerts, and compliance reporting.

### Tech Stack and Tools

- Frontend: React + TypeScript
- Build tooling: Vite
- Styling: Tailwind CSS (CDN) + custom CSS utilities
- Animation: Framer Motion
- Charts: Recharts
- Icons: Lucide React
- AI: Google Gemini (optional, via API key)
- Data persistence (demo): Browser localStorage

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
