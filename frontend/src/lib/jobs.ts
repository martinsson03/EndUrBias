// lib/jobs.ts

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  extent: string;
}

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

// URL helper: /user/1 osv
export function jobApplyUrl(jobId: string) {
  return `/user/${jobId}`;
}
