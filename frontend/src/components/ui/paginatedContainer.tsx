import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/ui/pagination";
import { cn } from "@/lib/shadcn/utils";

type PaginatedContainerProps = {
    children?: React.ReactNode,
    className?: string,
    label?: string,
    columns?: number
};

// A container for all jobs that is paginated.
export default function PaginatedContainer({ children, className, label, columns }: PaginatedContainerProps) {
    return (
        <div className={cn("flex flex-col grow", className)}>
            {
                label ? (<h6 className="text-secondary-foreground pb-2">{ label }</h6>) : null
            }

            <div className="grow grid gap-5 pb-5" style={{"gridTemplateColumns": `repeat(${columns ?? 3}, minmax(0, 1fr))`}}>
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