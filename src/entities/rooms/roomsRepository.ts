import pool from "../../config/db.js";

// Interfaces
import { RoomData, UpdateRoomData, SimplifiedRoomData} from './roomsInterfaces.js';


class RoomRepository{
    async createRoom(data: RoomData): Promise<RoomData>{
        const {name, description, capacity, available} = data;

        const newRoom = await pool.query(`
            INSERT INTO rooms (name, description, capacity, available)
            VALUES ($1, $2, $3, $4) RETURNING *;
            `, [name, description, capacity, available]);

        return newRoom.rows[0];
    }

    async getAllRooms(): Promise<SimplifiedRoomData[]> {
        const allRooms = await pool.query(`
            SELECT * FROM rooms;
            `);

        return allRooms.rows;
    }

    async getRoomById(roomId: string): Promise<RoomData>{
        const roomDetails = await pool.query(`
            SELECT * FROM rooms WHERE id = $1;
            `, [roomId]);
        return roomDetails.rows[0];
    }

    async updateRoom(roomId: string, data: UpdateRoomData): Promise<RoomData | null>{
        const {name, description, capacity, available} = data;
        // Define fields to update with their respective values
        let fields = [];
        let values: (string | number | boolean)[] = [roomId];
        let idx = 2;

        if (name){
            fields.push(`name = $${idx}`);
            values.push(name);
            idx++;
        }

        if (description){
            fields.push(`description = $${idx}`);
            values.push(description);
            idx++;
        }

        if (capacity){
            fields.push(`capacity = $${idx}`);
            values.push(capacity);
            idx++;
        }

        if (available){
            fields.push(`available = $${idx}`);
            values.push(available);
            idx++;
        }

        // If no fields where provided, return 'null'
        if (fields.length === 0){
            return null;
        }

        // Update profile only with the given values
        const updatedRoom = await pool.query(`
            UPDATE rooms SET ${fields.join(', ')} WHERE id = $1 RETURNING *;
            `, values);

        return updatedRoom.rows[0];
    }

    async deleteRoom(roomId: string): Promise<RoomData>{
        const deletedRoom = await pool.query(`
            DELETE FROM rooms WHERE id = $1 RETURNING *;
            `, [roomId]);
        
            return deletedRoom.rows[0];
    }
}

export default new RoomRepository();