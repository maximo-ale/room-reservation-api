import pool from "../../config/db.js";

interface RoomData{
    name: string,
    description?: string,
    capacity: number,
    available?: boolean,
}

interface SimplifiedRoomData{
    id: number,
    name: string,
}

interface UpdateRoomData{
    name?: string,
    description?: string,
    capacity?: number,
    available?: boolean,
}


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

    async getRoomById(room_id: number): Promise<RoomData>{
        const roomDetails = await pool.query(`
            SELECT * FROM rooms WHERE id = $1;
            `, [room_id]);
        return roomDetails.rows[0];
    }

    async updateRoom(room_id: number, data: UpdateRoomData): Promise<RoomData | null>{
        const {name, description, capacity, available} = data;
        // Define fields to update with their respective values
        let fields = [];
        let values: (string | number | boolean)[] = [room_id];
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

    async deleteRoom(room_id: number): Promise<RoomData>{
        const deletedRoom = await pool.query(`
            DELETE FROM rooms WHERE id = $1 RETURNING *;
            `, [room_id]);
        
            return deletedRoom.rows[0];
    }
}

export default new RoomRepository();