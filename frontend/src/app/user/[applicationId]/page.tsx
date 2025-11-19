import { getJobsForUser } from "@/lib/jobs";
import { ApplyFormClient } from "@/components/ui/apply-form-client";
import { notFound } from "next/navigation";

export default async function ApplyPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const jobs = await getJobsForUser();
  const job = jobs.find(async (j) => j.id === (await params).applicationId);

  // if (!job) {
  //  notFound(); // visar 404-sidan men är buggad
  // }

  return (
    <main className="min-h-screen flex justify-center pt-12 px-4">
      <section className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-semibold">
            {job ? job.title : "Job application"}
          </h1>

          {job && <p className="text-lg font-medium">{job.company}</p>}

          {job && (
            <p className="text-sm text-muted-foreground">
              {job.location} · {job.extent}
            </p>
          )}

          <p className="text-sm text-muted-foreground mt-1">
            Fill in your contact information to submit your application.
          </p>
        </header>

        <ApplyFormClient />
      </section>
    </main>
  );
}
