import type {Request, Response} from 'express';
import statsService from './statsService.js';

class StatsController{
    async topRooms(req: Request, res: Response){
        const topRooms = await statsService.topRooms();

        res.status(200).json({
            message: 'Top rooms found successfully',
            topRooms,
        });
    }

    async topUsers(req: Request, res: Response){
        const topUsers = await statsService.topUsers();

        res.status(200).json({
            message: 'Top users found successfully',
            topUsers,
        });
    }
}

export default new StatsController();