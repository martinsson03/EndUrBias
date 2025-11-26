import IdentifiableObject from "../shared/identifiableObject";

// The only thing the recruiter will be able to see of a censored CV.
export default interface CensoredCVViewModel extends IdentifiableObject {
    CensoredCV: string
};