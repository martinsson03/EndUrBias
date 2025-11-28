import { LoginForm } from "@/components/login-form";

/**
 * Login page for the auth server.
 */
type LoginPageProps = {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <LoginForm
      clientId={params.client_id ?? ""}
      redirectUri={params.redirect_uri ?? ""}
      error={params.error ?? ""}
    />
  );
}
