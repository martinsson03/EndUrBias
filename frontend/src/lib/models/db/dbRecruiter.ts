import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";

// Recruiter as seen in the recruiter table.
export default interface Recruiter extends IdentifiableObject {
    UserId: id,   // Foreign key mapping this recruiter to the correct user.
    CompanyId: id // Foreign key mapping this recruiter to the correct company.
};