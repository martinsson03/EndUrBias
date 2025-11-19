// app/user/[jobId]/page.tsx

import { getJobsForUser } from "@/lib/jobs";
import { ApplyFormClient } from "@/components/ui/applyFormClient";
import { notFound } from "next/navigation";

// Next.js 16: params är en Promise som måste awaitas.
interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  // Hämta jobId från URL:en
  const { jobId } = await params;

  // Hämta alla jobb (mockad datakälla i detta projekt)
  const jobs = await getJobsForUser();

  // Leta upp jobbet baserat på jobId
  const job = jobs.find((j) => j.id === jobId);

  // Saknas jobbet → visa 404
  if (!job) notFound();

  return (
    <main className="min-h-screen flex justify-center pt-12 px-4">
      <section className="w-full max-w-2xl space-y-8">
        {/* Jobbinformation */}
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

        {/* Klientformulär – skickar med jobId så backend vet vilket jobb ansökan gäller */}
        <ApplyFormClient jobId={jobId} />
      </section>
    </main>
  );
}
