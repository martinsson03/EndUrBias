"use client"

import NotFound from "@/app/not-found";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/shadcn/ui/breadcrumb";
import { PageContentContainer } from "@/components/ui/pageContentContainer";
import { GetJobById } from "@/lib/client/services/jobService";
import JobViewModel from "@/lib/models/view/jobViewModel";
import Link from "next/link";
import { useEffect, useState } from "react";
import JobPageContent from "./jobPageContent";

type JobPagePreContentProps = {
    jobId: string
};

export default function JobPagePreContent({ jobId }: JobPagePreContentProps) {
    const [job, setJob] = useState<JobViewModel | null>(null);

    useEffect(() =>
        {
            async function getJob() {
                const job = await GetJobById(jobId);

                setJob(job);
            }

            getJob();
        }, []
    );

    if (!job) return NotFound();
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
                            <Link href="/user">Jobs</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/user/job/${job.id}`}>{job.Title}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <JobPageContent job={job}></JobPageContent>
        </PageContentContainer>
    );
}