CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE Companies (
    id CHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    logoId CHAR(36) NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE Users (
    id CHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    gender CHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    email TEXT NOT NULL,
    phone CHAR(10) NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Recruiter', 'User'))
);

CREATE TABLE Recruiters (
    id CHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    userId CHAR(12) NOT NULL,
    companyId CHAR(8) NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (companyId) REFERENCES Companies(id)
);

CREATE TABLE JobPostings (
    id CHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    companyId CHAR(8) NOT NULL,
    recruiterId CHAR(8) NOT NULL,
    dateOfTermination TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    extent TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL,
    FOREIGN KEY (companyId) REFERENCES Companies(id),
    FOREIGN KEY (recruiterId) REFERENCES Recruiters(id)
);

CREATE TABLE Applications (
    id CHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    userId CHAR(12) NOT NULL,
    jobId CHAR(10) NOT NULL,
    dateSent TIMESTAMP NOT NULL,
    censuredCV TEXT NOT NULL,
    cv TEXT NOT NULL,
    state TEXT NOT NULL CHECK (state IN ("Censured", "Viewed", "Uncensored", "Candidate")),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (jobId) REFERENCES JobPostings(id)
);