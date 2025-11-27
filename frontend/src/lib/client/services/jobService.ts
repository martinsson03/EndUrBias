// User functions, on the client, that is related to jobs.

import UpdateJobRequest from "@/lib/models/requests/updateJobRequest";
import type { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";

// Returns all avaibles jobs that exist on the market right now.
export async function GetAvaibleJobs(): Promise<JobViewModel[]> {
    const response: Response = await fetch(`/api/job/avaibleJobs`, {
        method: "GET"
    });

    if (!response.ok) console.error(`[Client] Failed to fetch avaible jobs! Response status: ${response.status}.`);

    const viewModels: JobViewModel[] = await response.json();

    return viewModels;
}

// Returns all details of a job by an id.
export async function GetJobById(jobId: id): Promise<JobViewModel | null> {
    const response: Response = await fetch(`/api/job?jobId=${jobId}`, {
        method: "GET"
    });

    if (!response.ok) console.error(`[Client] Failed to fetch job by id: ${jobId}! Response status: ${response.status}.`);

    const viewModel: JobViewModel = await response.json();

    return viewModel;
}

// Get jobs created by the specific recruiter. User has to be a recruiter for this to return anything!
export async function GetJobsCreatedByRecruiter(userId: id): Promise<JobViewModel[]> {
    const response: Response = await fetch(`/api/job/recruiter?userId=${userId}`, {
        method: "GET"
    });

    if (!response.ok) console.error(`[Client] Failed to fetch jobs created by recruiter with user id: ${userId}! Response status: ${response.status}.`);

    const viewModels: JobViewModel[] = await response.json();

    return viewModels;
}

// A recruiter can create a job using the parameters. Returns true if success.
export async function CreateNewJob(details: UpdateJobRequest): Promise<boolean> {
    throw new Error("Not implemented!");
}

// A recruiter can update a job using the parameters. Returns true if success.
export async function UpdateExistingJob(details: UpdateJobRequest): Promise<boolean> {
    throw new Error("Not implemented!");
}

// A recruiter can remove a job by id. Returns true if success.
export async function RemoveExistingJob(jobId: id): Promise<boolean> {
    throw new Error("Not implemented!");
}