## True Feedback — Anonymous Messages Platform

An anonymous messaging web app where users can register, share a public link, and receive anonymous feedback/messages in their dashboard. Built with modern Next.js App Router, JWT-based NextAuth, MongoDB, and a clean UI using Tailwind and shadcn/ui.

• Deployed: [anonymous-messages-kappa.vercel.app/sign-in](https://anonymous-messages-kappa.vercel.app/sign-in)

---

## Table of Contents
- Overview
- Features & Use Cases
- Tech Stack
- Architecture & Key Files
- Environment Variables
- Local Development
- Production Deployment (Vercel)
- API Endpoints (high-level)
- Security Notes

---

## Overview
True Feedback allows anyone to create an account, verify via email, and receive anonymous messages. Users can toggle whether they are accepting new messages, view them in a dashboard, and delete messages they don’t want to keep.

---

## Features & Use Cases
- Authentication: Email/username + password via NextAuth Credentials with JWT sessions
- Email verification: Verification codes sent via Resend
- Public profile page: `/{username}` to receive messages
- Private dashboard: View and manage received messages
- Accepting messages toggle: Control whether new messages are allowed
- Username availability check during sign-up
- Validation: Zod schemas for robust input validation

Typical use cases:
- Creators or teams collecting candid feedback
- Quick suggestion boxes for products/classes/events
- Anonymous Q&A for communities

---

## Tech Stack
- Next.js 14 (App Router), TypeScript
- NextAuth (JWT strategy) for auth
- MongoDB + Mongoose (Atlas recommended)
- Tailwind CSS + shadcn/ui components
- Resend for transactional email

---

## Architecture & Key Files
- App routes: `src/app/(auth)`, `src/app/(app)`, API under `src/app/api`
- Auth config: `src/app/api/auth/[...nextauth]/options.ts`
- DB connection: `src/lib/dbConnect.ts`
- Models: `src/model/User.ts`
- Email sending: `src/helpers/sendVerificationEmail.ts`, `src/lib/resend.ts`
- UI components: `src/components/*` and `src/components/ui/*`
- Middleware for route protection: `src/middleware.ts`

---

## Environment Variables
Create `.env.local` for local development and set these in Vercel for Production/Preview:

Required:
- `MONGODB_URI` — Full MongoDB connection string (include database name). Example:
  - `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
- `NEXTAUTH_URL` — e.g. `http://localhost:3000` (prod: your Vercel URL)
- `NEXTAUTH_SECRET` — a strong random string (e.g., `openssl rand -base64 32`)
- `RESEND_API_KEY` — your Resend API key

Notes:
- If your MongoDB user authenticates in `admin`, add `&authSource=admin`.
- URL-encode special characters in passwords.

---

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add `.env.local` with the variables above.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

---

## Production Deployment (Vercel)
1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel, import the project and ensure Next.js preset is detected.
3. Add Environment Variables for Production (and Preview). Include `MONGODB_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`.
4. Ensure MongoDB Atlas Network Access allows connections from Vercel (quick start: `0.0.0.0/0`).
5. Deploy. After the first deploy, set `NEXTAUTH_URL` to the exact production URL and redeploy.

Deployed app: [anonymous-messages-kappa.vercel.app/sign-in](https://anonymous-messages-kappa.vercel.app/sign-in)

---

## API Endpoints (high-level)
- `POST /api/sign-up` — create user and send verification email
- `POST /api/verify-code` — verify account
- `POST /api/auth/[...nextauth]` — NextAuth auth routes (credentials)
- `GET /api/get-messages` — fetch messages for the authenticated user
- `POST /api/send-message` — send anonymous message to a user
- `DELETE /api/delete-message/:messageId` — delete a message
- `POST /api/accept-messages` — toggle accepting messages
- `GET /api/check-username-unique` — check username availability
- `GET /api/suggest-messages` — suggestion seeds

---

## Security Notes
- Do not commit secrets; use environment variables.
- Move any hardcoded keys (e.g., Resend) into env vars.
- Use strong `NEXTAUTH_SECRET` and rotate keys carefully.
- Restrict MongoDB Network Access in production when possible.

---

## License
This project is provided as-is; add a license file if you plan public distribution.
