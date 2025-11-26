// User functions, on the client, that is related to applications.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import type { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import CVViewModel from "@/lib/models/view/cvViewModel";

// Tries to submit an application and returns true if it was possible. Called by the user.
export async function SubmitApplication(request: ApplicationSubmitRequest, jobId: id): Promise<boolean> {
    throw new Error("Not implemented!");
}

// Returns a censored cv from the specific job, if null, no cv exist. The user has to be a recruiter.
export async function GetCensoredApplication(jobId: id): Promise<CensoredCVViewModel | undefined> {
    const cv: CensoredCVViewModel = {
        CensoredCV: "# Johnathan Reed\nNew York, USA · +1 555-392-8844 · john.reed@example.com · https://linkedin.com/in/johnreed · https://github.com/jreed-dev\n\n## Professional Summary\nSenior Full-Stack Engineer with 8+ years of experience designing, developing, and maintaining high-performance web applications. Strong background in TypeScript, React, Node.js, and cloud infrastructure. Proven track record of improving system reliability, increasing development velocity, and leading cross-functional teams. Passionate about clean architecture, developer experience, and building scalable systems.\n\n## Key Skills\n- Technical: TypeScript, React, Node.js, PostgreSQL, Redis, Docker\n- Tools & Frameworks: Next.js, Express, Prisma, AWS, Kubernetes\n- Languages: JavaScript, TypeScript, Python\n- Others: Leadership, Agile, CI/CD, System Design, Test Automation\n\n## Experience\n### Senior Full-Stack Engineer — Aurora Tech Solutions, Remote\n*2019 – Present*\n- Led the development of a real-time analytics dashboard used by over 50k monthly users.\n- Designed a microservice architecture that reduced API latency by 42%.\n- Mentored 6 junior developers and introduced a CI pipeline that cut deployment time in half.\n- Collaborated with product and design teams to deliver features that increased customer retention by 18%.\n\n### Full-Stack Engineer — Silverline Systems, New York, NY\n*2016 – 2019*\n- Built internal tools that automated reporting processes, reducing manual workload by 70%.\n- Modernized legacy codebases by migrating to React and TypeScript.\n- Created automated test suites, increasing test coverage from 12% to 78%.\n\n### Software Engineer — Brightwave Digital, Boston, MA\n*2014 – 2016*\n- Developed marketing automation features used by enterprise clients.\n- Improved backend performance, allowing the system to handle 3x more concurrent users.\n- Refactored monolithic modules to improve maintainability for the engineering team.\n\n## Selected Projects\n- **Atlas Metrics Dashboard** — Full-stack analytics tool for IoT devices; tech: Next.js, Node.js, PostgreSQL.\n- **Nebula Cloud Sync** — Cross-platform file syncing application with end-to-end encryption.\n- **TraceFlow** — CLI developer productivity toolkit; 10k+ monthly downloads on npm.\n\n## Education\n**B.S. in Computer Science** — Boston University, Boston, MA\\n2014\n- Relevant coursework: Operating Systems, Databases, Distributed Systems\n\n## Certifications & Training\n- AWS Certified Developer — AWS — 2021\n- System Design Interview Prep — Educative — 2020\n\n## Volunteer & Leadership\n- Volunteer Developer, Open Source Ecology — built tools for community farming automation.\n- Mentor, CodePath — guided students through full-stack engineering projects.\n\n## Publications & Talks\n- “Scaling React Applications in 2024” — JSConf North America, 2023.\n\n## Languages\n- English — Native\n- Spanish — Professional proficiency\n\n## Interests\n- Rock climbing, chess, 3D printing, traveling\n\n---\nReferences available on request.",
        id: "512351"
    };

    return cv;

    throw new Error("Not implemented!");
}

// Returns all uncensored applications from the specific job if the user is a recruiter.
export async function GetUncensoredApplications(jobId: id): Promise<CVViewModel[]> {
    const cv: CVViewModel[] = [
        {
            CV: "PDF FORMAT",
            id: "515123"
        },
        {
            CV: "PDF FORMAT",
            id: "612323"
        }
    ];

    return cv;

    throw new Error("Not implemented!");
}

// Returns all censored applications from the specific job that the recruiter has looked at already. If the user is a recruiter.
export async function GetCensoredLookedAtApplications(jobId: id): Promise<CensoredCVViewModel[]> {
    const cv: CensoredCVViewModel[] = [
        {
            CensoredCV: "# AAAA  \n bBAFAF",
            id: "515123"
        },
        {
            CensoredCV: "# D3123  \n goggjf",
            id: "612323"
        }
    ];

    return cv;

    throw new Error("Not implemented!");
}

// Returns all applications that are considered a candidate.
export async function GetCandidateApplications(jobId: id): Promise<CVViewModel[]> {
    const cv: CVViewModel[] = [
        {
            CV: "PDF FORMAT",
            id: "515123"
        },
        {
            CV: "PDF FORMAT",
            id: "612323"
        }
    ];

    return cv;

    throw new Error("Not implemented!");
}

// Changes the application to the 4 different states depending on the current state and the requestRealCV parameter. Returns true if it worked.
export async function ChangeApplicationState(requestRealCV: boolean, applicationId: id): Promise<boolean> {
    return true;

    throw new Error("Not implemented!");
}