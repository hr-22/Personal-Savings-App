# Savings Command Center

A connected-pool savings tracker: one login, one pool of money, split automatically
across your long-term goals, emergency fund, and wishlist by priority and deadline —
plus a stats dashboard, deposit log, streaks, and achievement badges.

Everything below gets you from this folder to a live, password-protected site at
`https://<your-username>.github.io/<repo-name>/`, synced across every device you log
in on.

## 1. Create a Firebase project (free)

1. Go to https://console.firebase.google.com and click **Add project**. Name it
   anything (e.g. `savings-command-center`). You can skip Google Analytics.
2. Once created, click the **web icon (`</>`)** on the project overview page to
   register a web app. Give it any nickname. You do **not** need Firebase Hosting.
3. Firebase will show you a `firebaseConfig` object. Copy it.
4. Open `src/firebase.js` in this project and paste your values in, replacing the
   `REPLACE_ME` placeholders.

   This file is safe to commit to a **public** GitHub repo. Firebase's web config
   is meant to be public — it's not a secret key. Your data is protected by the
   login (Authentication) and the security rules below, not by hiding this file.

## 2. Turn on Authentication (your login)

1. In the Firebase console, go to **Build > Authentication > Get started**.
2. Enable the **Email/Password** provider (first option in the list).
3. Go to the **Users** tab and click **Add user**. Enter the email and password
   you want to log in with. That's your only account — there's no public sign-up
   screen in the app, so no one else can create one.

## 3. Turn on Firestore (your database)

1. Go to **Build > Firestore Database > Create database**.
2. Choose **Production mode** and pick any region close to you.
3. Once created, go to the **Rules** tab and replace the contents with what's in
   `firestore.rules` in this project, then click **Publish**. This ensures only
   your logged-in account can ever read or write your data.

## 4. Push this project to GitHub

1. Create a new repository on GitHub (public — GitHub Pages on a private repo
   needs a paid GitHub Pro plan; public is free and fine here, since your actual
   data isn't stored in this repo at all — it's in Firebase, behind your login).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

## 5. Turn on GitHub Pages

1. In your new repo on GitHub, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. That's it — the workflow in `.github/workflows/deploy.yml` will build and
   deploy automatically on every push to `main`. Check the **Actions** tab for
   progress; once it's green, your site is live at the URL shown in
   **Settings > Pages**.

## Using it day to day

- **Deposits tab** — every time you save money, log it here. Your "Total saved"
  everywhere else in the app is just the sum of this log (use a negative amount
  to log a withdrawal).
- **Goals tab** — add/edit goals, set a deadline and priority. The "Upgrade to /
  From date" fields let a goal's priority change automatically on a set date —
  that's how the Emergency Fund goes from Low to High priority starting a
  specific year without you touching it.
- **Dashboard** — shows how your total pool splits across every goal + wishlist
  item right now, and projects a funded-by date for each based on your monthly
  capacity. The "what if" slider lets you preview a different monthly amount
  without changing your real numbers.
- **Wishlist tab** — smaller items, same idea, no deadline required.
- **Stats tab** — savings trend over time, an allocation pie chart, and
  milestone badges (25% / 50% / 75% / fully funded) per goal.

## Local development

```bash
npm install
npm run dev
```

## Notes

- Dark mode is a personal per-browser setting (not synced) — toggle it top right.
- If you ever change the repo name, no changes are needed — `vite.config.js` uses
  a relative base path so it works at any GitHub Pages URL.
