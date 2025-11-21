import { Badge } from "@/components/shadcn/ui/badge";
import { Button } from "@/components/shadcn/ui/button";
import MarkdownFormatter from "@/components/ui/markdownFormatter";
import { SeperatorHorizontal } from "@/components/ui/seperator";
import JobViewModel from "@/lib/models/view/jobViewModel";
import Link from "next/link";

import { MapPin, BriefcaseBusiness } from "lucide-react";
import ApplyJobClient from "./applyJobClient";

type JobPageContentProps = {
    job: JobViewModel
};

// The content that exist for a job on a page.
export default function JobPageContent({ job }: JobPageContentProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-10 justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold">{ job.Title }</h3>
                    <Link className="flex" href={`user/company/${job.CompanyId}`}><BriefcaseBusiness className="pr-1" size={25}></BriefcaseBusiness><h6 className="italic">{ job.Company }</h6></Link>
                    <h6 className="flex"><MapPin className="pr-1" size={25}></MapPin>{ job.Location } • { job.Extent }</h6>
                    <div className="flex gap-1 flex-wrap">
                        {job.Tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{ tag }</Badge>
                        ))}
                    </div>
                </div>

                <Link href={`#apply`} className="self-end"><Button>Apply now!</Button></Link>
            </div>

            <SeperatorHorizontal></SeperatorHorizontal>

            <div className="flex flex-col gap-1">
                <MarkdownFormatter markdown={job.Description}></MarkdownFormatter>
            </div>

            <SeperatorHorizontal></SeperatorHorizontal>
            
            <ApplyJobClient id="apply"></ApplyJobClient>
        </div>
    );
}