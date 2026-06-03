# Betterinu Student Frontend

Standalone Next.js student portal. The browser authenticates with Firebase and
sends the Firebase ID token to the external API as a bearer token.

## Setup

Create `.env.local` from `.env.example`, then run:

```bash
npm install
npm run dev
```

The external API must allow requests from the frontend origin and accept
`Authorization: Bearer <firebase-id-token>` for protected routes.
