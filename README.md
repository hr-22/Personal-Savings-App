# 💜 Savings Command Center

A connected-pool savings tracker built for one person: log what you save, set your
goals, and let one engine figure out how your money should be split — no manual
bookkeeping, no separate spreadsheets per goal.

Instead of tracking "saved so far" separately for every goal, everything comes from
a **single pool**. Every rupee you log gets automatically allocated across your
goals, emergency fund, and wishlist based on **priority × how close the deadline
is** — and priorities can even change on their own on a set date (so an emergency
fund can sit at Low priority today and automatically become High priority starting
a future year, with zero manual editing).

Launch the app here : https://hr-22.github.io/Personal-Savings-App/

## ✨ Features

- **Connected pool allocation** — one running total, split across every goal and
  wishlist item by a priority × urgency weighting, with overflow waterfalled to
  the next-highest-weighted item
- **Time-shifting priority rules** — set a goal to change priority automatically
  from a given date (e.g. emergency fund: Low → High starting 2027)
- **Deposit log** — log real deposits (or withdrawals) with notes; your total
  saved is simply the running sum, with full history
- **Capacity planner** — simulates month by month and projects a funded-by date
  for every goal and wishlist item based on your monthly saving capacity
- **"What if" simulator** — a live slider to preview a different monthly amount
  without touching your real data
- **Stats dashboard** — savings trend line, allocation pie chart, and milestone
  achievement badges (25% / 50% / 75% / fully funded) with a confetti celebration
- **Savings streak tracker** — counts consecutive weeks with a logged deposit
- **Dark mode**, custom icons/colors per goal, search & sort on the wishlist
- **Private by design** — single-user Firebase email/password login, no public
  sign-up, with Firestore security rules scoping all data to your account

## 🛠 Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/) — Authentication + Firestore
- [Recharts](https://recharts.org/) for the stats charts
- [Lucide](https://lucide.dev/) for icons
- [canvas-confetti](https://www.kirilv.com/canvas-confetti/) for the celebrations
- Deployed via GitHub Actions to GitHub Pages

## 🚀 Local development

```bash
npm install
npm run dev
```

Requires a Firebase project (Authentication + Firestore) — see the setup guide
referenced in this repo's deployment workflow.

## 📄 License

Personal project — feel free to fork and adapt for your own use.
