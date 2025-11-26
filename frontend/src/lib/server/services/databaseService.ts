// The database service that will be used to make queries.

import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

// Load environment variables.
dotenv.config();

// Define the pool of connections that can make request to the database.
const pool: Pool = new Pool({
    user: process.env.DB_USER ?? "",
    host: process.env.DB_HOST ?? "",
    database: process.env.DB_NAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
    port: Number(process.env.DB_PORT) ?? 5000
});

// Verifies the connection to the postgres db server.
async function verifyConnection(): Promise<void> {
    try {
        // Attempt to acquire a client from the pool.
        const client: PoolClient = await pool.connect();
        console.log('Connected to PostgreSQL database!');
        client.release(); // Release the client back to the pool.
    } catch (error) {
        console.error('Error occurred while connecting to the database: ', error);
    }
}

await verifyConnection(); // Verify before continuing!

// Get an sql client from the pool.
export async function GetSqlClient(): Promise<PoolClient> {
    return await pool.connect();
}

// release the sql client.
export async function ReleaseSqlClient(client: PoolClient): Promise<void> {
    client.release();
}

// Function for making a sql query and returning the object.
export async function MakeSqlQuery<T>(sqlQuery: string): Promise<T[] | null> {
    const client = await GetSqlClient();

    try {
        const response: QueryResult<any> = await client.query(sqlQuery); // Make the query.

        return response.rows as T[]; // Try to cast it to the type T!
    }
    catch (error: any) {
        console.error("Error when querying the db: ", error.message || error);

        return null; // If any errors occured, return null.
    }
    finally {
        await ReleaseSqlClient(client); // Release the resource.
    }
}

export default pool;