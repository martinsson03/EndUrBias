import { cn } from "@/lib/shadcn/utils";

type PageContentContainerProps = {
    children: React.ReactNode,
    className?: string
};

// Content container for any page. Only adds the margin to make sure the page content is in the correct spot.
export function PageContentContainer({ children, className }: Readonly<PageContentContainerProps>) {
    return (
        <div className={cn("margin-responsive grow", className)}>{ children }</div>
    );
}