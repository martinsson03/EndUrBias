// When a user submits an application, this is the request made to the server.
export default interface ApplicationSubmitRequest {
    CV: string,
    Firstname: string,
    Lastname: string,
    Phonenumber: string,
    Mail: string
};