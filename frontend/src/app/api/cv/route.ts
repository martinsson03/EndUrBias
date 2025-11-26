// app/api/getJobs/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://backend:8000/demo");
    const data = await response.json();
    console.log("Response from backend:", data);
    return NextResponse.json({ message: "Hello from frontend!", backend: data }, { status: 200 });
  } catch (error: any) {
    console.error("Error in getJobs API:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
