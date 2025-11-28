import type { UserRole } from "../shared/userRole";
import IdentifiableObject from "../shared/identifiableObject";
import { UserSex } from "../shared/userSex";

// As seen in the database. The core data object representing any user on the app.
export default interface User extends IdentifiableObject {
    FirstName: string,
    LastName: string,
    Gender: UserSex,
    Mail: string,
    Phonenumber: string,
    Role: UserRole
};