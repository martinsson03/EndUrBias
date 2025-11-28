// User functions, on the client, that is related to applications.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import type { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import CVViewModel from "@/lib/models/view/cvViewModel";

// Tries to submit an application and returns true if it was possible. Called by the user.
export async function SubmitApplication(request: ApplicationSubmitRequest, jobId: id): Promise<boolean> {
    const response: Response = await fetch(`/api/application?jobId=${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });

    const success: boolean = await response.json();

    return success;
}

// Returns a censored cv from the specific job, if null, no cv exist. The user has to be a recruiter.
export async function GetCensoredApplication(jobId: id): Promise<CensoredCVViewModel | null> {
    throw new Error("Not implemented!");
}

// Returns all uncensored applications from the specific job if the user is a recruiter.
export async function GetUncensoredApplications(jobId: id): Promise<CVViewModel[]> {
    throw new Error("Not implemented!");
}

// Returns all censored applications from the specific job that the recruiter has looked at already. If the user is a recruiter.
export async function GetCensoredLookedAtApplications(jobId: id): Promise<CensoredCVViewModel[]> {
    throw new Error("Not implemented!");
}

// Returns all applications that are considered a candidate.
export async function GetCandidateApplications(jobId: id): Promise<CVViewModel[]> {
    throw new Error("Not implemented!");
}

// Changes the application to the 4 different states depending on the current state and the requestRealCV parameter. Returns true if it worked.
export async function ChangeApplicationState(requestRealCV: boolean, applicationId: id): Promise<boolean> {
    const response: Response = await fetch(`/api/application?requestRealCV=${requestRealCV}&applicationId${applicationId}`, {
        method: "GET"
    });

    const success: boolean = await response.json();

    return success;
}