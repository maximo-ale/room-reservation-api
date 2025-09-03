import type { Request, Response } from "express";
import roomsService from "./roomsService.js";

class RoomController{
    async createRoom(req: Request, res: Response){
        const newRoom = await roomsService.createRoom(req.body);

        res.status(201).json({
            message: 'Room created successfully',
            newRoom,
        });
    }

    async getAllRooms(req: Request, res: Response){
        const allRooms = await roomsService.getAllRooms();

        res.status(200).json({
            message: 'All rooms found successfully',
            allRooms,
        });
    }

    async getRoomDetails(req: Request, res: Response){
        const roomDetails = await roomsService.getRoomDetails(parseInt(req.params.room_id!));

        res.status(200).json({
            message: 'Room details found successfully',
            roomDetails,
        });
    }

    async updateRoom(req: Request, res: Response){
        const updatedRoom = await roomsService.updateRoom(parseInt(req.params.room_id!), req.body);

        res.status(200).json({
            message: 'Room updated successfully',
            updatedRoom,
        });
    }

    async deleteRoom(req: Request, res: Response){
        const deletedRoom = await roomsService.deleteRoom(parseInt(req.params.room_id!));

        res.status(200).json({
            message: 'Room deleted successfully',
            deletedRoom,
        });
    }
}

export default new RoomController();