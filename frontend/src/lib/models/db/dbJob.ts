import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";

// Job as seen in the job table.
export default interface Job extends IdentifiableObject {
    companyid: id,             // Id of the company that host this job.
    recruiterid: id,           // Id of the recruiter that published this job.
    dateoftermination: string, // Last date of new applications.
    title: string,             // Title of the job!
    location: string,          // Where the job is located, ex: Gothenburg.
    extent: string,            // What type of job type is it, ex: full-time, part-time.
    description: string,       // Job description that the recruiter has filled in.
    tags: string               // A list of tags that are associated with this job. Seperated by ','.
};