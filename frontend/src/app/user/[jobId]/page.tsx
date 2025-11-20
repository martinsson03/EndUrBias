// app/user/[jobId]/page.tsx

import { getJobsForUser } from "@/lib/jobs";
import { ApplyFormClient } from "@/components/ui/applyFormClient";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { jobId } = await params;

  const jobs = await getJobsForUser();
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    notFound();
  }

  return (
    <>
      {/* BREACRUMB – full width, vänsterställd precis som i recruitersidan */}
      <div className="margin-responsive flex flex-col gap-5 mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home */}
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            {/* User Jobs */}
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/user">User Jobs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            {/* Current job */}
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href={`/user/${job.id}`}>{job.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main content – centrerat som vanligt */}
      <main className="min-h-screen flex justify-center pt-12 px-4">
        <section className="w-full max-w-2xl space-y-8">
          <header className="text-center space-y-1">
            <h1 className="text-3xl font-semibold">{job.title}</h1>

            <p className="text-lg font-medium">{job.company}</p>

            <p className="text-sm text-muted-foreground">
              {job.location} · {job.extent}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Fill in your contact information to submit your application.
            </p>
          </header>

          <ApplyFormClient jobId={jobId} />
        </section>
      </main>
    </>
  );
}
