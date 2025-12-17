import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError, NoTokenError } from '../utils/errors.js';
import userRepository from '../entities/users/userRepository.js';

export const auth = async(req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('Authorization')?.split(' ')[1];
    if (!token || token === 'undefined' || token === 'null') {
        throw new NoTokenError('No token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
        req.userId! = decoded.userId;

        // Check if user is from this DB
        const possibleUser = await userRepository.findUserById(req.userId);
        if (!possibleUser) {
            throw new NotAuthorizedError('Invalid token. User is not in the DB');
        }

        next();
    } catch {
        throw new NotAuthorizedError('Invalid token');
    }
}

export const adminOnly = async(req: Request, res: Response, next: NextFunction) => {
    const user = await userRepository.findUserById(req.userId!);

    if (user.role != 'admin'){
        throw new NotAuthorizedError('Not authorized. Admin only');
    }

    next();
}