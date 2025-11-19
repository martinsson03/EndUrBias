// app\user\[jobId]\page.tsx

// Hämtar hårdkodade jobb för användaren (i detta skede agerar det som vår "databas")
import { getJobsForUser } from "@/lib/jobs";

// Klientkomponenten som innehåller själva ansökningsformuläret
import { ApplyFormClient } from "@/components/ui/applyFormClient";

// Next.js-hjälpfunktion för att returnera en 404-sida från en serverkomponent
import { notFound } from "next/navigation";

// Typ för props som Next.js skickar in till sidan.
// I Next 16 är `params` en Promise som måste "awaitas" innan vi kan läsa värdena.
interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

// Serverkomponent för sidan /user/[jobId]
// Ansvarar för att:
// 1) läsa jobId från URL:en
// 2) hämta alla jobb
// 3) slå upp rätt jobb
// 4) visa 404 om jobbet saknas
// 5) rendera formuläret för att söka jobbet
export default async function ApplyPage({ params }: ApplyPageProps) {
  // Väntar in params-promisen för att få ut det riktiga jobId-värdet från URL:en.
  const { jobId } = await params;

  // Hämtar alla jobb (just nu hårdkodat, men kan bytas mot API/databas senare).
  const jobs = await getJobsForUser();

  // Debug-loggar som hjälper vid utveckling. Kan tas bort i produktion.
  console.log("ApplyPage jobId:", jobId);
  console.log(
    "Available job ids:",
    jobs.map((j) => j.id)
  );

  // Försöker hitta det jobb som matchar jobId i URL:en.
  const job = jobs.find((j) => j.id === jobId);

  // Om inget jobb hittas för det angivna jobId → visa Next.js standard-404.
  if (!job) {
    notFound();
  }

  // Om vi kommer hit har vi ett giltigt jobbobjekt och kan rendera sidan.
  return (
    <main className="min-h-screen flex justify-center pt-12 px-4">
      <section className="w-full max-w-2xl space-y-8">
        {/* Sidhuvud med information om vilket jobb användaren ansöker till */}
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

        {/* Klientkomponenten som hanterar formuläret och submit-logiken.
            Vi skickar med jobId så att backend vet vilket jobb ansökan gäller. */}
        <ApplyFormClient jobId={jobId} />
      </section>
    </main>
  );
}
