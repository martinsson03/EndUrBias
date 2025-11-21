// User functions, on the client, that is related to jobs.

import UpdateJobRequest from "@/lib/models/requests/updateJobRequest";
import type { id } from "@/lib/models/shared/id";
import JobViewModel from "@/lib/models/view/jobViewModel";

// Returns all avaibles jobs that exist on the market right now.
export async function GetAvaibleJobs(): Promise<JobViewModel[]> {
    const jobsTemp: JobViewModel[] = [
        {
            id: "514142",
            Title: "Grave plunderer - free loot",
            Company: "Plunder AB",
            CompanyId: "41233",
            Location: "Gothenburg",
            Extent: "Full-time",
            Description: "Plunder the dead in the scorching sun.",
            Tags: ["Hot", "Up-and-coming", "Grave", "Cemetary"],
            DateOfTermination: new Date()
        },
        {
            id: "514143",
            Title: "Dungeon Torch Bearer",
            Company: "DeepDark Ltd",
            CompanyId: "62891",
            Location: "Stockholm",
            Extent: "Part-time",
            Description: "Hold torches for adventurers exploring extremely damp corridors.",
            Tags: ["Entry-level", "Adventuring", "Fire Safety"],
            DateOfTermination: new Date()
        },
        {
            id: "514144",
            Title: "Dragon Egg Polisher",
            Company: "Mythical Care AB",
            CompanyId: "73522",
            Location: "Uppsala",
            Extent: "Full-time",
            Description: "Ensure dragon eggs are spotless and warm for optimal hatching conditions.",
            Tags: ["Fantasy", "Animal Care", "High Risk"],
            DateOfTermination: new Date()
        },
        {
            id: "514145",
            Title: "Cloud Sculptor",
            Company: "SkyWorks",
            CompanyId: "98123",
            Location: "Malmö",
            Extent: "Contract",
            Description: "Shape clouds into pleasant forms for local weather broadcasts.",
            Tags: ["Creative", "Outdoor", "Weather"],
            DateOfTermination: new Date()
        },
        {
            id: "514146",
            Title: "Goblin Negotiator",
            Company: "Peacekeepers Guild",
            CompanyId: "55321",
            Location: "Gothenburg",
            Extent: "Full-time",
            Description: "Mediate disputes between local goblin tribes and city residents.",
            Tags: ["Diplomacy", "Fantasy", "Negotiation"],
            DateOfTermination: new Date()
        },
        {
            id: "514147",
            Title: "Time-Travel Tour Guide",
            Company: "ChronoTrips",
            CompanyId: "47110",
            Location: "Stockholm",
            Extent: "Part-time",
            Description: "Guide customers safely through various centuries and prevent historical paradoxes.",
            Tags: ["History", "Adventure", "Travel"],
            DateOfTermination: new Date()
        }
    ];

    return jobsTemp;

    throw new Error("Not implemented!");
}

// A recruiter can create a job using the parameters. Returns true if success.
export async function CreateNewJob(details: UpdateJobRequest): Promise<boolean> {
    throw new Error("Not implemented!");
}

// A recruiter can update a job using the parameters. Returns true if success.
export async function UpdateExistingJob(details: UpdateJobRequest): Promise<boolean> {
    throw new Error("Not implemented!");
}

// A recruiter can remove a job by id. Returns true if success.
export async function RemoveExistingJob(jobId: id): Promise<boolean> {
    throw new Error("Not implemented!");
}