// User functions, on the client, that is related to applications.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import CensoredCvBase64 from "@/lib/models/shared/censoredCv";
import CvBase64 from "@/lib/models/shared/cv";
import type { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import CVViewModel from "@/lib/models/view/cvViewModel";
import { DecodeB64ToString, DecodeB64ToUint8Array } from "@/lib/shared/base64";

// Tries to submit an application and returns true if it was possible. Called by the user.
export async function SubmitApplication(request: ApplicationSubmitRequest, jobId: id, userId: id): Promise<boolean> {
    const response: Response = await fetch(`/api/application?jobId=${jobId}&userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });

    const success: boolean = await response.json();

    if (typeof success !== "boolean") return false;

    return success;
}

// Returns a censored cv from the specific job, if null, no cv exist. The user has to be a recruiter.
export async function GetCensoredApplication(jobId: id): Promise<CensoredCVViewModel | null> {
    const response: Response = await fetch(`/api/application/censored?jobId=${jobId}`, {
        method: "GET"
    });

    const censoredCv: CensoredCvBase64 | null = await response.json();

    if (
        typeof censoredCv?.CensoredCV !== "string" ||
        typeof censoredCv?.id         !== "string"
    ) return null;

    return { id: censoredCv.id, CensoredCV: DecodeB64ToString(censoredCv.CensoredCV) };
}

// Returns all uncensored applications from the specific job if the user is a recruiter.
export async function GetUncensoredApplications(jobId: id): Promise<CVViewModel[]> {
    const response: Response = await fetch(`/api/application/uncensored?jobId=${jobId}`, {
        method: "GET"
    });

    const uncensoredCvs: CvBase64[] = await response.json();

    if (typeof uncensoredCvs === undefined) return [];

    return uncensoredCvs.map(cv => (
        { 
            id: cv.id, 
            CV: DecodeB64ToUint8Array(cv.CV) 
        }));
}

// Returns all censored applications from the specific job that the recruiter has looked at already. If the user is a recruiter.
export async function GetCensoredLookedAtApplications(jobId: id): Promise<CensoredCVViewModel[]> {
    const response: Response = await fetch(`/api/application/viewed?jobId=${jobId}`, {
        method: "GET"
    });

    const censoredCvs: CensoredCvBase64[] = await response.json();

    if (typeof censoredCvs === undefined) return [];

    return censoredCvs.map(cv => (
        { 
            id: cv.id, 
            CensoredCV: DecodeB64ToString(cv.CensoredCV) 
        }));
}

// Returns all applications that are considered a candidate.
export async function GetCandidateApplications(jobId: id): Promise<CVViewModel[]> {
    const response: Response = await fetch(`/api/application/candidate?jobId=${jobId}`, {
        method: "GET"
    });

    const candidateCvs: CvBase64[] = await response.json();

    if (typeof candidateCvs === undefined) return [];

    return candidateCvs.map(cv => (
        { 
            id: cv.id, 
            CV: DecodeB64ToUint8Array(cv.CV) 
        }));
}

// Changes the application to the 4 different states depending on the current state and the requestRealCV parameter. Returns true if it worked.
export async function ChangeApplicationState(requestRealCV: boolean, applicationId: id): Promise<boolean> {
    const response: Response = await fetch(`/api/application?requestRealCv=${requestRealCV}&applicationId=${applicationId}`, {
        method: "PUT"
    });

    const success: boolean = await response.json();

    if (typeof success !== "boolean") return false;

    return success;
}