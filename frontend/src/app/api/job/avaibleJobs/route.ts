import JobViewModel from "@/lib/models/view/jobViewModel";
import { GetAvaibleJobs } from "@/lib/server/services/jobService";

// GET: /api/job/avaibleJobs | Gets all avaible jobs.
export async function GET(request: Request): Promise<Response> {
    const job: JobViewModel[] = await GetAvaibleJobs()

    return Response.json(job);
}