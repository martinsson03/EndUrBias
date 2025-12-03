import JobViewModel from "@/lib/models/view/jobViewModel";
import { BriefcaseBusiness, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "../shadcn/ui/badge";
import { Button } from "../shadcn/ui/button";
import { SeperatorHorizontal } from "./seperator";
import MarkdownFormatter from "./markdownFormatter";
import { cn } from "@/lib/shadcn/utils";

type JobDetailsFullProps = {
    job: JobViewModel,
    className?: string,
    children?: React.ReactNode
};

// The content that exist for a job on a page.
export default function JobDetailsFull({ job, className, children }: JobDetailsFullProps) {
    return (
        <div className={cn("flex flex-col gap-5", className)}>
            <div className="flex gap-10 justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold">{ job.Title }</h3>
                    <Link className="flex" href={`user/company/${job.CompanyId}`}><BriefcaseBusiness className="pr-1" size={25}></BriefcaseBusiness><h6 className="italic">{ job.Company }</h6></Link>
                    <h6 className="flex"><MapPin className="pr-1" size={25}></MapPin>{ job.Location } • { job.Extent }</h6>
                    <h6 className="flex"><Clock className="pr-1" size={25}></Clock>Last apply: {new Date(job.DateOfTermination).getDay()}/{new Date(job.DateOfTermination).getMonth()} - {new Date(job.DateOfTermination).getFullYear()}</h6>
                    <div className="flex gap-1 flex-wrap">
                        {job.Tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{ tag }</Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-end gap-2">
                    { children }
                </div>
            </div>

            <SeperatorHorizontal></SeperatorHorizontal>

            <div className="flex flex-col gap-1">
                <MarkdownFormatter markdown={job.Description}></MarkdownFormatter>
            </div>
        </div>
    );
}