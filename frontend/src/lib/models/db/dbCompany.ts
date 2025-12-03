import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";

// The company data object that exist in the database.
export default interface Company extends IdentifiableObject {
    name: string,        // Name of company.
    logoid: id,          // Id of the logo associated with the company.
    description: string  // Text explaining what the company does etc.
};