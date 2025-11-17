import JobRedirectCard from "@/components/ui/jobRedirectCard";
import { getJobsForUser, jobApplyUrl } from "@/lib/jobs";

export default async function UserPage() {
  const jobs = await getJobsForUser();

  return (
    <main className="max-w-3xl mx-auto pt-8">
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
  );
}
