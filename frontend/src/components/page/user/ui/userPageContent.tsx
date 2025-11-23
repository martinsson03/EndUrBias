import PaginatedContainer from "@/components/ui/paginatedContainer";
import SearchBar from "./searchBarClient";
import JobDetailsUser from "./jobDetailsUser";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { GetAvaibleJobs } from "@/lib/client/services/jobService";

// Contains the content on the user page.
export default async function UserPageContent() {
    const jobs: JobViewModel[] = await GetAvaibleJobs();

    return(
        <div className="flex flex-col gap-10">
            <SearchBar></SearchBar>
            <PaginatedContainer label="Jobs found:">
                { jobs.map((job, i) =>
                    <JobDetailsUser key={i} job={job}></JobDetailsUser>
                )}
            </PaginatedContainer>
        </div>
    );
}