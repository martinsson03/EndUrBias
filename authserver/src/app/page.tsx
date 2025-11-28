// src/app/page.tsx

/**
 * Tiny landing page for the auth server.
 * Not used by the OAuth flow, but it's nice to have a simple
 * "is this running?" page at http://localhost:4000/.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">EYB Auth Server</h1>
        <p className="text-sm text-slate-400">
          Server is running on <code>http://localhost:4000</code>.
        </p>
        <p className="text-xs text-slate-500">
          Login UI lives at <code>/login</code>.
        </p>
      </div>
    </main>
  );
}
