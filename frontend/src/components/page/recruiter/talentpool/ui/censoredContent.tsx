"use client"

import { ChangeApplicationState, GetCensoredApplication } from "@/lib/client/services/applicationService";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import JobViewModel from "@/lib/models/view/jobViewModel";
import CensoredCv from "./censoredCv";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

type CensoredContentProps = {
    job: JobViewModel
};

export default function CensoredContent({ job }: CensoredContentProps) {
    const [cv, setCv] = useState<CensoredCVViewModel | null>();

    useEffect(() => {
        async function loadCv() {
            const data = await GetCensoredApplication(job.id);
            setCv(data);
        }

        loadCv();
    }, [job.id]);

    return (
        <div>
            { cv && (            
                <div className="flex flex-col gap-4 pt-4 w-full">
                    <div className="flex justify-center items-center gap-3">
                        <h6 className="text-secondary-foreground">Identifier:</h6>
                        <Input disabled={true} className="w-100 text-center" value={cv.id}></Input>
                        <Button variant="outline" size="icon"><Edit></Edit></Button>
                    </div>

                    <CensoredCv cv={cv.CensoredCV}></CensoredCv>

                    <div className="flex gap-2">
                        <Button onClick={async () => { await ChangeApplicationState(false, cv.id); setCv(await GetCensoredApplication(job.id)); }}>Next CV</Button>
                        <Button onClick={async () => { await ChangeApplicationState(true, cv.id); setCv(await GetCensoredApplication(job.id)); }}>Request real CV</Button>
                    </div>
                </div>
            ) }

            { !cv && (<p className="pt-4 text-center text-secondary-foreground">No applications left to review!</p>) }
        </div>
    );
}