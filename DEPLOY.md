# Deploying Grow Local Creative to Cloudflare

This project deploys as a **Cloudflare Worker** (not Cloudflare Pages) using `@opennextjs/cloudflare`, matching the setup you've already got on Fix It Cool.

## One-time setup in the Cloudflare dashboard

1. Go to **Workers & Pages → Create → Workers Builds** (or "Connect to Git" if that's what your dashboard shows).
2. Connect your GitHub account and select the `Grow-Local-Creative` repo.
3. Set these build settings:
   - **Build command:** `npm run deploy`
   - **Deploy command:** leave blank — `npm run deploy` handles both the build and the deploy in one step (it runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`).
   - **Root directory:** `/` (or wherever you place these files in the repo)
4. Save. Cloudflare will now build and deploy automatically on every push to `main`.

## If you hit the same build error as Fix It Cool

That project's issue was in **Settings → Builds** — double check the Node.js compatibility flag and build command there match what's above. If the build fails, the error log in the Cloudflare dashboard will name the missing setting directly.

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
