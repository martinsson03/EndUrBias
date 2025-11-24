// frontend/src/app/auth/callback/route.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * This route handles the redirect **back to the frontend** after the user
 * has logged in at the auth server.
 *
 * URL looks like:
 *   GET /auth/callback?code=...&state=...
 *
 * High-level flow:
 *  1. Read "code" (and optionally "state") from the query string.
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
  // I get the full URL so I can read code + state.
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";

  // If we get here without a code, something went wrong in the redirect
  // from the auth server. Easiest is to just go back to the start page
  // and show an error.
  if (!code) {
    const redirectUrl = new URL("/", url.origin);
    redirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirectUrl.toString());
  }

  // --- Step 2: Exchange the authorization code for tokens ----------------

  // This call happens on the **server side**, so I don't have CORS issues.
  // I'm basically acting as the "confidential client" here.
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

  // If the token endpoint says "nope", I try to extract a nice error message,
  // otherwise I fall back to a generic one and send the user back to "/".
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
      // If JSON parsing fails I just keep the generic error string.
    }

    const redirectUrl = new URL("/", url.origin);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  // At this point the token call worked, so I expect a JSON payload with:
  //  - access_token
  //  - id_token
  //  - token_type
  //  - expires_in
  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token as string;
  const idToken = tokens.id_token as string;

  // --- Step 3: Redirect the user back into the app -----------------------

  // Later I might want to use `state` to remember "where the user wanted to go",
  // but for now I always redirect to "/".
  const redirectUrl = new URL("/", url.origin);
  if (state) {
    // I still propagate state, just in case I want to inspect it on "/".
    redirectUrl.searchParams.set("state", state);
  }

  const response = NextResponse.redirect(redirectUrl.toString());

  // --- Step 4: Store tokens as cookies on the frontend domain ------------

  // access_token cookie:
  //  - httpOnly so it can't be read from JS
  //  - used by the frontend server (or API routes) when it needs to call
  //    the backend / resource server on behalf of the user.
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour in seconds
  });

  // id_token cookie:
  //  - also httpOnly here (I could choose to expose it to JS later if needed)
  //  - mainly useful if I build a "who am I?" endpoint that decodes it
  //    and returns user info (email, role, etc.) to the frontend.
  response.cookies.set("id_token", idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
