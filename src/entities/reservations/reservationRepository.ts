import pool from "../../config/db.js";

// Interfaces
import {
    CreateReservationData,
    SimplifiedReservationData,
    ReservationData,
    ReservationFilters,
    ReservationDetails,
} from "./reservationInterface.js";

class ReservationsRepository{
    async getReservationById(reservationId: string): Promise<ReservationData>{
        const reservation = await pool.query(`
            SELECT * FROM reservations WHERE id = $1;
            `, [reservationId]);
        return reservation.rows[0];
    }
    
    async createReservation(data: CreateReservationData): Promise<ReservationDetails>{
        const { userId, roomId, startTime, endTime } = data;

        // Create reservation with the current time
        const newReservation = await pool.query(`
            INSERT INTO reservations (user_id, room_id, start_time, end_time, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
            `, [userId, roomId, startTime, endTime, 'confirmed', new Date()]);

        return newReservation.rows[0];
    }

    async getReservations(userId: string): Promise<SimplifiedReservationData[]>{
        const getReservations = await pool.query(`
            SELECT (id, start_time, end_time) FROM reservations WHERE user_id = $1
            `, [userId]);

        return getReservations.rows;
    }
    
    async getReservationDetails(reservationId: string): Promise<ReservationData>{
        const reservationDetails = await pool.query(`
            SELECT * FROM reservations WHERE id = $1
            `, [reservationId]);
        return reservationDetails.rows[0];
    }
    
    async cancelReservation(reservationId: string): Promise <ReservationData>{
        const reservationToCancel = await pool.query(`
            UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *;
            `, [reservationId]);

        return reservationToCancel.rows[0];
    }

    async getRoomReservations(roomId: string): Promise<SimplifiedReservationData[]>{
        const roomReservations = await pool.query(`
            SELECT * FROM reservations WHERE room_id = $1;
            `, [roomId]);

        return roomReservations.rows;
    }
    
    async getAllReservations(filter: ReservationFilters): Promise<SimplifiedReservationData[]>{
        // Define filters to use with their respective values
        let filters = [];
        let values = [];
        let idx = 1;

        if (filter.start){
            filters.push(`start_time >= $${idx}`);
            values.push(filter.start);
            idx++;
        }
        if (filter.end){
            filters.push(`end_time <= $${idx}`);
            values.push(filter.end);
            idx++
        }
        if (filter.userId){
            filters.push(`user_id = $${idx}`);
            values.push(filter.userId);
            idx++
        }
        if (filter.roomId){
            filters.push(`room_id = $${idx}`);
            values.push(filter.roomId);
            idx++
        }
        if (filter.status){
            filters.push(`status = $${idx}`);
            values.push(filter.status);
            idx++
        }

        // By default, the query will select all reservations
        let query = 'SELECT * FROM reservations'

        // If it contains filters, add 'WHERE'
        if (filters.length > 0){
            query += ` WHERE ${filters.join(' AND ')}`;
        }

        // Order by either the newest or the oldest reservations
        if (filter.sort){
            query += ` ORDER BY start_time`
            if (filter.sort === 'oldest'){
                query += ` ASC`;
            } else if (filter.sort == 'newest'){
                query += ` DESC`;
            }
        }

        // Add a limit of results per page
        if (filter.limit){
            query += ` LIMIT ${filter.limit}`;
        }

        // Add pagination and skip 'filter.offset' - 1 pages
        if (filter.offset && filter.limit){
            filter.offset = filter.limit * (filter.offset - 1);
            query += ` OFFSET ${filter.offset}`;
        }

        // Request to DB
        const allReservations = await pool.query(query, values);

        return allReservations.rows;
    }
}

export default new ReservationsRepository();