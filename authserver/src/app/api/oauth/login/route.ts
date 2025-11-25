// src/app/api/oauth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  createAuthorizationCode,
  createSession,
  findClient,
  findUserByEmailAndPassword,
} from "@/lib/auth";

/**
 * This endpoint handles the POST from the login form on the auth server.
 *
 * High-level flow (Authorization Code Grant, simplified):
 *
 *  1. Read form fields:
 *      - email + password       → user credentials
 *      - client_id              → which frontend is calling us
 *      - redirect_uri           → where we should send the user back after login
 *
 *  2. Validate that:
 *      - client_id is known
 *      - redirect_uri is allowed for that client
 *      - email/password matches one of my in-memory demo users
 *
 *  3. If something is wrong → redirect back to /login with an error message
 *     and keep client_id / redirect_uri so the form can be re-rendered.
 *
 *  4. If login is OK:
 *      - create a session (sid cookie on the auth server)
 *      - create an authorization code (one-time code tied to user+client+redirectUri)
 *      - redirect the browser back to the frontend:
 *            redirect_uri?code=...
 *
 *     The frontend will then call /api/oauth/token with the code to get
 *     access_token + id_token.
 */

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const redirectUri = String(formData.get("redirect_uri") ?? "");

  /**
   * Helper: if anything goes wrong, I want to send the user back to
   * /login on the auth server with:
   *   - same client_id / redirect_uri
   *   - an `error` query param the login page can render
   */
  const redirectToLoginWithError = (message: string) => {
    const url = new URL("/login", request.url);

    if (clientId) url.searchParams.set("client_id", clientId);
    if (redirectUri) url.searchParams.set("redirect_uri", redirectUri);

    // Encode the error so it's safe to put in the query string.
    url.searchParams.set("error", message);

    return NextResponse.redirect(url.toString());
  };

  // Validate the OAuth client + redirect URI
  const client = findClient(clientId);
  if (!client) {
    return redirectToLoginWithError("Unknown client_id");
  }

  if (!client.redirectUris.includes(redirectUri)) {
    return redirectToLoginWithError(
      "redirect_uri is not allowed for this client"
    );
  }

  // Check the user credentials
  const user = findUserByEmailAndPassword(email, password);
  if (!user) {
    return redirectToLoginWithError("Invalid email or password");
  }

  // Create session + authorization code
  const sid = createSession(user.id);
  const code = createAuthorizationCode(user.id, client.id, redirectUri);

  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);

  const response = NextResponse.redirect(redirectUrl.toString(), {
    status: 302,
  });

  // Attach the sid cookie so the browser is "logged in" at the auth server.
  response.cookies.set("sid", sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
