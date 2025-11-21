import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/ui/pagination";
import { GetAvaibleJobs } from "@/lib/client/services/jobService";
import JobViewModel from "@/lib/models/view/jobViewModel";
import JobDetailsUser from "./jobDetailsUser";

const jobs: JobViewModel[] = await GetAvaibleJobs();

// A container for all jobs that is paginated.
export default function PaginatedJobList() {
    return (
        <div className="flex flex-col grow">
            <h6 className="text-secondary-foreground pb-2">Jobs found:</h6>

            <div className="grow grid grid-cols-3 gap-5 pb-5">
                { jobs.map((job, i) =>
                    <JobDetailsUser key={i} job={job}></JobDetailsUser>
                )}
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}