// User functions, on the server, that is related to applications. Contains the business logic.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import type { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import CVViewModel from "@/lib/models/view/cvViewModel";
import { EncodeB64 } from "@/lib/shared/base64";
import { MakeSqlQuery } from "./databaseService";

// Tries to format and submit an application to the database.
export async function SubmitApplication(request: ApplicationSubmitRequest, jobId: id): Promise<boolean> {
    request.CV = EncodeB64(request.CV);
    
    const rawEndpoint: string | undefined = process.env.PYTHON_ADRESS;
    const rawPort: string | undefined = process.env.PYTHON_PORT;

    const endpoint: string = rawEndpoint === undefined ? "" : rawEndpoint;
    const port: string     = rawPort === undefined ? "" : rawPort;

    const response: Response = await fetch(`http://${endpoint}:${port}/anonymize`, {
        method: "POST",
        headers: { "Content-Type": "json" },
        body: JSON.stringify({ cvBase64: request.CV })
    });

    const anonymizedCv: { cvBase64: string } = await response.json();

    if (typeof anonymizedCv !== "string") return false;

    // Insert application into database.
    await MakeSqlQuery(`
        
    `);
    
    return true;
}

// Returns a censored cv from the specific job, if null, no cv exist. Fetches it from the database.
export async function GetCensoredApplication(jobId: id): Promise<CensoredCVViewModel | null> {
    throw new Error("Not implemented!");
}

// Returns all uncensored applications from the specific job. Fetches them from the database.
export async function GetUncensoredApplications(jobId: id): Promise<CVViewModel[]> {
    throw new Error("Not implemented!");
}

// Returns all censored applications from the specific job that the recruiter has looked at already. Fetches them from the database.
export async function GetCensoredLookedAtApplications(jobId: id): Promise<CensoredCVViewModel[]> {
    throw new Error("Not implemented!");
}

// Returns all applications that are considered a candidate.
export async function GetCandidateApplications(jobId: id): Promise<CVViewModel[]> {
    throw new Error("Not implemented!");
}

// Changes the application to the 4 different states depending on the current state and the requestRealCV parameter. Returns true if it worked.
export async function ChangeApplicationState(requestRealCV: boolean, applicationId: id): Promise<boolean> {
    throw new Error("Not implemented!");
}