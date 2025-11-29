import CvBase64 from "@/lib/models/shared/cv";
import { id } from "@/lib/models/shared/id";
import { GetCandidateApplications } from "@/lib/server/services/applicationService";

// GET: /api/application/candidate?jobId=<value> | Gets all candidates!
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const cv: CvBase64[] = await GetCandidateApplications(jobId);

    return Response.json(cv);
}