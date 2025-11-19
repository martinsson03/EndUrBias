// lib/jobs.ts

// Typdefinition som beskriver ett jobbobjekt i systemet.
// Den används både av UI-komponenter och av serverkomponenter.
export interface Job {
  id: string;        // unikt ID som matchar URL-parametern /user/[jobId]
  title: string;     // jobbtitel
  company: string;   // arbetsgivare
  location: string;  // stad
  extent: string;    // heltid / deltid
}

// Hämtar alla tillgängliga jobb för användaren.
// Just nu returnerar den hårdkodad mock-data, men i framtiden kan den
// enkelt bytas ut mot en riktig databas eller API.
export async function getJobsForUser(): Promise<Job[]> {
  return [
    {
      id: "1",
      title: "IT-arkitekt",
      company: "Granitor Electro AB",
      location: "Göteborg",
      extent: "Heltid",
    },
    {
      id: "2",
      title: "IT-konsult",
      company: "Kynningsrud IT AB",
      location: "Göteborg",
      extent: "Heltid",
    },
    {
      id: "3",
      title: "Language Teacher – AI Trainer",
      company: "DataAnnotation",
      location: "Kungälv",
      extent: "Deltid",
    },
    {
      id: "4",
      title: "Backend Developer",
      company: "Spotify",
      location: "Stockholm",
      extent: "Heltid",
    },
    {
      id: "5",
      title: "Junior Data Engineer",
      company: "Volvo Group",
      location: "Göteborg",
      extent: "Heltid",
    },
  ];
}

// Hjälpfunktion för att generera korrekt URL till ansökningssidan.
// Gör att UI-komponenter slipper hårdkoda paths.
export function jobApplyUrl(jobId: string) {
  return `/user/${jobId}`;
}
