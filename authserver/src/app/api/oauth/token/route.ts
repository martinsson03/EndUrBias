import { NextRequest, NextResponse } from "next/server";
import {
  consumeAuthorizationCode,
  findClient,
  findUserById,
  createAccessToken,
  createIdToken,
} from "@/lib/auth";

/**
 * Token endpoint to exchange the authorization code for access and id tokens.
 */
export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const params = new URLSearchParams(bodyText);

  const grantType = params.get("grant_type");
  const code = params.get("code");
  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");

  // Validate grant_type (only 'authorization_code' supported)
  if (grantType !== "authorization_code") {
    return NextResponse.json(
      { error: "unsupported_grant_type", error_description: "Only authorization_code is supported" },
      { status: 400 }
    );
  }

  // Validate client and redirect_uri (ensure they are not null)
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing client_id or redirect_uri" },
      { status: 400 }
    );
  }

  const client = findClient(clientId);
  if (!client || !client.redirectUris.includes(redirectUri)) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Invalid client_id or redirect_uri" },
      { status: 400 }
    );
  }

  // Validate the authorization code
  if (!code) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing authorization code" },
      { status: 400 }
    );
  }

  // Consume the authorization code
  const authCodeEntry = consumeAuthorizationCode(code, client.id, redirectUri);
  if (!authCodeEntry) {
    return NextResponse.json(
      { error: "invalid_grant", error_description: "Invalid or expired authorization code" },
      { status: 400 }
    );
  }

  // Retrieve the user
  const user = findUserById(authCodeEntry.userId);
  if (!user) {
    return NextResponse.json(
      { error: "invalid_grant", error_description: "User not found for this authorization code" },
      { status: 400 }
    );
  }

  // Create the access token and ID token
  const accessToken = await createAccessToken(user, client.id);
  const idToken = await createIdToken(user, client.id);

  // Return the tokens
  return NextResponse.json({
    access_token: accessToken,
    id_token: idToken,
    token_type: "Bearer",
    expires_in: 60 * 60, // 1 hour
  });
}
