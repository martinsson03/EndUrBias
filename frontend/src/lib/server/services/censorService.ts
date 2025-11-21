// Censor functions, on the server, that is related to censoring resumes. Contains business logic.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import AnonymizeResponse from "@/lib/models/responses/AnonymizeResponse";

// Censors a cv using the censor micro-service and returns the new cv as a string.
export async function CensorCV(request: ApplicationSubmitRequest): Promise<AnonymizeResponse> {
    throw new Error("Not implemented!");

    // Send post request to censorIpAddr/anonymize, with body: AnonymizeRequest {}
}