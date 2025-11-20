import type { id } from "../shared/id";
import IdentifiableObject from "../shared/identifiableObject";

// The company data object that exist in the database.
export default interface dbCompany extends IdentifiableObject {
    Name: string,        // Name of company.
    CompanyLogoId: id,   // Id of the logo associated with the company.
    Description: string, // Text explaining what the company does etc.
    Jobs: id[]           // A list of jobs that are out on the market by this company.
};