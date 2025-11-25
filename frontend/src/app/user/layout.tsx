"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/ui/appLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const idToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("id_token="))
      ?.split("=")[1];

    if (idToken) {
      try {
        // Decode JWT and extract role
        const decoded = JSON.parse(atob(idToken.split(".")[1]));
        setRole(decoded.role); // Assuming the role is part of the decoded payload
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setRole(null); // In case decoding fails, set role to null
      }
    } else {
      console.error("id_token not found in cookies");
    }
  }, []);

  useEffect(() => {
  

    if (role && role !== "user") {
      // Redirect to unauthorized page if role is not 'user'
      router.push("/unauthorized");
    }
  }, [role, router]);

  if (!role) return <div>Loading...</div>; // Wait for role to be determined

  return AppLayout({ children }); // If role is 'user', render the page
}
