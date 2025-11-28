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
    state TEXT NOT NULL CHECK (state IN ('Censured', 'Viewed', 'Uncensored', 'Candidate')),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (jobId) REFERENCES JobPostings(id)
);

INSERT INTO Companies (logoId, name, description) VALUES
('logo1', 'TechCorp', 'A leading technology company specializing in innovative solutions.'),
('logo2', 'HealthPlus', 'Committed to providing quality healthcare services worldwide.'),
('logo3', 'EcoBuild', 'Pioneers in sustainable construction and green building practices.');

INSERT INTO Users (firstName, lastName, gender, email, phone, role) VALUES
('Alice', 'Smith', 'Female', 'alice.smith@example.com', '1234567890', 'User'),
('Bob', 'Johnson', 'Male ', 'bob.johnson@example.com', '0987654321', 'Recruiter');
('Carol', 'Davis', 'Female', 'carol.davis@example.com', '1122334455', 'User');

INSERT INTO Users (id,firstName, lastName, gender, email, phone, role) VALUES
('666','David', 'Wilson', 'Male', 'david.wilson@example.com', '2233445566', 'User');

INSERT INTO Recruiters (userId, companyId) VALUES
((SELECT id FROM Users WHERE firstName='David' AND lastName='Wilson'), (SELECT id FROM Companies WHERE name='TechCorp'));

INSERT INTO JobPostings (companyId, recruiterId, dateOfTermination, title, location, extent, description, tags) VALUES
((SELECT id FROM Companies WHERE name='TechCorp'), (SELECT id FROM Recruiters WHERE userId=(SELECT id FROM Users WHERE firstName='David' AND lastName='Wilson')), '2026-12-31', 'Software Engineer', 'New York, NY', 'Full-time', 'Develop and maintain software applications.', 'software,engineering,full-time'),
((SELECT id FROM Companies WHERE name='HealthPlus'), (SELECT id FROM Recruiters WHERE userId=(SELECT id FROM Users WHERE firstName='Bob' AND lastName='Johnson')), '2026-11-30', 'Nurse Practitioner', 'Los Angeles, CA', 'Part-time', 'Provide healthcare services to patients.', 'healthcare,nursing,part-time');