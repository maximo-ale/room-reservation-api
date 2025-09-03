import type { Request, Response } from 'express';
import userService from './userService.js';
import pool from '../../config/db.js';

class UserController{
    async register(req: Request, res: Response){
        const {user, token} = await userService.register(req.body);

        res.status(201).json({
            message: 'User created successfully',
            user,
            token,
        });
    }

    async login(req: Request, res: Response){
        const {user, token} = await userService.login(req.body);

        res.status(200).json({
            message: 'Logged in successfully',
            user,
            token,
        });
    }

    async getProfile(req: Request, res: Response){
        const profile = await userService.getProfile(parseInt(req.user_id!));

        res.status(200).json({
            message: 'Profile found successfully',
            profile,
        });
    }

    async updateProfile(req: Request, res: Response){
        const updateProfile = await userService.updateProfile(parseInt(req.user_id!), req.body);

        res.status(200).json({
            message: 'Profile updated correctly',
            modifiedProfile: updateProfile,
        });
    }

    async allUsers(req: Request, res: Response){
        const allUsers = await userService.getAllUsers();

        res.status(200).json({
            message: 'All users found successfully',
            allUsers,
        });
    }

    async allTables(req: Request, res: Response){
        const userTable = await pool.query(`SELECT * FROM users`);
        res.status(200).json({
            message: 'User table found successfully',
            userTable: userTable.rows,
        });
    }
}

export default new UserController()