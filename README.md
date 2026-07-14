# Portfolio — Local Setup & Deployment

This repo is a static portfolio with serverless contact support for both Netlify and Vercel.

Quick local run

```bash
npm install
npm run optimize:images   # optional: creates -opt.webp copies
npx serve -s . -l 5000
# open http://localhost:5000
```

Contact form (serverless)

This site includes serverless handlers for both Netlify (`netlify/functions/contact.js`) and Vercel (`api/contact.js`). Both send submissions to SendGrid. To enable in your provider, set these environment variables in the deployment settings:

- `SENDGRID_API_KEY` — your SendGrid API key
- `RECIPIENT_EMAIL` — email address that receives submissions
- `FROM_EMAIL` — optional `from` address (must be verified in SendGrid)

If you don't set them, the form falls back to opening the user's email client (`mailto:`).

CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs image optimization and a Lighthouse audit on pushes to `main`/`master`.

Deployment notes

- Netlify: the `netlify/functions` folder will be picked up automatically. Add SendGrid env vars under Site settings → Build & deploy → Environment.
- Vercel: the `api` folder functions as serverless endpoints. Add SendGrid env vars in your project Settings → Environment Variables.

Security

- Do not commit API keys to the repo. Use Netlify environment variables (or your provider's secrets).

If you want, I can:
- Push the commits to a remote (provide URL or grant permission), or
- Open a PR with these changes, or
- Configure a deployment on Netlify (you'll need to connect your Git provider).
