CREATE TABLE Companies (
    id CHAR(8) PRIMARY KEY,
    logoId CHAR(8),
    name TEXT,
    description TEXT
);

CREATE TABLE Users (
    id CHAR(12) PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    gender CHAR(1) CHECK (gender IN ('M','F')),
    email TEXT,
    phone CHAR(10),
    role TEXT CHECK (role IN ('recruiter','candidate','other'))
);

CREATE TABLE Recruiters (
    id CHAR(8) PRIMARY KEY,
    userId CHAR(12) NOT NULL,
    companyId CHAR(8) NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (companyId) REFERENCES Companies(id)
);

CREATE TABLE JobPostings (
    id CHAR(10) PRIMARY KEY,
    companyId CHAR(8) NOT NULL,
    recruiterId CHAR(8) NOT NULL,
    dateOfTermination TIMESTAMP NOT NULL,
    title TEXT,
    location TEXT,
    extent CHAR(3) DEFAULT '100',
    description TEXT,
    tags TEXT,
    FOREIGN KEY (companyId) REFERENCES Companies(id),
    FOREIGN KEY (recruiterId) REFERENCES Recruiters(id)
);

CREATE TABLE Applications (
    id CHAR(12) PRIMARY KEY,
    userId CHAR(12) NOT NULL,
    jobId CHAR(10) NOT NULL,
    dateSent TIMESTAMP NOT NULL,
    censuredCV TEXT,
    cv TEXT,
    state TEXT CHECK (state IN ()),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (jobId) REFERENCES JobPostings(id)
);
