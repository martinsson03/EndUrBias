// User functions, on the server, that is related to jobs. Contains business logic.

import UpdateJobRequest from "@/lib/models/requests/updateJobRequest";
import type { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";

// Returns all avaibles jobs that exist on the market right now, according to the database.
export async function GetAvaibleJobs(): Promise<JobViewModel[]> {
    throw new Error("Not implemented!");
}

// Returns all details of a job by an id.
export async function GetJobById(jobId: id): Promise<JobViewModel | undefined> {
    throw new Error("Not implemented!");
}

// Get jobs created by the specific recruiter. User has to be recruiter to return anything useful.
export async function GetJobsCreatedByRecruiter(userId: id): Promise<JobViewModel[]> {
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