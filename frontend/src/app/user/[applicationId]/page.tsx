import { getJobsForUser } from "@/lib/jobs";
import { ApplyFormClient } from "@/components/ui/apply-form-client";

interface ApplyPageProps {
  params: { applicationId: string };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const jobs = await getJobsForUser();
  const job = jobs.find((j) => j.id === params.applicationId);

  return (
    <main className="min-h-screen flex justify-center pt-12 px-4">
      <section className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">
            {job ? `Apply for ${job.title}` : "Apply for this job"}
          </h1>

          {job && (
            <p className="text-sm text-muted-foreground">
              {job.company} · {job.location} · {job.extent}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Fill in your contact information to submit your application.
          </p>
        </header>

        <ApplyFormClient />
      </section>
    </main>
  );
}
