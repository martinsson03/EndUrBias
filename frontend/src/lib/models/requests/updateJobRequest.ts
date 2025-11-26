/* 
    Used when the client wants to request to create or update an existing job. 
    All values that can are undefined in the request will be:
    - On creating a job --> become default values, ex: undefined string --> "".
    - On updating a job --> values that will be ignored when updating.
*/
export default interface UpdateJobRequest {
    DateOfTermination: Date     | undefined,
    Title:             string   | undefined,
    Location:          string   | undefined,
    Extent:            string   | undefined,
    Description:       string   | undefined,
    Tags:              string[] | undefined // If not null, will replace the old with these tags.
};