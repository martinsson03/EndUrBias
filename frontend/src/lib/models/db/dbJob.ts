import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";

// Job as seen in the job table.
export default interface Job extends IdentifiableObject {
    CompanyId: id,           // Id of the company that host this job.
    RecruiterId: id,         // Id of the recruiter that published this job.
    DateOfTermination: Date, // Last date of new applications.
    Title: string,           // Title of the job!
    Location: string,        // Where the job is located, ex: Gothenburg.
    Extent: string,          // What type of job type is it, ex: full-time, part-time.
    Description: string,     // Job description that the recruiter has filled in.
    Tags: string[]           // A list of tags that are associated with this job.
};