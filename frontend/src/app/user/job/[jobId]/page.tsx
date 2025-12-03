"use server"

import JobPagePreContent from "@/components/page/user/job/ui/jobPagePreContent";

type JobProps = {
    params: Promise<{ jobId: string }>
};

// The page showing the job details for a certain job.
export default async function Job({ params }: JobProps) {
    const jobId: string = (await params).jobId;

    return (<JobPagePreContent jobId={jobId}></JobPagePreContent>);
}