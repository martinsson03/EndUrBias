import { Button } from "@/components/shadcn/ui/button";
import JobDetails from "@/components/ui/jobDetails";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { cn } from "@/lib/shadcn/utils";
import Link from "next/link";

type JobDetailsRecruiterProps = {
    job: JobViewModel,
    className?: string
}

export default function JobDetailsRecruiter({ job, className }: JobDetailsRecruiterProps) {
    return (
        <JobDetails job={job} className={cn(className)}>
            <Link href={`/recruiter/talentpool/${job.id}`}><Button variant="outline">View talentpool</Button></Link>
            <Link href={`/recruiter/job/${job.id}`}><Button>View job</Button></Link>
        </JobDetails>
    );
}