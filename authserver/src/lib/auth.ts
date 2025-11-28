import { randomUUID } from "crypto";
import { SignJWT } from "jose";

// Role definition
export type Role = "user" | "recruiter";

// User definition
export type User = {
  id: string;
  email: string;
  password: string; // plain text on purpose (again: dev only!)
  role: Role;
};

// Client definition
export type Client = {
  id: string; // public identifier (client_id)
  name: string;
  secret: string; // used later by /token if I want confidential clients
  redirectUris: string[]; // exact redirect URIs this client is allowed to use
};

// Authorization code definition
type AuthCodeEntry = {
  userId: string;
  clientId: string;
  redirectUri: string;
  expiresAt: number; // unix timestamp in ms
};

// ========= Users =========

// Hard-coded demo users
const users: User[] = [
  {
    id: "u1",
    email: "user@example.com",
    password: "password",
    role: "user", // normal user role
  },
  {
    id: "u2",
    email: "recruiter@example.com",
    password: "password",
    role: "recruiter", // recruiter role
  },
];

// Simple email + password lookup.
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

// ========= Authorization codes =========

const authCodes = new Map<string, AuthCodeEntry>();

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

export function consumeAuthorizationCode(
  code: string,
  clientId: string,
  redirectUri: string
): AuthCodeEntry | undefined {
  const entry = authCodes.get(code);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    authCodes.delete(code);
    return undefined;
  }
  if (entry.clientId !== clientId || entry.redirectUri !== redirectUri) {
    return undefined;
  }
  authCodes.delete(code);
  return entry;
}

// ========= JWT tokens =========

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-secret-change-me"
);

const ISSUER = "http://localhost:4000";

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
    .setAudience("eyb-api")
    .sign(JWT_SECRET);
}

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
    .setAudience(clientId)
    .sign(JWT_SECRET);
}
