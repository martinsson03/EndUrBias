import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import { id } from "@/lib/models/shared/id";
import { ChangeApplicationState, SubmitApplication } from "@/lib/server/services/applicationService";
import { EncodeB64 } from "@/lib/shared/base64";

// POST: /api/application?jobId=<value>&userId=<value> | Submit an application for a job with specific id.
export async function POST(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const rawUserId = url.searchParams.get("userId");

    if (!rawUserId) return new Response("Invalid request, missing userId!", { status: 400 });

    const userId: id = rawUserId;

    const submission: ApplicationSubmitRequest = await request.json();

    if (
        typeof submission?.CV          !== "string" ||
        typeof submission?.Firstname   !== "string" ||
        typeof submission?.Lastname    !== "string" ||
        typeof submission?.Phonenumber !== "string" ||
        typeof submission?.Mail        !== "string"
    ) return new Response("Invalid request body for submission!", { status: 400 });

    submission.CV = EncodeB64(submission.CV);

    const success: boolean = await SubmitApplication(submission, jobId, userId);

    return Response.json(success);
}

// PUT: /api/application?requestRealCv=<value>&applicationId=<value> | Change state of application, done by recruiter.
export async function PUT(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawApplicationId = url.searchParams.get("applicationId");

    if (!rawApplicationId) return new Response("Invalid request, missing applicationId!", { status: 400 });

    const applicationId: id = rawApplicationId;

    const rawRequestRealCv = url.searchParams.get("requestRealCv");

    if (!rawRequestRealCv) return new Response("Invalid request, missing requestRealCv!", { status: 400 });
    
    const requestRealCv: boolean = rawRequestRealCv.toLowerCase() === "true";

    if (typeof requestRealCv !== "boolean") return new Response("RequestRealCv has an invalid type, has to be a boolean!", { status: 400 });

    const success: boolean = await ChangeApplicationState(requestRealCv, applicationId);

    return Response.json(success);
}