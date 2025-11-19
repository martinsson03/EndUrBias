// app/user/page.tsx

import JobRedirectCard from "@/components/ui/jobRedirectCard";
import { getJobsForUser, jobApplyUrl } from "@/lib/jobs";

// Detta är sidan som visar användarens tillgängliga jobb.
// All data är just nu hårdkodad via getJobsForUser().
// Varje jobb visas som ett Card med en "Apply"-knapp som länkar vidare.

export default async function UserPage() {
  // Hämta alla jobb (mock-data)
  const jobs = await getJobsForUser();

  return (
    <main className="max-w-3xl mx-auto pt-8">
      {/* Sidtitel */}
      <h1 className="text-4xl font-bold mb-6 text-center">User jobs</h1>

      {/* Lista av jobb som användaren kan söka */}
      <div className="flex flex-col gap-6">
        {jobs.map((job) => (
          <JobRedirectCard
            key={job.id} // unikt id för React
            title={job.title} // jobbtitel
            company={job.company} // företag
            location={job.location} // ort
            extent={job.extent} // heltid/deltid
            applyUrl={jobApplyUrl(job.id)} // skapar rätt URL: /user/<jobId>
          />
        ))}
      </div>
    </main>
  );
}
