"use client";

import { PageContentContainer } from "@/components/ui/pageContentContainer";

export default function Home() {
  function handleLogin() {
    const authUrl = new URL("http://localhost:8002/login");
    authUrl.searchParams.set("client_id", "eyb-frontend");
    authUrl.searchParams.set(
      "redirect_uri",
      "http://localhost:8000/auth/callback"
    );

    window.location.href = authUrl.toString();
  }

  return (
    <PageContentContainer className="flex flex-col items-center mt-10 gap-5">
      <h1 className="text-center">End Your Bias</h1>

      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Logga in
      </button>
    </PageContentContainer>
  );
}
