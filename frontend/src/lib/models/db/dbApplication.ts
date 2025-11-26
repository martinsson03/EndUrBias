import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";
import type { ApplicationState } from "../shared/applicationState";

// Application as seen in the application table.
export interface Application extends IdentifiableObject {
    UserId: id,             // Id of the user that submitted the application.
    JobId: id,              // The job the user submitted to.
    DateSent: Date,         // The date of which the application was submitted.
    CensoredCV: string,     // The censored CV, stripped of all defining details.
    OriginalCV: string,     // Contains the original CV, not modified at all (submitted CV).
    State: ApplicationState // The state of which the application is currently in.
};