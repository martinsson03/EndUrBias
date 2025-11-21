// app/user/[jobId]/page.tsx

// Hämtar jobblistan (just nu hårdkodad)
import { getJobsForUser } from "@/lib/jobs";

// Klientkomponenten som innehåller själva ansökningsformuläret
import { ApplyFormClient } from "@/components/ui/applyFormClient";

// Next.js 404-funktion
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

// I Next.js 15/16 är params asynkrona → därför är det en Promise
interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  // Väntar på att få ut jobId från URL:en
  const { jobId } = await params;

  // Hämtar alla jobb och letar efter rätt jobb baserat på URL-parametern
  const jobs = await getJobsForUser();
  const job = jobs.find((j) => j.id === jobId);

  // Om jobbet inte finns → visa Next.js inbyggda 404-sida
  if (!job) {
    notFound();
  }

  return (
    <>
      {/* 
        BREADCRUMB 
        - ligger i full bredd
        - vänsterställd som recruitersidan
        - visar navigation: Home → User Jobs → aktuellt jobb
      */}
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

      {/* 
        SIDANS HUVUDINNEHÅLL 
        - centrerat som tidigare
        - visar jobbinformation + formulär
      */}
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

          {/* Klientkomponenten som skickar in ansökan */}
          <ApplyFormClient jobId={jobId} />
        </section>
      </main>
    </>
  );
}
