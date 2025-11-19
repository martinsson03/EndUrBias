"use client";
// Klientkomponent: behövs eftersom vi använder state, events och FileReader.

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/nativeSelect";
import { CvDropzone } from "@/components/ui/cvDropzone";
import { Button } from "@/components/ui/button";

interface ApplyFormClientProps {
  jobId: string; // ID på jobbet som användaren söker (kommer från serverkomponenten)
}

interface ApplicationPayload {
  jobId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  cvBase64: string; // CV i Base64-format innan det skickas till backend
}

// Konverterar ett File-objekt (PDF) till Base64-sträng.
// FileReader är asynkron, därför returneras en Promise.
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve((reader.result as string).split(",")[1] || "");
    reader.readAsDataURL(file);
  });
}

export function ApplyFormClient({ jobId }: ApplyFormClientProps) {
  // Formfält
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cv, setCv] = useState<File | null>(null);

  // UI-state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Hanterar själva submit-eventet
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Enkel validering
    if (!firstname || !lastname || !email) {
      setError("Please fill in firstname, lastname and email.");
      return;
    }

    if (!cv) {
      setError("Please upload your CV as a PDF.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Gör om PDF-filen till Base64 innan den skickas
      const cvBase64 = await fileToBase64(cv);

      // Payload som skickas till backend
      const payload: ApplicationPayload = {
        jobId,
        firstName: firstname,
        lastName: lastname,
        gender,
        email,
        phone,
        cvBase64,
      };

      console.log("Sending application payload:", payload);

      // POST mot API-route
      const res = await fetch("/api/submitApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Server returned an error status.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      {/* Fält organiserade i 6 kolumner */}
      <div className="grid gap-4 md:grid-cols-6">
        {/* Firstname */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="firstname">Firstname</Label>
          <Input
            id="firstname"
            className="h-10"
            placeholder="Your firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>

        {/* Lastname */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="lastname">Lastname</Label>
          <Input
            id="lastname"
            className="h-10"
            placeholder="Your lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="gender">Gender</Label>
          <NativeSelect
            id="gender"
            className="w-full h-10"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <NativeSelectOption value="">Select gender</NativeSelectOption>
            <NativeSelectOption value="man">Man</NativeSelectOption>
            <NativeSelectOption value="kvinna">Kvinna</NativeSelectOption>
            <NativeSelectOption value="annat">Annat</NativeSelectOption>
            <NativeSelectOption value="none">
              Prefer not to say
            </NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Email */}
        <div className="grid gap-2 md:col-span-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="h-10"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="grid gap-2 md:col-span-3">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            className="h-10"
            placeholder="+46..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* CV-uploadfält */}
      <CvDropzone onFileChange={setCv} />

      {/* Feedback till användaren */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          Application submitted successfully.
        </p>
      )}

      {/* Submit-knapp */}
      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}
