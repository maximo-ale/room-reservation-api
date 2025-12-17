import type { Request, Response } from 'express';
import reservationsService from './reservationsService.js';

class ReservationsController{
    async createReservation(req: Request, res: Response){
        const newReservation = await reservationsService.createReservation(req.userId!, req.body);
        res.status(201).json({
            message: 'Reservation created successfully',
            newReservation,
        });
    }

    async getReservations(req: Request, res: Response){
        const reservations = await reservationsService.getReservations(req.userId!);

        res.status(200).json({
            message: 'User reservations found successfully',
            reservations,
        });
    }

    async getReservationDetails(req: Request, res: Response){
        const reservationDetails = await reservationsService.getReservationDetails(req.reservationId!, req.userId!);

        res.status(200).json({
            message: 'Reservation details found successfully',
            reservationDetails,
        });        
    }

    async cancelReservation(req: Request, res: Response){
        const cancelledReservation = await reservationsService.cancelReservation(req.reservationId!, req.userId!);

        res.status(200).json({
            message: 'Reservation cancelled successfully',
            cancelledReservation,
        });
    }

    async getRoomReservations(req: Request, res: Response){
        const roomReservations = await reservationsService.getRoomReservations(req.params.roomId!);

        res.status(200).json({
            message: 'Room reservations found successfully',
            roomReservations,
        });
    }
    
    async getAllReservations(req: Request, res: Response){
        const allReservations = await reservationsService.getAllReservations(req.query);

        res.status(200).json({
            message: 'All reservations found successfully',
            allReservations,
        })
    }
}

export default new ReservationsController();