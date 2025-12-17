import { z, type ZodObject, type ZodRawShape} from 'zod';

export const createSchema: ZodObject<ZodRawShape> = z.object({
    roomId: z.string().regex(/^\d+$/, 'ID must be a positive integer'),
    startTime: z.iso.datetime().transform((val) => new Date(val)),
    endTime: z.iso.datetime().transform((val) => new Date(val)),
    attendees: z.number('Attendees must be a integer').positive('Attendees cannot be negative'),
}).refine((data) => data.startTime < data.endTime, {
    message: 'Start time cannot be after end time',
    path: ["endTime"],
}).refine((data) => data.startTime > new Date(), {
    message: 'Start time must be in the future',
    path: ["startTime"],
});

export const filterSchema: ZodObject<ZodRawShape> = z.object({
    startTime: z.iso.datetime().transform((val) => new Date(val)).optional(),
    endTime: z.iso.datetime().transform((val) => new Date(val)).optional(),
    roomId: z.string().regex(/^\d+$/, 'ID must be a positive integer').optional(),
    status: z.string().optional(),
    limit: z.string().min(1, 'Limit cannot be less than 1').max(10, 'Limit cannot be greater than 10').optional(),
    offset: z.string().min(1).optional(),
    sort: z.enum(['oldest', 'newest']).optional(),
});

export const reservationIdSchema: ZodObject<ZodRawShape> = z.object({
    reservationId: z.string().regex(/^\d+$/, 'ID must be a positive integer'),
});

export const roomIdSchema: ZodObject<ZodRawShape> = z.object({
    roomId: z.string().regex(/^\d+$/, 'ID must be a positive integer'),
});