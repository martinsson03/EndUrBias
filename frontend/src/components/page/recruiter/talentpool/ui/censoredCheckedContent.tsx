"use client"

import { UseDialog } from "@/components/dialogProvider";
import { Button } from "@/components/shadcn/ui/button";
import { Card } from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import PaginatedContainer from "@/components/ui/paginatedContainer";
import { ChangeApplicationState, GetCensoredLookedAtApplications } from "@/lib/client/services/applicationService";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import CensoredCv from "./censoredCv";

type CensoredCheckedContentProps = {
    job: JobViewModel
};

export default function CensoredCheckedContent({ job }: CensoredCheckedContentProps) {
    const [applications, setApplications] = useState<CensoredCVViewModel[] | null>(null);

    
    useEffect(() => {
        async function fetchApplications() {
            const data = await GetCensoredLookedAtApplications(job.id);
            setApplications(data);
        }

        fetchApplications();
    }, [job.id]);

    const { openDialog, closeDialog } = UseDialog();

    function cvDialog(application: CensoredCVViewModel) {
        return (
            <div className="flex flex-col gap-4 pt-4 overflow-y-auto w-full">
                <div className="flex justify-center items-center gap-3">
                    <h6 className="text-secondary-foreground">Identifier:</h6>
                    <Input disabled={true} className="w-100 text-center" value={application.id}></Input>
                    <Button variant="outline" size="icon"><Edit></Edit></Button>
                </div>

                <CensoredCv cv={application.CensoredCV}></CensoredCv>

                <div className="flex gap-2">
                    <Button onClick={async () => { let success = await ChangeApplicationState(false, application.id); if(success) { setApplications(prev => prev ? prev.filter(a => a.id !== application.id) : null); closeDialog(); } }}>Request real CV</Button>
                </div>
            </div>
        );
    }
    
    return (
        <PaginatedContainer columns={5}>
            { applications && applications.length > 0 && applications.map((app, i) => (
                <Card key={i} className="hover:cursor-pointer p-2" onClick={() => openDialog("", "", cvDialog(app), "60%", "100%")}>
                    <p className="text-center">{ app.id }</p>
                </Card>
            ))}
        </PaginatedContainer>
    );
}