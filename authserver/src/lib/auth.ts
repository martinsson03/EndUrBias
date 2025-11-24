// src/lib/auth.ts

// randomUUID = used for session ids + authorization codes
import { randomUUID } from "crypto";
// jose = minimal JWT lib, I use it to sign my access / id tokens
import { SignJWT } from "jose";

/**
 * This file is basically my "fake database" + token helpers for the auth server.
 *
 * I keep **everything in memory**:
 *  - users       → demo users with roles (user / recruiter / admin)
 *  - clients     → which apps are allowed to talk to this auth server
 *  - sessions    → sid cookie → userId (who is logged in)
 *  - authCodes   → one-time authorization codes (code → user + client + redirectUri)
 *
 * This is NOT production code. It's purely so I can understand the OAuth2 flow
 * without dragging in a real DB or any external tools.
 */

// The role values I care about in this project.
export type Role = "user" | "recruiter" | "admin";

// Basic shape of a user in my in-memory "db".
export type User = {
  id: string;
  email: string;
  password: string; // plain text on purpose (again: dev only!)
  role: Role;
};

// OAuth "client" = application that is allowed to use this auth server.
export type Client = {
  id: string; // public identifier (client_id)
  name: string;
  secret: string; // used later by /token if I want confidential clients
  redirectUris: string[]; // exact redirect URIs this client is allowed to use
};

// What I store for a session (sid cookie → SessionEntry).
type SessionEntry = {
  userId: string;
};

// What I store for an authorization code.
type AuthCodeEntry = {
  userId: string;
  clientId: string;
  redirectUri: string;
  expiresAt: number; // unix timestamp in ms
};

// ========= Users =========

// Hard-coded demo users.
// If I need more roles/accounts later, I just add them here.
const users: User[] = [
  {
    id: "u1",
    email: "user@example.com",
    password: "password",
    role: "user",
  },
  {
    id: "u2",
    email: "recruiter@example.com",
    password: "password",
    role: "recruiter",
  },
  {
    id: "u3",
    email: "admin@example.com",
    password: "password",
    role: "admin",
  },
];

// Simple email + password lookup.
// In real life this would be a DB query + hashed passwords.
export function findUserByEmailAndPassword(
  email: string,
  password: string
): User | undefined {
  return users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );
}

// Sometimes I just need to go from userId → user object (e.g. in /token).
export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

// ========= Clients =========

// For now I only have **one** client:
// the main Next.js frontend for End Your Bias on port 3000.
const clients: Client[] = [
  {
    id: "eyb-frontend",
    name: "End Your Bias Frontend",
    secret: "super-secret", // placeholder, useful if I add client authentication
    redirectUris: ["http://localhost:3000/auth/callback"],
  },
];

// Helper for looking up a client_id in the list above.
export function findClient(clientId: string): Client | undefined {
  return clients.find((c) => c.id === clientId);
}

// ========= Sessions =========

// sid (string) → { userId }
// This is my mini session store. Right now I only **write** to it when
// a user logs in. Later I can read from it if I need "already logged in"
// behaviour in an /authorize endpoint.
const sessions = new Map<string, SessionEntry>();

// Create a new session for a user and return the sid.
// I set this sid as an httpOnly cookie on the auth server domain.
export function createSession(userId: string): string {
  const sid = randomUUID();
  sessions.set(sid, { userId });
  return sid;
}

// ========= Authorization codes =========

// code (string) → { userId, clientId, redirectUri, expiresAt }
const authCodes = new Map<string, AuthCodeEntry>();

// Create a one-time authorization code.
// I tie it to: user + client + redirectUri and make it valid for 5 minutes.
export function createAuthorizationCode(
  userId: string,
  clientId: string,
  redirectUri: string
): string {
  const code = randomUUID();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  authCodes.set(code, { userId, clientId, redirectUri, expiresAt });

  return code;
}

// Consume (use up) an authorization code.
// If anything looks wrong (missing, expired, wrong client/redirect),
// I return undefined and treat it as an invalid_grant.
export function consumeAuthorizationCode(
  code: string,
  clientId: string,
  redirectUri: string
): AuthCodeEntry | undefined {
  const entry = authCodes.get(code);
  if (!entry) return undefined;

  // Expired → delete + fail.
  if (entry.expiresAt < Date.now()) {
    authCodes.delete(code);
    return undefined;
  }

  // These checks make sure the code is only usable by the right client
  // and only for the exact redirectUri it was originally issued for.
  if (entry.clientId !== clientId || entry.redirectUri !== redirectUri) {
    return undefined;
  }

  // One-time use: once I consume it I remove it from the map.
  authCodes.delete(code);
  return entry;
}

// ========= JWT tokens =========

/**
 * Secret key used for signing JWTs (access_token + id_token).
 *
 * In a real setup this would live in an env var and be long + random.
 * For local dev I fall back to a constant so it "just works".
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-secret-change-me"
);

// Issuer string I use for all tokens. Just using the auth server URL here.
const ISSUER = "http://localhost:4000";

/**
 * Create an **access token** JWT.
 *
 * This is the token the backend (resource server) would verify when the
 * frontend calls protected APIs.
 *
 * Payload fields I include:
 *  - sub      → user id
 *  - role     → user | recruiter | admin (I use this for authorization)
 *  - client_id
 *  - scope    → later if I want more fine-grained permissions
 */
export async function createAccessToken(
  user: User,
  clientId: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000); // seconds since epoch
  const exp = now + 60 * 60; // valid for 1 hour

  return await new SignJWT({
    sub: user.id,
    role: user.role,
    client_id: clientId,
    scope: "basic",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer(ISSUER)
    // Audience here is my "API" / resource server.
    .setAudience("eyb-api")
    .sign(JWT_SECRET);
}

/**
 * Create an **ID token** JWT.
 *
 * This is mainly for the frontend so it knows who is logged in
 * (email + role etc.). In a "real" OpenID Connect setup this would be
 * very close to the spec, but for this project I keep it minimal.
 */
export async function createIdToken(
  user: User,
  clientId: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60; // 1 hour again

  return await new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer(ISSUER)
    // Audience is the client that will consume the ID token (the frontend).
    .setAudience(clientId)
    .sign(JWT_SECRET);
}
