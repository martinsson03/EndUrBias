import { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { GetJobById } from "@/lib/server/services/jobService";

// GET: api/job?jobId=<value> | Gets a job by id.
export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);

    const rawJobId = url.searchParams.get("jobId");

    if (!rawJobId) return new Response("Invalid request, missing jobId!", { status: 400 });

    const jobId: id = rawJobId;

    const job: JobViewModel | null = await GetJobById(jobId)

    if (!job) return Response.json(null); // No jobs found with the specified id, return null.

    return Response.json(job);
}

// POST: api/job | Creates a new job.
export async function POST(request: Request): Promise<Response> {
    throw new Error("Not implemented!");
}

// PUT: api/job?jobId=<value> | Updates an existing job by id.
export async function PUT(request: Request): Promise<Response> {
    throw new Error("Not implemented!");
}

// DELETE: api/job?jobId=<value> | Deletes an existing job by id.
export async function DELETE(request: Request): Promise<Response> {
    throw new Error("Not implemented!");
}