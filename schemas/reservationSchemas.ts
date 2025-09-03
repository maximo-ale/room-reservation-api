import { z, type ZodObject, type ZodRawShape} from 'zod';

export const createSchema: ZodObject<ZodRawShape> = z.object({
    room_id: z.string().regex(/^\d+$/, 'ID must be a positive integer').transform((val) => parseInt(val, 10)),
    start_time: z.iso.datetime().transform((val) => new Date(val)),
    end_time: z.iso.datetime().transform((val) => new Date(val)),
    attendees: z.number('Attendees must be a integer').positive('Attendees cannot be negative'),
}).refine((data) => data.start_time < data.end_time, {
    message: 'Start time cannot be after end time',
    path: ["endTime"],
}).refine((data) => data.start_time > new Date(), {
    message: 'Start time must be in the future',
    path: ["startTime"],
});

export const filterSchema: ZodObject<ZodRawShape> = z.object({
    start_time: z.iso.datetime().transform((val) => new Date(val)).optional(),
    end_time: z.iso.datetime().transform((val) => new Date(val)).optional(),
    room_id: z.string().regex(/^\d+$/, 'ID must be a positive integer').transform((val) => parseInt(val, 10)).optional(),
    status: z.string().optional(),
    limit: z.string().min(1, 'Limit cannot be less than 1').max(10, 'Limit cannot be greater than 10').optional(),
    offset: z.string().min(1).optional(),
    sort: z.enum(['oldest', 'newest']).optional(),
});

export const reservationIdSchema: ZodObject<ZodRawShape> = z.object({
    reservation_id: z.string().regex(/^\d+$/, 'ID must be a positive integer').transform((val) => parseInt(val, 10)),
});

export const roomIdSchema: ZodObject<ZodRawShape> = z.object({
    room_id: z.string().regex(/^\d+$/, 'ID must be a positive integer').transform((val) => parseInt(val, 10)),
});