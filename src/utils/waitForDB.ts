import pool from "../config/db"

export const waitForDB = async(tries: number = 10, delay: number = 3000) => {
    for (let i = 0; i < tries; i++){
        try {
            await pool.query(`SELECT 1`);
            console.log('Connected to DB successfully');
        } catch {
            console.log(`Could not connect to DB on attempt ${i}, trying again in ${delay/1000}s`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

