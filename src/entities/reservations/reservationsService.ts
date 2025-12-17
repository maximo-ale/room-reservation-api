import { BadRequestError, NotAuthorizedError, NotFoundError } from "../../utils/errors.js";
import roomsRepository from "../rooms/roomsRepository.js";
import userRepository from "../users/userRepository.js";
import reservationsRepository from "./reservationRepository.js";

// Interfaces
import {
    CreateReservationData,
    SimplifiedReservationData,
    ReservationData,
    ReservationFilters,
} from "./reservationInterface.js";

class ReservationsService{
    async createReservation(userId: string, data: CreateReservationData): Promise<CreateReservationData>{
        const {roomId, startTime, endTime, attendees} = data;

        const room = await roomsRepository.getRoomById(roomId);

        if (!room){
            throw new NotFoundError('Room not found');
        }

        if (!room.available){
            throw new BadRequestError('Room is currently not available');
        }

        if (attendees > room.capacity){
            throw new BadRequestError(`Room does not support ${attendees} attendees`);
        }

        const roomReservations: SimplifiedReservationData[] = await reservationsRepository.getRoomReservations(roomId);

        // Convert DB time to local time
        const startUTC = new Date(startTime).getDate();
        const endUTC = new Date(endTime).getDate();

        // Compare if the given date is not overlapping other reservations
        roomReservations.forEach((roomReservation) => {
            const reservationStartUTC = new Date(roomReservation.startTime).getDate();
            const reservationEndUTC = new Date(roomReservation.endTime).getDate();

            if (((startUTC >= reservationStartUTC && startUTC <= reservationEndUTC) ||
                (endUTC >= reservationStartUTC && endUTC <= reservationEndUTC)) &&
                roomReservation.status !== "cancelled")
            {
                throw new BadRequestError('A reservation already exists between the given dates');
            }
        });

        const newReservation = await reservationsRepository.createReservation({
            userId,
            roomId: roomId,
            startTime: startTime,
            endTime: endTime,
            attendees,
        });

        return newReservation;
    }

    async getReservations(userId: string): Promise<SimplifiedReservationData[]>{
        const allReservations = await reservationsRepository.getReservations(userId);
        return allReservations;
    }
    
    async getReservationDetails(reservationId: string, userId: string): Promise<ReservationData>{
        const user = await userRepository.findUserById(userId);
        const reservationDetails = await reservationsRepository.getReservationDetails(reservationId);

        if (!reservationDetails){
            throw new NotFoundError('Reservation not found');
        }

        // Get reservation details only if the request is either from the owner or from an admin
        if (reservationDetails.userId !== userId && user.role !== 'admin'){
            throw new NotAuthorizedError('You are not authorized to see this reservation');
        }

        return reservationDetails;
    }
    
    async cancelReservation(reservationId: string, userId: string): Promise<ReservationData>{
        const user = await userRepository.findUserById(userId);
        const cancelledReservation = await reservationsRepository.cancelReservation(reservationId);

        if (!cancelledReservation){
            throw new NotFoundError('Reservation not found');
        }

        // Cancel the reservation only if the request is either from the owner or from an admin
        if (cancelledReservation.userId !== userId && user.role !== 'admin'){
            throw new NotAuthorizedError('You are not authorized to cancel this reservation');
        }
        
        return cancelledReservation;
    }

    async getRoomReservations(roomId: string): Promise<SimplifiedReservationData[]>{
        const room = await roomsRepository.getRoomById(roomId);

        if (!room){
            throw new NotFoundError('Room not found');
        }

        const roomReservations = await reservationsRepository.getRoomReservations(roomId);
        return roomReservations;
    }
    
    async getAllReservations(data: ReservationFilters): Promise<SimplifiedReservationData[]>{
        const {start, end, userId, roomId, status, limit, offset, sort} = data;
        let filters: ReservationFilters = {};

        // Prepare filters
        if (start) filters.start = start;
        if (end) filters.end = end;
        if (userId) filters.userId = userId;
        if (roomId) filters.roomId = roomId;
        if (status) filters.status = status;
        if (limit) filters.limit = limit;
        if (offset) filters.offset = offset;
        if (sort) filters.sort = sort;

        const allReservations = await reservationsRepository.getAllReservations(filters);

        return allReservations;
    }
}

export default new ReservationsService();