
CREATE OR REPLACE VIEW Jobdetails AS
SELECT jp.dateOfTermination, jp.title, jp.location, jp.extent, jp.description, jp.tags
FROM JobPostings;

CREATE OR REPLACE VIEW JobviewModel AS
SELECT * 
FROM Jobdetails;
