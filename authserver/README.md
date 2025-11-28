This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## This part describes how to run a full end-to-end test to verify that the flow works correctly.

Auth Server: http://localhost:4000

Frontend (Client): http://localhost:3000

1. Start both servers

Authserver (port 4000):

cd authserver
npm run dev

Frontend (port 3000):

cd frontend
npm run dev

Both servers should start without errors.

2. Open the frontend

Navigate to:

http://localhost:3000/

You should see the End Your Bias landing page.

3. Begin the OAuth login flow

Open the following URL in the browser:

http://localhost:4000/login?client_id=eyb-frontend&redirect_uri=http://localhost:3000/auth/callback

You should see the EYB Auth Server login page.

4. Log in using a demo account

Use any of the demo accounts:

user@example.com

recruiter@example.com

All demo accounts use the password:

password

Click Continue.

Expected behavior:

The authserver validates the credentials.

The authserver redirects to:
http://localhost:3000/auth/callback?code=...

The frontend exchanges the code for tokens via the authserver.

The frontend redirects the user to:
http://localhost:3000/ (depending on user or recruiter account)

5. Verify authentication cookies

In the browser, open Developer Tools → Application (or Storage) → Cookies for:

http://localhost:3000

You should see the following cookies set:

access_token

id_token

Both should be HTTP-only and valid for approximately one hour.

Test Result

If the user is successfully redirected back to the frontend and both cookies are present, the OAuth2 Authorization Code flow is functioning correctly end to end.
