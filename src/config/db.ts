import { Pool } from 'pg';

console.log('|||user: ', process.env.POSTGRES_USER);

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.POSTGRES_DB,
});

export default pool;