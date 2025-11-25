"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/ui/appLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null); // To store the user's role
  const router = useRouter(); // For programmatic navigation

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only run in the browser
      const idToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_token="))
        ?.split("=")[1];

      console.log("id_token from cookies:", idToken); // Log the raw id_token

      if (idToken) {
        // Check if the token follows the JWT structure (should be 3 parts)
        const tokenParts = idToken.split(".");
        if (tokenParts.length === 3) {
          console.log("Valid JWT format detected.");
          try {
            const decoded = JSON.parse(atob(tokenParts[1])); // Decoding the JWT token
            console.log("Decoded JWT:", decoded); // Log the decoded JWT
            setRole(decoded.role); // Assuming the role is part of the decoded payload
          } catch (error) {
            console.error("Error decoding JWT:", error);
          }
        } else {
          console.error("Invalid JWT format:", idToken); // Log error if the format is wrong
        }
      } else {
        console.error("id_token not found in cookies");
      }
    }
  }, []);

  useEffect(() => {
    console.log("Role from decoded JWT:", role); // Log the role to verify

    if (role && role !== "user") {
      // Redirect to unauthorized page if role is not 'user'
      router.push("/unauthorized");
    }
  }, [role, router]);

  if (!role) return <div>Loading...</div>; // Wait for role to be determined

  return AppLayout({ children }); // If role is 'user', render the page
}
