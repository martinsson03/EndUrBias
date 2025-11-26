import {Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import CensoredContent from "./censoredContent";
import CensoredCheckedContent from "./censoredCheckedContent";
import UncensoredContent from "./uncensoredContent";
import CandidateContent from "./candidateContent";
import JobViewModel from "@/lib/models/view/jobViewModel";

type TalentpoolPageContentProps = {
    job: JobViewModel
};

export default function TalentpoolPageContent({ job }: TalentpoolPageContentProps) {
    return (
        <div>
            <Tabs defaultValue="censored" className="pb-5">
                <TabsList>
                    <TabsTrigger value="censored">Censored</TabsTrigger>
                    <TabsTrigger value="censoredchecked">Censored & checked</TabsTrigger>
                    <TabsTrigger value="uncensored">Uncensored</TabsTrigger>
                    <TabsTrigger value="candidate">Candidate</TabsTrigger>
                </TabsList>

                <TabsContent value="censored">
                    <CensoredContent job={job}></CensoredContent>
                </TabsContent>
                <TabsContent value="censoredchecked">
                    <CensoredCheckedContent job={job}></CensoredCheckedContent>
                </TabsContent>
                <TabsContent value="uncensored">
                    <UncensoredContent job={job}></UncensoredContent>
                </TabsContent>
                <TabsContent value="candidate">
                    <CandidateContent job={job}></CandidateContent>
                </TabsContent>
            </Tabs>
        </div>
    );
}