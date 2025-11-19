// app/api/getJobs/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO (Daniel – Backend):
    // Här ska du hämta jobb från databasen när backend är klar.
    //
    // Viktigt:
    // Frontend använder JUST NU de hårdkodade jobben i lib/jobs.ts,
    // så detta endpoint är enbart en placeholder och används inte ännu.
    // Jag vill ha en dynamsk lista som updateras då Lukas postar nya jobb 
    // sitt api från recruiter panelen

    return NextResponse.json(
      { message: "getJobs endpoint placeholder – not implemented yet" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in getJobs API:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
