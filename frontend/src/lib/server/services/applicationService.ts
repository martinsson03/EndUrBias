// User functions, on the server, that is related to applications. Contains the business logic.

import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import type { id } from "@/lib/models/shared/id";
import CensoredCVViewModel from "@/lib/models/view/censoredCVViewModel";
import CVViewModel from "@/lib/models/view/cvViewModel";
import { MakeSqlQuery } from "./databaseService";
import { ApplicationState } from "@/lib/models/shared/applicationState";
import { Application } from "@/lib/models/db/dbApplication";
import { CensorCV } from "./censorService";
import AnonymizeResponse from "@/lib/models/responses/anonymizeResponse";
import CvBase64 from "@/lib/models/shared/cv";
import CensoredCvBase64 from "@/lib/models/shared/censoredCv";

// Tries to format and submit an application to the database.
export async function SubmitApplication(request: ApplicationSubmitRequest, jobId: id, userId: id): Promise<boolean> {
    const anonymizedCv: AnonymizeResponse = await CensorCV(request);

    if (!anonymizedCv || typeof anonymizedCv.cvBase64 !== "string") return false;

    // Insert application into database.
    await MakeSqlQuery(`
        INSERT INTO Applications (
            userId,
            jobId,
            dateSent,
            censoredCv,
            cv,
            state
        ) VALUES (
            '${userId}',
            '${jobId}',
            NOW(),
            '${anonymizedCv.cvBase64}',
            '${request.CV}',
            '${ApplicationState.Censored}'
        );
    `);
    
    return true;
}

// Returns a censored cv from the specific job, if null, no cv exist. Fetches it from the database.
export async function GetCensoredApplication(jobId: id): Promise<CensoredCvBase64 | null> {
    const applications: Application[] | null = await MakeSqlQuery<Application>(`SELECT * FROM Applications WHERE jobId='${jobId}' AND state='${ApplicationState.Censored}'`);
    
    if (!applications) return null;

    const application: Application = applications[0];

    if (!application) return null;

    const cv: CensoredCvBase64 = {
        CensoredCV: application.censoredcv,
        id: application.id
    };

    return cv;
}

// Returns all uncensored applications from the specific job. Fetches them from the database.
export async function GetUncensoredApplications(jobId: id): Promise<CvBase64[]> {
    const applications: Application[] | null = await MakeSqlQuery<Application>(`SELECT  * FROM Applications WHERE jobId='${jobId}' AND state='${ApplicationState.Uncensored}'`);

    if (!applications) return [];

    const cvs: CvBase64[] = applications.map((app: Application): CvBase64 => { return { CV: app.cv, id: app.id } });

    return cvs;
}

// Returns all censored applications from the specific job that the recruiter has looked at already. Fetches them from the database.
export async function GetCensoredLookedAtApplications(jobId: id): Promise<CensoredCvBase64[]> {
    const applications: Application[] | null = await MakeSqlQuery<Application>(`SELECT  * FROM Applications WHERE jobId='${jobId}' AND state='${ApplicationState.Viewed}'`);

    if (!applications) return [];
    
    const cvs: CensoredCvBase64[] = applications.map((app: Application): CensoredCvBase64 => { return { CensoredCV: app.censoredcv, id: app.id } });
    
    return cvs;
}

// Returns all applications that are considered a candidate.
export async function GetCandidateApplications(jobId: id): Promise<CvBase64[]> {
    const applications: Application[] | null = await MakeSqlQuery<Application>(`SELECT  * FROM Applications WHERE jobId='${jobId}' AND state='${ApplicationState.Candidate}'`);

    if (!applications) return [];

    const cvs: CvBase64[] = applications.map((app: Application): CvBase64 => { return { CV: app.cv, id: app.id } });

    return cvs;
}

// Changes the application to the 4 different states depending on the current state and the requestRealCV parameter. Returns true if it worked.
export async function ChangeApplicationState(requestRealCV: boolean, applicationId: id): Promise<boolean> {
    const applications: Application[] | null = await MakeSqlQuery<Application>(`SELECT * FROM Applications WHERE id='${applicationId}'`);

    if (!applications) return false;

    const application: Application = applications[0];

    if (!application) return false;

    let newState: ApplicationState = ApplicationState.Censored;

    if (application.state === ApplicationState.Censored && requestRealCV) {
        newState = ApplicationState.Uncensored;
    }
    else if (application.state === ApplicationState.Censored && !requestRealCV) {
        newState = ApplicationState.Viewed;
    }
    else if (application.state === ApplicationState.Viewed) {
        newState = ApplicationState.Uncensored;
    }
    else if (application.state === ApplicationState.Uncensored) {
        newState = ApplicationState.Candidate;
    }
    else if (application.state === ApplicationState.Candidate) {
        newState = ApplicationState.Uncensored;
    }

    await MakeSqlQuery(`
        UPDATE Applications
        SET state = '${newState}'
        WHERE id = '${applicationId}';
    `);

    const apps: Application[] | null = await MakeSqlQuery<Application>(`SELECT * FROM Applications WHERE id = '${applicationId}'`);

    if (!apps) return false;

    const app: Application | null = apps[0];

    if (!app) return false;

    if (app.state !== newState) return false;

    return true;
}