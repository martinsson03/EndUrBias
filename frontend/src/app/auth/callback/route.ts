// frontend/src/app/auth/callback/route.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * This route handles the redirect **back to the frontend** after the user
 * has logged in at the auth server.
 *
 * URL looks like:
 *   GET /auth/callback?code=...
 *
 * High-level flow:
 *  1. Read "code" from the query string.
 *  2. Server-side POST to the auth server's /api/oauth/token endpoint
 *     with that code, to swap it for tokens.
 *  3. If the token request fails → redirect back to "/" with an error.
 *  4. If it succeeds:
 *      - set access_token and id_token as httpOnly cookies on the frontend
 *      - redirect user back to "/"
 *
 * Important: this is a **route handler**, not a React page.
 * The user never sees a "callback page", it's just a backend hop.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");

  // If we get here without a code, something went wrong in the redirect
  if (!code) {
    const redirectUrl = new URL("/", url.origin);
    redirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Exchange the authorization code for tokens
  const tokenResponse = await fetch("http://localhost:4000/api/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: "eyb-frontend",
      redirect_uri: "http://localhost:3000/auth/callback",
    }).toString(),
  });

  // Handle token request failure
  if (!tokenResponse.ok) {
    let error = "token_request_failed";
    try {
      const errorBody = await tokenResponse.json();
      if (errorBody.error_description) {
        error = errorBody.error_description;
      } else if (errorBody.error) {
        error = errorBody.error;
      }
    } catch {
      // If JSON parsing fails, keep the generic error
    }

    const redirectUrl = new URL("/", url.origin);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Handle successful token response
  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token as string;
  const idToken = tokens.id_token as string;

  // Redirect back to the app
  const redirectUrl = new URL("/", url.origin);

  const response = NextResponse.redirect(redirectUrl.toString());

  // Store tokens as cookies on the frontend
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour in seconds
  });

  response.cookies.set("id_token", idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
