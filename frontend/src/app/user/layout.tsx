"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/ui/appLayout";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const idToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("id_token="))
      ?.split("=")[1];

    if (idToken) {
      try {
        const decoded = JSON.parse(atob(idToken.split(".")[1]));
        setRole(decoded.role); // Set the role from the decoded token
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setRole(null); // In case of decoding failure
      }
    } else {
      console.error("id_token not found in cookies");
    }
  }, []);

  useEffect(() => {
    if (role && role !== "user") {
      router.push("/unauthorized"); // Redirect non-users to the unauthorized page
    }
  }, [role, router]);

  if (role === null) return <div>Loading...</div>; // Don't render anything until the role is determined

  return <AppLayout>{children}</AppLayout>; // Only render the page if the role is 'user'
}
