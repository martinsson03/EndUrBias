import JobViewModel from "@/lib/models/view/jobViewModel";
import { Card, CardDescription, CardFooter, CardHeader } from "../shadcn/ui/card";
import { Badge } from "../shadcn/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/shadcn/utils";
import { MapPin, BriefcaseBusiness, Clock } from "lucide-react";

type JobDetailsProps = {
    job: JobViewModel,
    children?: React.ReactNode,
    className?: string
}

// A visual element on the page containing the job details.
export default function JobDetails({ job, children, className }: JobDetailsProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <h5 className="font-bold">{ job.Title }</h5>
                <CardDescription><Link href={`user/company/${job.CompanyId}`} className="italic flex"><BriefcaseBusiness className="pr-1" size={20}></BriefcaseBusiness>{ job.Company }</Link></CardDescription>
                <CardDescription className="flex"><MapPin className="pr-1" size={20}></MapPin>{ job.Location } • { job.Extent }</CardDescription>
                <CardDescription className="flex"><Clock className="pr-1" size={20}></Clock>Last apply: {new Date(job.DateOfTermination).getDay()}/{new Date(job.DateOfTermination).getMonth()} - {new Date(job.DateOfTermination).getFullYear()}</CardDescription>
                <div className="flex gap-1 flex-wrap">
                    {job.Tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{ tag }</Badge>
                    ))}
                </div>
            </CardHeader>

            <CardFooter>
                <CardDescription className="flex gap-2">
                    { children }
                </CardDescription>
            </CardFooter>
        </Card>
    );
}