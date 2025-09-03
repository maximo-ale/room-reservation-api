import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import roomsRepository from "./roomsRepository.js";

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

class RoomService{
    async createRoom(data: RoomData): Promise<RoomData>{
        const {name, description, capacity} = data;
        let {available} = data;

        // By default, 'available' will be 'true'
        if (available !== false){
            available = true;
        }

        const newRoom = await roomsRepository.createRoom({
            name,
            description: description || 'No description available',
            capacity,
            available: available,
        });

        return newRoom;
    }

    async getAllRooms(): Promise<SimplifiedRoomData[]>{
        const allRooms = await roomsRepository.getAllRooms();

        return allRooms;
    }

    async getRoomDetails(room_id: number): Promise<RoomData>{
        const roomDetails: RoomData = await roomsRepository.getRoomById(room_id);

        if (!roomDetails){
            throw new NotFoundError('Room not found');
        }

        return roomDetails;
    }

    async updateRoom(room_id: number, data: object): Promise<RoomData>{
        const updatedRoom = await roomsRepository.updateRoom(room_id, data);

        if (updatedRoom === null){
            throw new BadRequestError('At least one field must be provided');
        }

        if (!updatedRoom){
            throw new NotFoundError('Room not found');
        }

        return updatedRoom;
    }

    async deleteRoom(room_id: number): Promise <RoomData>{
        const deletedRoom = await roomsRepository.deleteRoom(room_id);

        if (!deletedRoom){
            throw new NotFoundError('Room not found');
        }

        return deletedRoom;
    }
}

export default new RoomService();