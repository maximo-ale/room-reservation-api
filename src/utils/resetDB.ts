import pool from "../config/db.js"

const resetDB = async() => {
    await pool.query(`DROP TABLE IF EXISTS users CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS rooms CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS reservations`);
}

export default resetDB;