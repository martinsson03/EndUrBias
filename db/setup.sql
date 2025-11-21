-- Command to run this file (modify this if needed):
-- psql -f runsetup.sql i.e the whole path to the file example below [location psql.exe] -f [location of this file] [server]
-- &"C:\Program Files\PostgreSQL\16\bin\psql.exe" -f "C:\Users\kph\Chalmers datateknik\datateknik3\databas\task1\runsetup.sql" postgresql://postgres:postgres@127.0.0.1
 

-- This script deletes everything in your database
-- this is the only part of the script you do not need to understand
\set QUIET true
SET client_min_messages TO WARNING; -- Less talk please.
-- This script deletes everything in your database
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO CURRENT_USER;
-- This line makes psql stop on the first error it encounters
-- You may want to remove this when running tests that are intended to fail
\set ON_ERROR_STOP ON
SET client_min_messages TO NOTICE; -- More talk
\set QUIET false


-- \ir is for include relative, it will run files in the same directory as this file
-- Note that these are not SQL statements but rather Postgres commands (no terminating semicolon). 
\ir tables.sql
\ir inserts.sql
\ir views.sql