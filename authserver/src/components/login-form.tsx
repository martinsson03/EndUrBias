"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";

/**
 * Props that get passed from the server-side /login page.
 *
 * These all come from query parameters on:
 *   http://localhost:4000/login?client_id=...&redirect_uri=...
 *
 * The <LoginForm /> itself is a **client component**, so I take plain strings.
 */
type LoginFormProps = {
  clientId: string;
  redirectUri: string;
  error: string;
};

/**
 * <LoginForm />
 *
 * This component renders:
 *  - the actual login form UI
 *  - hidden fields for OAuth2 (client_id, redirect_uri)
 *  - a password + email input
 *  - nice error UI if something went wrong
 *
 * When submitted, it POSTs to:
 *   /api/oauth/login   (the login route handler in the auth server)
 *
 * Important:
 *  - This is a "use client" component → it runs in the browser.
 *  - BUT all actual authentication logic is server-side.
 *  - This component ONLY renders UI and posts HTML form data.
 */
export function LoginForm({
  clientId,
  redirectUri,
  error,
}: LoginFormProps) {
  /**
   * Next.js might send error text URL-encoded (e.g. "Unknown%20client_id").
   * I decode it once up front instead of doing it in JSX.
   */
  const decodedError = useMemo(
    () => (error ? decodeURIComponent(error) : ""),
    [error]
  );

  return (
    <div className="min-h-screen bg-slate-950/80 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl p-8">
        {/* Small header */}
        <p className="text-xs font-semibold tracking-wide text-slate-500 mb-1 text-center">
          EYB AUTH SERVER
        </p>

        <h1 className="text-2xl font-bold text-center text-slate-50 mb-2">
          End Your Bias
        </h1>

        <p className="text-sm text-slate-400 text-center mb-6">
          Sign in to continue to the recruiter tool.
        </p>

        {/* If there's an error from the backend, show it here */}
        {decodedError && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200">
            {decodedError}
          </div>
        )}

        {/**
         * The actual login form.
         *
         * When the user clicks "Continue", the browser POSTs form fields
         * to /api/oauth/login.
         *
         * The hidden inputs are CRUCIAL — this is how the login route knows:
         *   - which client is asking to authenticate
         *   - where to redirect the user after login
         */} 
        <form method="POST" action="/api/oauth/login" className="space-y-4">
          {/* --- Hidden OAuth2 parameters --- */}
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="redirect_uri" value={redirectUri} />

          {/* --- Email field --- */}
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-slate-300"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-slate-900 border-slate-700 text-slate-50 text-sm"
            />
          </div>

          {/* --- Password field --- */}
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-slate-300"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-slate-900 border-slate-700 text-slate-50 text-sm"
            />
          </div>

          {/* --- Demo accounts info --- */}
          <p className="text-[11px] leading-relaxed text-slate-400">
            Demo accounts:
            <br />
            user@example.com · recruiter@example.com
            <br />
            Password:{" "}
            <span className="font-semibold text-slate-200">password</span>
          </p>

          {/* --- Submit button --- */}
          <Button
            type="submit"
            className="mt-2 w-full rounded-full bg-sky-500 text-slate-950 text-sm font-semibold hover:bg-sky-400"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
