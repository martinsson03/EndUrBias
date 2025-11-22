import { Button } from "@/components/shadcn/ui/button";
import JobDetailsFull from "@/components/ui/jobDetailsFull";
import JobViewModel from "@/lib/models/view/jobViewModel";
import Link from "next/link";
import { Trash, Pencil } from "lucide-react";

type JobPageContentProps = {
    job: JobViewModel
};

// The content that exist for a job on a page.
export default function JobPageContent({ job }: JobPageContentProps) {
    return (
        <div className="flex flex-col gap-5">
            <JobDetailsFull job={job}>
                <Link href={`/recruiter/talentpool/${job.id}`}><Button variant="outline">View talentpool</Button></Link>
                <Link href={``}><Button size="icon"><Pencil></Pencil></Button></Link>
                <Link href={``}><Button size="icon"><Trash></Trash></Button></Link>
            </JobDetailsFull>
        </div>
    );
}