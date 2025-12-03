// User functions, on the server, that is related to jobs. Contains business logic.

import Job from "@/lib/models/db/dbJob";
import UpdateJobRequest from "@/lib/models/requests/updateJobRequest";
import type { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { MakeSqlQuery } from "./databaseService";
import Company from "@/lib/models/db/dbCompany";
import Recruiter from "@/lib/models/db/dbRecruiter";

// Returns all avaibles jobs that exist on the market right now, according to the database.
export async function GetAvaibleJobs(): Promise<JobViewModel[]> {
    const todaysDate: Date = new Date();

    const todaysDateAsSqlDate: string = todaysDate.toISOString().split("T")[0];

    const jobs: Job[] | null = await MakeSqlQuery<Job>(`SELECT * FROM JobPostings WHERE dateOfTermination > '${todaysDateAsSqlDate}'`);

    if (!jobs) return [];

    const companies: Company[] | null = await MakeSqlQuery<Company>(`SELECT * FROM Companies`);

    if (!companies) return [];

    const recruiters: Recruiter[] | null = await MakeSqlQuery<Recruiter>(`SELECT * FROM Recruiters`);

    if (!recruiters) return [];

    const viewModels: JobViewModel[] = (jobs ?? []).flatMap(job => {
        const jobCompany: Company | null = companies?.find(company => company.id === job.companyid) ?? null;
    
        const jobRecruiter: Recruiter | null = recruiters?.find(recruiter => recruiter.id === job.recruiterid) ?? null;
    
        if (!jobCompany || !jobRecruiter) return [];

        return [createViewModel(job, jobCompany, jobRecruiter)];
    }).filter(viewModel => viewModel !== null);

    return viewModels;
}

// Returns all details of a job by an id.
export async function GetJobById(jobId: id): Promise<JobViewModel | null> {
    const jobs: Job[] | null = await MakeSqlQuery<Job>(`SELECT * FROM JobPostings WHERE id = '${jobId}'`);

    if (!jobs) return null;

    const job: Job = jobs[0];

    const companies: Company[] | null = await MakeSqlQuery<Company>(`SELECT * FROM Companies WHERE id = '${job.companyid}'`);

    if (!companies) return null;

    const company: Company = companies[0];

    const recruiters: Recruiter[] | null = await MakeSqlQuery<Recruiter>(`SELECT * FROM Recruiters WHERE id = '${job.recruiterid}'`);

    if (!recruiters) return null;

    const recruiter: Recruiter = recruiters[0];

    return createViewModel(job, company, recruiter);
}

// Get jobs created by the specific recruiter. User has to be recruiter to return anything useful.
export async function GetJobsCreatedByRecruiter(userId: id): Promise<JobViewModel[]> {
    const recruiters: Recruiter[] | null = await MakeSqlQuery<Recruiter>(`SELECT * FROM Recruiters WHERE userId = '${userId}'`);

    if (!recruiters) return [];

    const recruiter: Recruiter = recruiters[0];

    if (!recruiter) return [];

    const jobs: Job[] | null = await MakeSqlQuery<Job>(`SELECT * FROM JobPostings WHERE recruiterId = '${recruiter.id}'`);

    if (!jobs) return [];

    const companies: Company[] | null = await MakeSqlQuery<Company>(`SELECT * FROM Companies WHERE id = '${recruiter.companyid}'`);

    if (!companies) return [];

    const company: Company = companies[0];

    if (!company) return [];

    return jobs.flatMap(job => createViewModel(job, company, recruiter));
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

// Creates a view model using the parameters given.
function createViewModel(job: Job, company: Company, recruiter: Recruiter): JobViewModel {    
    return {
        DateOfTermination: job.dateoftermination,
        Title: job.title,
        Company: company.name,
        CompanyId: company.id,
        Location: job.location,
        Extent: job.extent,
        Description: job.description,
        Tags: job.tags.split(","),
        id: job.id
    };
};