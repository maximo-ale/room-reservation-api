import { z, type ZodObject, type ZodRawShape} from 'zod';

export const createSchema: ZodObject<ZodRawShape> = z.object({
    name: z.string().min(1, 'Name must be provided'),
    description: z.string().optional(),
    capacity: z.int().positive('Capacity must be an integer'),
    available: z.boolean().optional(),
});

export const updateSchema: ZodObject<ZodRawShape> = z.object({
    name: z.string().min(1, 'Invalid name').optional(),
    description: z.string().optional(),
    capacity: z.int().positive('Capacity must be an integer').optional(),
    availabe: z.boolean().optional(),
});

export const idSchema: z.ZodObject<ZodRawShape> = z.object({
    room_id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform((val) => parseInt(val, 10)),
});