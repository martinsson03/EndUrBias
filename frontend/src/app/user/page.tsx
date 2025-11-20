import JobRedirectCard from "@/components/ui/jobRedirectCard";
import { getJobsForUser, jobApplyUrl } from "@/lib/jobs";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function UserPage() {
  const jobs = await getJobsForUser();

  return (
    <>
      {/* Breadcrumb – full width, vänsterställd */}
      <div className="margin-responsive flex flex-col gap-5 mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>User Jobs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Själva contentet är fortfarande centrerat */}
      <main className="max-w-3xl mx-auto pt-4">
        <h1 className="text-4xl font-bold mb-6 text-center">User jobs</h1>

        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobRedirectCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              extent={job.extent}
              applyUrl={jobApplyUrl(job.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
