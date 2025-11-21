import JobViewModel from "@/lib/models/view/jobViewModel";
import { Card, CardDescription, CardFooter, CardHeader } from "../shadcn/ui/card";
import { Badge } from "../shadcn/ui/badge";
import Link from "next/link";
import { Button } from "../shadcn/ui/button";

// A visual element on the page containing the job details.
export default function JobDetails(job: JobViewModel) {
    return (
        <div>
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
                        <Link href={`/job/${job.id}`}><Button>Learn more!</Button></Link>
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    );
}