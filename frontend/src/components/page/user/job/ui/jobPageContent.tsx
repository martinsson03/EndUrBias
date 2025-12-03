import { Button } from "@/components/shadcn/ui/button";
import { SeperatorHorizontal } from "@/components/ui/seperator";
import JobViewModel from "@/lib/models/view/jobViewModel";
import Link from "next/link";

import ApplyJobClient from "./applyJobClient";
import JobDetailsFull from "@/components/ui/jobDetailsFull";

type JobPageContentProps = {
    job: JobViewModel
};

// The content that exist for a job on a page.
export default function JobPageContent({ job }: JobPageContentProps) {
    return (
        <div className="flex flex-col gap-5">
            <JobDetailsFull job={job}>
                <Link href={`#apply`}><Button>Apply now!</Button></Link>
            </JobDetailsFull>

            <SeperatorHorizontal></SeperatorHorizontal>
            
            <ApplyJobClient id="apply" jobId={job.id} userId="666666666666666666666666666666666666"></ApplyJobClient>
        </div>
    );
}