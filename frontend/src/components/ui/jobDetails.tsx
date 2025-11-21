import JobViewModel from "@/lib/models/view/jobViewModel";
import { Card, CardDescription, CardFooter, CardHeader } from "../shadcn/ui/card";
import { Badge } from "../shadcn/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/shadcn/utils";

type JobDetailsProps = {
    job: JobViewModel,
    children?: React.ReactNode,
    className?: string
}

// A visual element on the page containing the job details.
export default function JobDetails({ job, children, className }: JobDetailsProps) {
    return (
        <div className={cn(className)}>
            <Card>
                <CardHeader>
                    <h5 className="font-bold">{ job.Title }</h5>
                    <CardDescription><Link href={`/company/${job.CompanyId}`}>{ job.Company }</Link></CardDescription>
                    <CardDescription>{ job.Location } • { job.Extent }</CardDescription>
                    <div className="flex gap-1 flex-wrap">
                        {job.Tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{ tag }</Badge>
                        ))}
                    </div>
                </CardHeader>

                <CardFooter>
                    <CardDescription>
                        { children }
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    );
}