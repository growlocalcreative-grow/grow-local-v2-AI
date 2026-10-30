# Deploying Grow Local Creative to Cloudflare

This project deploys as a **Cloudflare Worker** (not Cloudflare Pages) using `@opennextjs/cloudflare`, matching the setup you've already got on Fix It Cool.

## One-time setup in the Cloudflare dashboard

1. Go to **Workers & Pages → Create → Workers Builds** (or "Connect to Git" if that's what your dashboard shows).
2. Connect your GitHub account and select the `Grow-Local-Creative` repo.
3. Set these build settings:
   - **Build command:** `npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion` (or `npm run deploy` / `npm run build:worker`)
   - **Deploy command:** leave blank (or `npx wrangler deploy .open-next/worker.js`)
   - **Root directory:** `/` (or wherever you place these files in the repo)
4. Save. Cloudflare will now build and deploy automatically on every push to `main`.

## Fix for "ERROR Next.js version 15.5.x is not supported by the Next.js team"

If Cloudflare build fails with:
`ERROR Next.js version 15.5.26 is not supported by the Next.js team. If you want to proceed anyway, use the --dangerouslyUseUnsupportedNextVersion flag.`

**Why this occurs:** OpenNext Cloudflare includes an automated 2-year calendar timer from Next 15's release date (October 2024). Once that calendar date is passed, OpenNext prompts for this flag to acknowledge continued LTS use.

**How to fix:**
In the Cloudflare dashboard under **Workers & Pages → Settings → Builds**:
- Update your **Build command** to:
  ```bash
  npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
  ```
  Or:
  ```bash
  npm run deploy
  ```
  *(which already includes this flag in `package.json`).*

## If you hit the same build error as Fix It Cool

That project's issue was in **Settings → Builds** — double check the Node.js compatibility flag (`nodejs_compat`) and build command there match what's above. If the build fails, the error log in the Cloudflare dashboard will name the missing setting directly.

## Package Manager & Lockfiles (bun.lock vs npm)

- Cloudflare automatically detects lockfiles in the root of the repository. If `bun.lock` or `bun.lockb` exists, Cloudflare switches the build pipeline to `bun install --frozen-lockfile`, which blocks scripts/postinstalls and causes mismatches.
- We have removed `bun.lock` and standard `package-lock.json` is used. Cloudflare will now cleanly run `npm install`.

## Firebase

No environment variables are needed for Firebase — the config in `lib/firebase.ts` is your public client-side Firebase config (project ID, API key, etc.), which is meant to be public and safe to ship in the bundle. Security is enforced by `firestore.rules`, not by hiding this config.

**Important:** after you upload this project, redeploy your Firestore rules too — `firestore.rules` in this project has an added rule for the new `content` collection (the CMS) that your current live rules don't have yet. Deploy it via the Firebase Console: **Firestore Database → Rules → paste this file's contents → Publish.**

## Custom domain

Once the Worker is live on its `*.workers.dev` URL, add your custom domain under **Workers & Pages → your worker → Settings → Domains & Routes** in the Cloudflare dashboard.

## Local testing (optional, if you ever get CLI access)

```
npm install
npm run dev              # local dev server
npm run build             # Next.js production build only
npm run preview           # build + preview via Cloudflare's local runtime
npm run deploy             # build + deploy to Cloudflare
```
