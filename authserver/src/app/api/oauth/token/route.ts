// src/app/api/oauth/token/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  consumeAuthorizationCode,
  findClient,
  findUserById,
  createAccessToken,
  createIdToken,
} from "@/lib/auth";

/**
 * This is my OAuth2 **token endpoint**.
 *
 * The frontend calls this AFTER the user has logged in and been redirected
 * back to /auth/callback with an authorization code.
 *
 * The request should be:
 *
 *   POST /api/oauth/token
 *   Content-Type: application/x-www-form-urlencoded
 *
 *   grant_type=authorization_code
 *   &code=...          ← the authorization code from the redirect
 *   &client_id=...     ← which client is asking for tokens
 *   &redirect_uri=...  ← must match what was used when creating the code
 *
 * If everything checks out, I return:
 *
 *   {
 *     "access_token": "...",  // JWT used by backend / resource server
 *     "id_token": "...",      // JWT with info about the user (email, role)
 *     "token_type": "Bearer",
 *     "expires_in": 3600
 *   }
 *
 * If anything smells wrong, I return a JSON error with a proper HTTP status.
 */

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  // I keep this strict: only application/x-www-form-urlencoded is accepted.
  // This lines up with the OAuth2 spec and keeps things predictable.
  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return NextResponse.json(
      {
        error: "invalid_request",
        error_description:
          "Content-Type must be application/x-www-form-urlencoded",
      },
      { status: 400 }
    );
  }

  // Read the raw body and parse it as URL-encoded form data.
  const bodyText = await request.text();
  const params = new URLSearchParams(bodyText);

  const grantType = params.get("grant_type") || "";
  const code = params.get("code") || "";
  const clientId = params.get("client_id") || "";
  const redirectUri = params.get("redirect_uri") || "";

  // ---- 1) Validate grant_type ------------------------------------------
  // I only support the Authorization Code Grant in this project.
  if (grantType !== "authorization_code") {
    return NextResponse.json(
      {
        error: "unsupported_grant_type",
        error_description: "Only authorization_code is supported",
      },
      { status: 400 }
    );
  }

  // ---- 2) Validate the client and redirect_uri -------------------------

  const client = findClient(clientId);
  if (!client) {
    // Someone passed a client_id I don't know about.
    return NextResponse.json(
      {
        error: "invalid_client",
        error_description: "Unknown client_id",
      },
      { status: 400 }
    );
  }

  // redirect_uri must exactly match one of the URIs I have registered
  // for that client. This is important to avoid sending tokens to
  // unexpected places.
  if (!client.redirectUris.includes(redirectUri)) {
    return NextResponse.json(
      {
        error: "invalid_request",
        error_description: "redirect_uri is not allowed for this client",
      },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error: "invalid_request",
        error_description: "Missing authorization code",
      },
      { status: 400 }
    );
  }

  // ---- 3) Consume the authorization code ------------------------------

  // This step:
  //  - checks that the code exists
  //  - checks that it hasn't expired
  //  - checks that it belongs to *this* client and *this* redirect_uri
  //  - deletes it so it can't be reused
  const authCodeEntry = consumeAuthorizationCode(code, client.id, redirectUri);

  if (!authCodeEntry) {
    // Either the code is unknown, already used, expired, or doesn't belong
    // to this client/redirect. In all cases: treat as invalid_grant.
    return NextResponse.json(
      {
        error: "invalid_grant",
        error_description: "Invalid or expired authorization code",
      },
      { status: 400 }
    );
  }

  // ---- 4) Look up the user behind this code ---------------------------

  const user = findUserById(authCodeEntry.userId);
  if (!user) {
    // Should basically never happen in this demo, but I handle it anyway.
    return NextResponse.json(
      {
        error: "invalid_grant",
        error_description: "User not found for this authorization code",
      },
      { status: 400 }
    );
  }

  // ---- 5) Create access token + id token ------------------------------

  // access_token → used by my backend API to decide if the caller is allowed.
  const accessToken = await createAccessToken(user, client.id);

  // id_token → used mainly by the frontend to know who is logged in.
  const idToken = await createIdToken(user, client.id);

  // ---- 6) Return tokens as JSON ---------------------------------------

  return NextResponse.json({
    access_token: accessToken,
    id_token: idToken,
    token_type: "Bearer",
    expires_in: 60 * 60, // 1 hour in seconds
  });
}
