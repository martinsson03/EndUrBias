import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Link from "next/link";

export default async function JobView({ params }: { params: Promise<{ jobId: string }> }) {
    const unprocessed: number = 4
    const processed: number = 7
    const favorites: number = 1

    return(
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
                    <BreadcrumbSeparator></BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={`/recruiter/talentpool/${(await params).jobId}`}>Talentpool for job id: {(await params).jobId}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h5 className="text-secondary-foreground">Talents</h5>

            <Tabs defaultValue="unprocessed" className="w-full">
                <TabsList>
                    <TabsTrigger value="unprocessed">Unprocessed: {unprocessed}</TabsTrigger>
                    <TabsTrigger value="processed">Processed: {processed}</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites: {favorites}</TabsTrigger>
                </TabsList>
                <TabsContent value="unprocessed"></TabsContent>
                <TabsContent value="processed"></TabsContent>
                <TabsContent value="favorites"></TabsContent>
            </Tabs>
       </div>
    );
};