import express from 'express';

declare module 'express' {
    export interface Request {
        userId?: string,
        roomId?: string,
        reservationId?: string,
    }
}