"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";

type LoginFormProps = {
  clientId: string;
  redirectUri: string;
  error: string;
};

export function LoginForm({ clientId, redirectUri, error }: LoginFormProps) {
  const decodedError = useMemo(
    () => (error ? decodeURIComponent(error) : ""),
    [error]
  );

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-lg p-8">
        {/* Small header */}
        <p className="text-xs font-semibold tracking-wide text-zinc-500 mb-1 text-center">
          EYB AUTH SERVER
        </p>

        <h1 className="text-2xl font-bold text-center text-zinc-900 mb-2">
          End Your Bias
        </h1>

        <p className="text-sm text-zinc-500 text-center mb-6">
          Sign in to continue to the recruiter tool.
        </p>

        {/* Error message */}
        {decodedError && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
            {decodedError}
          </div>
        )}

        <form method="POST" action="/api/oauth/login" className="space-y-4">
          {/* Hidden OAuth2 parameters */}
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="redirect_uri" value={redirectUri} />

          {/* Email */}
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-zinc-800"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="bg-white border-zinc-300 text-zinc-900 text-sm focus-visible:ring-zinc-900"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-zinc-800"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-white border-zinc-300 text-zinc-900 text-sm focus-visible:ring-zinc-900"
            />
          </div>

          {/* Demo info */}
          <p className="text-[11px] leading-relaxed text-zinc-500">
            Demo accounts:
            <br />
            user@example.com · recruiter@example.com
            <br />
            Password:{" "}
            <span className="font-semibold text-zinc-800">password</span>
          </p>

          {/* Submit */}
          <Button
            type="submit"
            className="mt-2 w-full rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
