import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/ui/pagination";
import { cn } from "@/lib/shadcn/utils";

type PaginatedContainerProps = {
    children?: React.ReactNode,
    className?: string,
    label?: string
};

// A container for all jobs that is paginated.
export default function PaginatedContainer({ children, className, label }: PaginatedContainerProps) {
    return (
        <div className={cn("flex flex-col grow", className)}>
            {
                label ? (<h6 className="text-secondary-foreground pb-2">{ label }</h6>) : null
            }

            <div className="grow grid grid-cols-3 gap-5 pb-5">
                { children }
            </div>

            {
                children ? null : (<p className="text-center text-secondary-foreground p-20">No data avaible!</p>)
            }

            <Pagination className="pb-4">
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