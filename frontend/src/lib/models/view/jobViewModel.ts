import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";

// The job that will be displayed on the client by both the user and the recruiter.
export default interface JobViewModel extends IdentifiableObject {
    DateOfTermination: Date, // Last date of new applications.
    Title: string,           // Title of the job!
    Company: string,         // Name of company.
    CompanyId: id,           // Company id.
    Location: string,        // Where the job is located, ex: Gothenburg.
    Extent: string,          // What type of job type is it, ex: full-time, part-time.
    Description: string,     // Job description that the recruiter has filled in.
    Tags: string[]           // A list of tags that are associated with this job.
};