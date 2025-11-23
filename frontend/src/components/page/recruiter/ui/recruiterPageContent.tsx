import PaginatedContainer from "@/components/ui/paginatedContainer";
import { GetJobsCreatedByRecruiter } from "@/lib/client/services/jobService";
import JobDetailsRecruiter from "./jobDetailsRecruiter";

export default async function RecruiterPageContent() {
    const jobs = await GetJobsCreatedByRecruiter("")

    return (
        <div className="flex flex-col gap-10">
            <PaginatedContainer label="Jobs listed by you:">
                { jobs.map((job, i) =>
                    <JobDetailsRecruiter key={i} job={job}></JobDetailsRecruiter>
                )}
            </PaginatedContainer>
        </div>
    );
}