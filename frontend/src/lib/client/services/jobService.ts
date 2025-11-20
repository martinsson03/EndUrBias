// User functions, on the client, that is related to jobs.

import UpdateJobRequest from "@/lib/models/requests/updateJobRequest";
import type { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";

// Returns all avaibles jobs that exist on the market right now.
export async function GetAvaibleJobs(): Promise<JobViewModel[]> {
    throw new Error("Not implemented!");
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