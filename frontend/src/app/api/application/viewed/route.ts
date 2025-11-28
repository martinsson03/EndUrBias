import { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import { GetCensoredLookedAtApplications } from "@/lib/server/services/applicationService";

// GET: /api/application/viewed?jobId=<value> | Gets all censored, but looked at, applications.
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const cv: CensoredCVViewModel[] = await GetCensoredLookedAtApplications(jobId);

    return Response.json(cv);
}