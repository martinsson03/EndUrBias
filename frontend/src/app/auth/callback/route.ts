import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import jose for JWT verification

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";

  // If we get here without a code, something went wrong
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

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.json();
    let error = errorBody.error_description || errorBody.error || "token_request_failed";
    const redirectUrl = new URL("/", url.origin);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Get the tokens
  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;
  const idToken = tokens.id_token;

  // Verify and decode the JWT token using jose
  const decodedIdToken = await jwtVerify(idToken, new TextEncoder().encode("dev-secret-change-me"));

  // Get the user role from the decoded token payload
  const userRole = decodedIdToken.payload.role;

  // Redirect based on the user role
  let redirectUrl = new URL("/", url.origin);

  if (userRole === "recruiter") {
    redirectUrl = new URL("/recruiter", url.origin); // Redirect to recruiter page
  } else if (userRole === "user") {
    redirectUrl = new URL("/user", url.origin); // Redirect to user page
  }

  // Set the cookies for the tokens without httpOnly for development
const response = NextResponse.redirect(redirectUrl.toString());
response.cookies.set("access_token", accessToken, {
  secure: process.env.NODE_ENV === "production", // Ensure secure cookies only in production
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60, // 1 hour
});
response.cookies.set("id_token", idToken, {
  secure: process.env.NODE_ENV === "production", // Ensure secure cookies only in production
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60, // 1 hour
});




return response;
}
