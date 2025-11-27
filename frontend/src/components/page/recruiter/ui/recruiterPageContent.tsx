"use client"

import PaginatedContainer from "@/components/ui/paginatedContainer";
import { GetJobsCreatedByRecruiter } from "@/lib/client/services/jobService";
import JobDetailsRecruiter from "./jobDetailsRecruiter";
import { useEffect, useState } from "react";
import JobViewModel from "@/lib/models/view/jobViewModel";

export default function RecruiterPageContent() {
    const [jobs, setJobs] = useState<JobViewModel[]>([]);

    useEffect(() => {
        async function getJobs() {
            const objects = await GetJobsCreatedByRecruiter("666");

            setJobs(objects);
        }

        getJobs();
    }, []);

    return (
        <div className="flex flex-col gap-10">
            <PaginatedContainer label="Jobs listed by you:">
                { jobs.map((job, i) =>
                    <JobDetailsRecruiter key={i} job={job}></JobDetailsRecruiter>
                )}
            </PaginatedContainer>
        </div>
    );
}