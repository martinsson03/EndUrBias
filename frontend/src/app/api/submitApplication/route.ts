// app/api/submitApplication/route.ts

import { NextResponse } from "next/server";

// Typen av payload som frontend skickar
interface ApplicationPayload {
  jobId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  cvBase64: string;
}

export async function POST(req: Request) {
  try {
    // Läs JSON från request-body
    const data = (await req.json()) as ApplicationPayload;

    console.log("Received application:", data);

    // Enkel validering
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // TODO (Daniel – Backend):
    // Här ska backend-logiken implementeras.
    //
    // Daniel här ska du:
    // - Skicka payloaden till databasens api
    // - Spara ansökan i databas, sedan skicka vidare den till
    // - Lagra CV:t i file storage
    // - Trigga automatiserad screening / AI-analys

    return NextResponse.json(
      { message: "Application received successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in submitApplication API:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
