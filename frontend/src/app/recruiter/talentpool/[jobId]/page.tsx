"use server"

import NotFound from "@/app/not-found";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/shadcn/ui/breadcrumb";
import { PageContentContainer } from "@/components/ui/pageContentContainer";
import { GetJobById } from "@/lib/client/services/jobService";
import JobViewModel from "@/lib/models/view/jobViewModel";
import Link from "next/link";

type JobProps = {
    params: Promise<{ jobId: string }>
};

// The page showing the job details for a certain job, but as a recruiter.
export default async function Job({ params }: JobProps) {
    const job: JobViewModel | undefined = await GetJobById((await params).jobId);

    if (job === undefined) return NotFound();
    else return (
        <PageContentContainer className="flex flex-col gap-5 mt-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/recruiter">Talentpool</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/recruiter/talentpool/${job.id}`}>{job.Title}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </PageContentContainer>
    );
}