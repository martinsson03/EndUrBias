"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/appLayout";

export default function RecruiterLayout({
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
        const decoded = JSON.parse(atob(idToken.split(".")[1]));
        setRole(decoded.role); // Assuming the role is part of the decoded payload
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setRole(null); // Clear role if JWT is invalid
      }
    }
  }, []);

  useEffect(() => {
    if (role && role !== "recruiter") {
      router.push("/unauthorized"); // Redirect non-recruiters to the unauthorized page
    }
  }, [role, router]);

  if (role === null) {
    return <div>Loading...</div>; // Display loading until the role is determined
  }

  return <AppLayout>{children}</AppLayout>; // Render layout if the role is 'recruiter'
}
