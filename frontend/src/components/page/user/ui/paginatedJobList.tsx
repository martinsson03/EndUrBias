import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/ui/pagination"

// A container for all jobs that is paginated.
export default function PaginatedJobList() {
    return (
        <div className="flex flex-col grow">
            <h6 className="text-secondary-foreground pb-2">Jobs found:</h6>

            <div className="grow grid grid-cols-3 gap-5 pb-5">
                <div className="w-full h-50 bg-amber-300"></div>
                <div className="w-full h-50 bg-amber-400"></div>
                <div className="w-full h-50 bg-amber-300"></div>
                <div className="w-full h-50 bg-amber-400"></div>
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