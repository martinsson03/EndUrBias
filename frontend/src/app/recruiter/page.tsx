"use client"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";

import { SeperatorVerticle } from "@/components/ui/seperator";

import { Button } from "@/components/ui/button";

interface job {
    title: string,
    organisation: string,
    description: string
};

export default function Recruiter() {
    const jobs: job[] = [
        {
            title: "Sustainable Resource Manager",
            organisation: "Valvi Tech",
            description: "Manage resources and save the world in teams of up to 100 people."
        },
        {
            title: "Grave Plunderer",
            organisation: "Valvi Tech",
            description: "A job that is often discouraged because of missunderstandings... come work for us make place for new people."
        }
    ];

    return (
        <div className="margin-responsive flex flex-col gap-5 mt-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator></BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/recruiter">Jobs</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h5 className="text-secondary-foreground">{jobs.length} jobs</h5>

            {
                jobs.map((job, index) => jobCard(job, index))
            }
       </div>
    );
};

function jobCard(job: job, index: number) {
    return (
        <Card className="flex flex-row p-3 pl-6 pr-6 items-center gap-5 justify-between" key={index}>
            <div className="flex flex-row gap-5 h-full items-center">
                <h5>{job.title}</h5>
                <SeperatorVerticle></SeperatorVerticle>
                <h5 className="text-secondary-foreground">{job.description}</h5>
            </div>
            <Link href={`/recruiter/talentpool/${index}`}><Button>View talentpool</Button></Link>
        </Card>
    );
};