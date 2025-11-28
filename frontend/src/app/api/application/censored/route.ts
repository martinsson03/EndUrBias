import { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import { GetCensoredApplication } from "@/lib/server/services/applicationService";

// GET: /api/application/censored?jobId=<value> | Gets a censored application for a specific job.
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const cv: CensoredCVViewModel | null = await GetCensoredApplication(jobId);

    return Response.json(cv);
}