import IdentifiableObject from "../shared/identifiableObject";

// The only thing the recruiter will be able to see of a requested full CV.
export default interface CVViewModel extends IdentifiableObject {
    CV: string
};