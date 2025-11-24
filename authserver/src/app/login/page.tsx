// src/app/login/page.tsx

import { LoginForm } from "@/components/login-form";

/**
 * Login page for the auth server.
 *
 * URL: GET /login
 *
 * The URL can contain the following query parameters:
 *   - client_id
 *   - redirect_uri
 *   - state
 *   - error  (error message from previous failed login attempt)
 *
 * This component is a **server component**. It reads the query parameters
 * and passes them down as props to <LoginForm />, which is a client
 * component that actually renders the form.
 */

// In Next 16, searchParams is provided as a Promise in server components,
// so I type it that way and make the component async.
type LoginPageProps = {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    state?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Wait for Next.js to resolve the search params
  const params = await searchParams;

  const clientId = params.client_id ?? "";
  const redirectUri = params.redirect_uri ?? "";
  const state = params.state ?? "";
  const error = params.error ?? "";

  return (
    <LoginForm
      clientId={clientId}
      redirectUri={redirectUri}
      state={state}
      error={error}
    />
  );
}
