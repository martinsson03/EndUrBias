import { Button } from "@/components/shadcn/ui/button";
import JobDetails from "@/components/ui/jobDetails";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { cn } from "@/lib/shadcn/utils";
import Link from "next/link";

type JobDetailsUserProps = {
    job: JobViewModel,
    className?: string
}

export default function JobDetailsUser({ job, className }: JobDetailsUserProps) {
    return (
        <JobDetails job={job} className={cn(className)}>
            <Link href={`/user/job/${job.id}`}><Button>Learn more!</Button></Link>
        </JobDetails>
    );
}