"use client"

import { UseDialog } from "@/components/dialogProvider";
import { Button } from "@/components/shadcn/ui/button";
import { Card } from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import PaginatedContainer from "@/components/ui/paginatedContainer";
import { ChangeApplicationState, GetCandidateApplications } from "@/lib/client/services/applicationService";
import CVViewModel from "@/lib/models/view/cvViewModel";
import JobViewModel from "@/lib/models/view/jobViewModel";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

type CandidateContentProps = {
    job: JobViewModel
};

export default function CandidateContent({ job }: CandidateContentProps) {
    const [applications, setApplications] = useState<CVViewModel[] | null>(null);

    
    useEffect(() => {
        async function fetchApplications() {
            const data = await GetCandidateApplications(job.id);
            setApplications(data);
        }

        fetchApplications();
    }, [job.id]);

    const { openDialog, closeDialog } = UseDialog();

    function cvDialog(application: CVViewModel) {
        return (
            <div className="flex flex-col gap-4 pt-4">
                <div className="flex justify-center items-center gap-3">
                    <h6 className="text-secondary-foreground">Identifier:</h6>
                    <Input disabled={true} className="w-100 text-center" value={application.id}></Input>
                    <Button variant="outline" size="icon"><Edit></Edit></Button>
                </div>

                { /* CV HERE */ }

                <div className="flex gap-2">
                    <Button onClick={async () => { let success = await ChangeApplicationState(false, application.id); success && closeDialog(); }}>Remove candidate</Button>
                </div>
            </div>
        );
    }

    return (
        <PaginatedContainer columns={5}>
            { applications && applications.map((app, i) => (
                <Card key={i} className="hover:cursor-pointer p-2" onClick={() => openDialog("", "", cvDialog(app))}>
                    <p className="text-center">{ app.id }</p>
                </Card>
            ))}
        </PaginatedContainer>
    );
}