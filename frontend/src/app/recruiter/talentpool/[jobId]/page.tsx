"use server"

import TalentpoolPagePreContent from "@/components/page/recruiter/talentpool/ui/talentpoolPagePreContent";
import { id } from "@/lib/models/shared/id";

type JobProps = {
    params: Promise<{ jobId: string }>
};

// The page showing the job details for a certain job, but as a recruiter.
export default async function Job({ params }: JobProps) {
    const jobId: id = (await params).jobId;

    return (<TalentpoolPagePreContent jobId={jobId}></TalentpoolPagePreContent>);
}