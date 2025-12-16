import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError){
        return res.status(err.statusCode).json({error: err.message});
    }

    if (err.code === '23505'){
        return res.status(400).json({error: 'Duplicate key error'});
    }

    console.error(err);
    return res.status(500).json({error: 'Internal server error'});
}

export default errorHandler;