import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";
import type { ApplicationState } from "../shared/applicationState";

// Application as seen in the application table.
export interface Application extends IdentifiableObject {
    userid: id,             // Id of the user that submitted the application.
    jobid: id,              // The job the user submitted to.
    datesent: Date,         // The date of which the application was submitted.
    censoredcv: string,     // The censored CV, stripped of all defining details.
    cv: string,             // Contains the original CV, not modified at all (submitted CV).
    uncensored_by: string,     // The censored CV, stripped of all defining details.
    state: ApplicationState, // The state of which the application is currently in.

};