import { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { GetJobsCreatedByRecruiter } from "@/lib/server/services/jobService";

// GET: api/job/recruiter?userId=<value> | Gets all jobs created by the recruiter.
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawUserId = url.searchParams.get("userId");

    if (!rawUserId) return new Response("Invalid request, missing userId!", { status: 400 });

    const userId: id = rawUserId;

    const job: JobViewModel[] = await GetJobsCreatedByRecruiter(userId);

    return Response.json(job);
}