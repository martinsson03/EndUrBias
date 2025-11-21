INSERT INTO Companies (name,id)
VALUES ('TechCorp', '00000001');

INSERT INTO RecreuterPostings (id, time, location, company, extent)
VALUES ('JOB0000001', NOW(), 'New York', 'TechCorp', '100');


INSERT INTO Applicants (
    idApp, firstName, lastName, gender,
    email, phone, cvBase64, idJob
)
VALUES (
    'APP000000001',
    'John',
    'Doe',
    'M',                            -- male
    'john.doe@example.com',
    '0123456789',
    'BASE64-CV-HERE',
    'Anon BASE64-CV-HERE',
    'JOB0000001'                    -- must match the job inserted above
);
