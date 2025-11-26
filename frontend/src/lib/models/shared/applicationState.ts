// The state of which the application can be in (determined by the recruiter).
export enum ApplicationState {
    Censored = "Uncensored",                     // Stage 1 - First seen like this by the recruiter.
    CensoredButLookedAt = "CensoredButLookedAt", // Stage 2 - If the recruiter didn't think much of the CV in stage 1.
    Uncensored = "Uncensored",                   // Stage 3 - The recruiter wants to see the details of the person.
    Candidate = "Candidate"                      // Stage 4 - The recruiter thinks the application is a reasonable candidate for the job.
};