import IdentifiableObject from "../shared/identifiableObject";

// The response body when requesting censoring of cv.
export default interface AnonymizeResponse extends IdentifiableObject {
    cv: string
}