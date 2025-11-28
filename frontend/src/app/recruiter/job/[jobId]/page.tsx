"use server"

import JobPagePreContent from "@/components/page/recruiter/job/ui/jobPagePreContent";
import { id } from "@/lib/models/shared/id";

type JobProps = {
    params: Promise<{ jobId: id }>
};

// The page showing the job details for a certain job, but as a recruiter.
export default async function Job({ params }: JobProps) {
    const jobId: id = (await params).jobId;

    return (<JobPagePreContent jobId={jobId}></JobPagePreContent>)
}