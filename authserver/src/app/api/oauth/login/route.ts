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
 *      - state                  → opaque value from the client, I just echo it back
 *
 *  2. Validate that:
 *      - client_id is known
 *      - redirect_uri is allowed for that client
 *      - email/password matches one of my in-memory demo users
 *
 *  3. If something is wrong → redirect back to /login with an error message
 *     and keep client_id / redirect_uri / state so the form can be re-rendered.
 *
 *  4. If login is OK:
 *      - create a session (sid cookie on the auth server)
 *      - create an authorization code (one-time code tied to user+client+redirectUri)
 *      - redirect the browser back to the frontend:
 *            redirect_uri?code=...&state=...
 *
 *     The frontend will then call /api/oauth/token with the code to get
 *     access_token + id_token.
 */

export async function POST(request: NextRequest) {
  // --- Step 1: Read form data sent from the login page ---

  // NextRequest exposes formData() for POST bodies with form-encoding.
  const formData = await request.formData();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const redirectUri = String(formData.get("redirect_uri") ?? "");
  const state = formData.get("state") ? String(formData.get("state")) : "";

  /**
   * Helper: if anything goes wrong, I want to send the user back to
   * /login on the auth server with:
   *   - same client_id / redirect_uri / state
   *   - an `error` query param the login page can render
   *
   * This keeps the UX halfway decent even though this is just a demo.
   */
  const redirectToLoginWithError = (message: string) => {
    const url = new URL("/login", request.url);

    if (clientId) url.searchParams.set("client_id", clientId);
    if (redirectUri) url.searchParams.set("redirect_uri", redirectUri);
    if (state) url.searchParams.set("state", state);

    // Encode the error so it's safe to put in the query string.
    url.searchParams.set("error", encodeURIComponent(message));

    return NextResponse.redirect(url.toString());
  };

  // --- Step 2: Validate the OAuth client + redirect URI ---

  const client = findClient(clientId);
  if (!client) {
    // Unknown client_id → this app is not registered with my auth server.
    return redirectToLoginWithError("Unknown client_id");
  }

  // The redirectUri that came from the client MUST be in the allowed list
  // I have configured for that client. This prevents open redirect attacks.
  if (!client.redirectUris.includes(redirectUri)) {
    return redirectToLoginWithError(
      "redirect_uri is not allowed for this client"
    );
  }

  // --- Step 3: Check the user credentials ---

  const user = findUserByEmailAndPassword(email, password);
  if (!user) {
    // Invalid email/password → don't say which one was wrong.
    return redirectToLoginWithError("Invalid email or password");
  }

  // --- Step 4: Create session + authorization code ---

  // 4a. Create a session and store sid → userId in memory.
  //     I set sid as an httpOnly cookie on the auth server domain so I
  //     could later implement "already logged in" behaviour.
  const sid = createSession(user.id);

  // 4b. Create a one-time authorization code tied to this user/client/redirectUri.
  const code = createAuthorizationCode(user.id, client.id, redirectUri);

  // --- Step 5: Redirect back to the frontend with ?code=...&state=... ---

  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);
  if (state) {
    // I just pass state through untouched so the client can verify it matches.
    redirectUrl.searchParams.set("state", state);
  }

  // Important: I use 302 here (not 307). 307 would keep the HTTP method,
  // which would make the browser POST to /auth/callback. I want the browser
  // to follow up with a GET instead.
  const response = NextResponse.redirect(redirectUrl.toString(), {
    status: 302,
  });

  // Attach the sid cookie so the browser is "logged in" at the auth server.
  response.cookies.set("sid", sid, {
    httpOnly: true, // not readable from JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
