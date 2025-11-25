"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/ui/appLayout";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null); // To store the user's role
  const router = useRouter(); // For programmatic navigation

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this code runs only on the client-side
      const idToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_token="))
        ?.split("=")[1];

      console.log("id_token from cookies:", idToken); // Log the id_token

      if (idToken) {
        // Decode JWT token and extract the role
        const decoded = JSON.parse(atob(idToken.split(".")[1])); // Decoding the JWT
        console.log("Decoded JWT:", decoded); // Log the decoded JWT
        setRole(decoded.role); // Assuming the role is part of the decoded payload
      } else {
        console.error("No id_token found in cookies");
      }
    }
  }, []);

  useEffect(() => {
    console.log("Role from decoded JWT:", role); // Log the role

    if (role && role !== "recruiter") {
      // Redirect non-recruiters to an unauthorized page
      router.push("/unauthorized");
    }
  }, [role, router]);

  if (!role) return <div>Loading...</div>; // Wait for the role to be determined

  return AppLayout({ children }); // If the role is recruiter, render the page
}
