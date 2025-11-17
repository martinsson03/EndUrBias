"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { CvDropzone } from "@/components/ui/cv-dropzone";
import { Button } from "@/components/ui/button";

export function ApplyFormClient() {
  const [cv, setCv] = useState<File | null>(null);

  return (
    <form className="grid gap-6">
      {/* 6-kolumners grid */}
      <div className="grid gap-4 md:grid-cols-6">
        {/* Firstname */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="firstname">Firstname</Label>
          <Input id="firstname" className="h-10" placeholder="Your firstname" />
        </div>

        {/* Lastname */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="lastname">Lastname</Label>
          <Input id="lastname" className="h-10" placeholder="Your lastname" />
        </div>

        {/* Gender */}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="gender">Gender</Label>
          <NativeSelect id="gender" className="w-full h-10">
            <NativeSelectOption value="">Select gender</NativeSelectOption>
            <NativeSelectOption value="man">Man</NativeSelectOption>
            <NativeSelectOption value="kvinna">Kvinna</NativeSelectOption>
            <NativeSelectOption value="annat">Annat</NativeSelectOption>
            <NativeSelectOption value="none">Prefer not to say</NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Email */}
        <div className="grid gap-2 md:col-span-3">
          <Label>Email</Label>
          <Input type="email" className="h-10" placeholder="you@example.com" />
        </div>

        {/* Phone */}
        <div className="grid gap-2 md:col-span-3">
          <Label>Phone number</Label>
          <Input type="tel" className="h-10" placeholder="+46..." />
        </div>
      </div>

      {/* CV-upload */}
      <CvDropzone onFileChange={setCv} />

      {/* Submit button */}
      <Button type="submit" className="w-full mt-2">
        Submit application
      </Button>
    </form>
  );
}
