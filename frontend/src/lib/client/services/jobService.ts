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

// Returns all details of a job by an id.
export async function GetJobById(jobId: id): Promise<JobViewModel | null> {
    const jobTemp: JobViewModel = {
        id: "514142",
        Title: "Grave plunderer - free loot",
        Company: "Plunder AB",
        CompanyId: "41233",
        Location: "Gothenburg",
        Extent: "Full-time",
        Description: "## Position: Grave Plunderer – Free Loot (Fictional Role in a Fantasy Universe) \n\nA courageous adventurer is invited to join Plunder AB as a full-time Grave Plunderer in a fantasy setting, exploring atmospheric cemeteries, ancient ruins, and forgotten crypts in Gothenburg to recover magical relics, historical artifacts, and academic curiosities while working under the scorching sun and navigating dusty landscapes. \n\n## Responsibilities \n\nRetrieve enchanted or historically valuable items, decode mystical puzzles, deactivate ancient traps, document findings in the company’s digital grimoire, collaborate with mages, cryptographers, and archaeologists, and maintain respectful conduct toward the lore and spirits tied to each site. \n\n## Working Conditions \nExpect heat, tight tunnels, dim chambers, occasional spectral guardians, and the thrill of uncovering secrets unseen for centuries. \n## Required Skills \nStrong problem-solving abilities, stamina, a fascination with fantasy history and runes, respect for fictional spirits and traditions, and the ability to distinguish cursed relics from harmless ones. \n## Why Join Plunder AB \nGain access to legendary tools, immersive narrative environments, supportive and eccentric colleagues, opportunities for glory and loot bonuses, and the excitement of contributing to the magical knowledge of the realm.",
        Tags: ["Hot", "Up-and-coming", "Grave", "Cemetary"],
        DateOfTermination: new Date()
    }

    return jobTemp;

    throw new Error("Not implemented!");
}

// Get jobs created by the specific recruiter. User has to be a recruiter for this to return anything!
export async function GetJobsCreatedByRecruiter(userId: id): Promise<JobViewModel[]> {
    const jobsTemp: JobViewModel[] = [
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