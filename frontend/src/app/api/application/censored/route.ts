import CensoredCvBase64 from "@/lib/models/shared/censoredCv";
import { id } from "@/lib/models/shared/id";
import { GetCensoredApplication } from "@/lib/server/services/applicationService";

// GET: /api/application/censored?jobId=<value> | Gets a censored application for a specific job.
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const cv: CensoredCvBase64 | null = await GetCensoredApplication(jobId);

    return Response.json(cv);
}