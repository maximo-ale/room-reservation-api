import pool from '../../config/db.js';

class StatsRepository{
    // Returns the 3 most reserved rooms 
    async topRooms(){
        const topRooms = await pool.query(`
            SELECT ro.*, COUNT(*) AS times_reserved
            FROM rooms ro
            JOIN reservations re ON ro.id = re.room_id
            GROUP BY ro.id
            ORDER BY COUNT(*) DESC
            LIMIT 3
            `);

        return topRooms.rows;
    }

    // Return the 3 users with most reservations
    async topUsers(){
        const topUsers = await pool.query(`
            SELECT u.*, COUNT(*) AS number_of_reservations
            FROM users u
            JOIN reservations r ON u.id = r.user_id
            GROUP BY u.id
            ORDER BY COUNT(*) DESC
            LIMIT 3
            `);

        return topUsers.rows;
    }
}

export default new StatsRepository();