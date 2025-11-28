import { id } from "@/lib/models/shared/id";
import CVViewModel from "@/lib/models/view/cvViewModel";
import { GetCandidateApplications } from "@/lib/server/services/applicationService";

// GET: /api/application/candidate?jobId=<value> | Gets all candidates!
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const cv: CVViewModel[] = await GetCandidateApplications(jobId);

    return Response.json(cv);
}