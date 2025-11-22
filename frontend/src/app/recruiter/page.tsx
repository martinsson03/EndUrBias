import RecruiterPageContent from "@/components/page/recruiter/ui/recruiterPageContent";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/shadcn/ui/breadcrumb";
import { PageContentContainer } from "@/components/ui/pageContentContainer";
import Link from "next/link";

export default function User() {
    return(
        <PageContentContainer className="flex flex-col gap-5 mt-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/recruiter">Jobs</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <RecruiterPageContent></RecruiterPageContent>
        </PageContentContainer>
    );
}