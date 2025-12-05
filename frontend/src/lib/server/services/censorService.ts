// Censor functions, on the server, that is related to censoring resumes. Contains business logic.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import AnonymizeResponse from "@/lib/models/responses/anonymizeResponse";

// Censors a cv using the censor micro-service and returns the new cv as a string.
export async function CensorCV(request: ApplicationSubmitRequest): Promise<AnonymizeResponse> {
    const rawEndpoint: string | undefined = process.env.PYTHON_ADRESS;
    const rawPort: string | undefined = process.env.PYTHON_PORT;

    const endpoint: string = rawEndpoint === undefined ? "" : rawEndpoint;
    const port: string     = rawPort === undefined ? "" : rawPort;
    console.log("fE" + request);
    const response: Response = await fetch(`http://${endpoint}:${port}/anonymize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvBase64: request.CV, "firstName": request.Firstname, "lastName": request.Lastname })
    });

    const anonymizeResponse: AnonymizeResponse = await response.json();

    return anonymizeResponse;
}