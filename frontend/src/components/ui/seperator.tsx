import { cn } from "@/lib/shadcn/utils";

type SeperatorProps = {
    className?: string
};

// Small seperator for seperating elements vertically.
export function SeperatorVerticle({ className }: Readonly<SeperatorProps>) {
    return (
        <div className={cn("h-full w-[0.3px] bg-secondary-foreground", className)}></div>
    );
}

// Horizontal seperator.
export function SeperatorHorizontal({ className }: Readonly<SeperatorProps>) {
    return (
        <div className={cn("h-[0.3px] w-full bg-secondary-foreground", className)}></div>
    );
}