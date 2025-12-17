import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import roomsRepository from "./roomsRepository.js";

// Interfaces
import { RoomData, SimplifiedRoomData } from "./roomsInterfaces.js";

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

    async getRoomDetails(roomId: string): Promise<RoomData>{
        const roomDetails: RoomData = await roomsRepository.getRoomById(roomId);

        if (!roomDetails){
            throw new NotFoundError('Room not found');
        }

        return roomDetails;
    }

    async updateRoom(roomId: string, data: object): Promise<RoomData>{
        const updatedRoom = await roomsRepository.updateRoom(roomId, data);

        if (updatedRoom === null){
            throw new BadRequestError('At least one field must be provided');
        }

        if (!updatedRoom){
            throw new NotFoundError('Room not found');
        }

        return updatedRoom;
    }

    async deleteRoom(roomId: string): Promise <RoomData>{
        const deletedRoom = await roomsRepository.deleteRoom(roomId);

        if (!deletedRoom){
            throw new NotFoundError('Room not found');
        }

        return deletedRoom;
    }
}

export default new RoomService();