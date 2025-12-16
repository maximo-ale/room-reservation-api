import { BadRequestError, NotAuthorizedError, NotFoundError } from "../../utils/errors.js";
import roomsRepository from "../rooms/roomsRepository.js";
import userRepository from "../users/userRepository.js";
import reservationsRepository from "./reservationsRepository.js";

interface CreateReservationData{
    user_id: number,
    room_id: number,
    start_time: Date,
    end_time: Date,
    attendees: number,
}

interface ReservationData{
    user_id: number,
    room_id: number,
    start_time: Date,
    end_time: Date,
    attendees: number,
}

interface SimplifiedReservationData{
    id: number,
    start_time: Date,
    end_time: Date,
    status: 'confirmed' | 'cancelled',
}

interface ReservationFilters{
    start?: Date,
    end?: Date,
    user_id?: number,
    room_id?: number,
    status?: 'confirmed' | 'cancelled',
    limit?: number,
    offset?: number,
    sort?: 'oldest' | 'newest',
}

class ReservationsService{
    async createReservation(user_id: number, data: CreateReservationData): Promise<CreateReservationData>{
        const {room_id, start_time, end_time, attendees} = data;

        const room = await roomsRepository.getRoomById(room_id);

        if (!room){
            throw new NotFoundError('Room not found');
        }

        if (!room.available){
            throw new BadRequestError('Room is currently not available');
        }

        if (attendees > room.capacity){
            throw new BadRequestError(`Room does not support ${attendees} attendees`);
        }

        const roomReservations: SimplifiedReservationData[] = await reservationsRepository.getRoomReservations(room_id);

        // Convert DB time to local time
        const startUTC = new Date(start_time).getDate();
        const endUTC = new Date(end_time).getDate();

        // Compare if the given date is not overlapping other reservations
        roomReservations.forEach((roomReservation) => {
            const reservationStartUTC = new Date(roomReservation.start_time).getDate();
            const reservationEndUTC = new Date(roomReservation.end_time).getDate();

            if (((startUTC >= reservationStartUTC && startUTC <= reservationEndUTC) ||
                (endUTC >= reservationStartUTC && endUTC <= reservationEndUTC)) &&
                roomReservation.status !== "cancelled")
            {
                throw new BadRequestError('A reservation already exists between the given dates');
            }
        });

        const newReservation = await reservationsRepository.createReservation({
            user_id,
            room_id,
            start_time,
            end_time,
            attendees,
        });

        return newReservation;
    }

    async getReservations(user_id: number): Promise<SimplifiedReservationData[]>{
        const allReservations = await reservationsRepository.getReservations(user_id);
        return allReservations;
    }
    
    async getReservationDetails(reservation_id: number, user_id: number): Promise<ReservationData>{
        const user = await userRepository.findUserById(user_id);
        const reservationDetails = await reservationsRepository.getReservationDetails(reservation_id);

        if (!reservationDetails){
            throw new NotFoundError('Reservation not found');
        }

        // Get reservation details only if the request is either from the owner or from an admin
        if (reservationDetails.user_id !== user_id && user.role !== 'admin'){
            throw new NotAuthorizedError('You are not authorized to see this reservation');
        }

        return reservationDetails;
    }
    
    async cancelReservation(reservation_id: number, user_id: number): Promise<ReservationData>{
        const user = await userRepository.findUserById(user_id);
        const cancelledReservation = await reservationsRepository.cancelReservation(reservation_id);

        if (!cancelledReservation){
            throw new NotFoundError('Reservation not found');
        }

        // Cancel the reservation only if the request is either from the owner or from an admin
        if (cancelledReservation.user_id !== user_id && user.role !== 'admin'){
            throw new NotAuthorizedError('You are not authorized to cancel this reservation');
        }
        
        return cancelledReservation;
    }

    async getRoomReservations(room_id: number): Promise<SimplifiedReservationData[]>{
        const room = await roomsRepository.getRoomById(room_id);

        if (!room){
            throw new NotFoundError('Room not found');
        }

        const roomReservations = await reservationsRepository.getRoomReservations(room_id);
        return roomReservations;
    }
    
    async getAllReservations(data: ReservationFilters): Promise<SimplifiedReservationData[]>{
        const {start, end, user_id, room_id, status, limit, offset, sort} = data;
        let filters: ReservationFilters = {};

        // Prepare filters
        if (start) filters.start = start;
        if (end) filters.end = end;
        if (user_id) filters.user_id = user_id;
        if (room_id) filters.room_id = room_id;
        if (status) filters.status = status;
        if (limit) filters.limit = limit;
        if (offset) filters.offset = offset;
        if (sort) filters.sort = sort;

        const allReservations = await reservationsRepository.getAllReservations(filters);

        return allReservations;
    }
}

export default new ReservationsService();