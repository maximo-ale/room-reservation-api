import { z, type ZodObject, type ZodRawShape} from 'zod';

export const registerSchema: ZodObject<ZodRawShape> = z.object({
    name: z.string('Name must be a string').min(1, 'Name is mandatory'),
    email: z.email('Invalid email'),
    password: z.string('Password must be a string').min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['user', 'admin']).optional(),
});

export const loginSchema = z.object({
    name: z.string('Name must be a string').optional(),
    email: z.email('Invalid email').optional(),
});

export const updateSchema = z.object({
    newName: z.string('Name must be a string').min(1).optional(),
    newPassword: z.string('New password must be a string').min(6, 'Password must be at least 6 characters long').optional(),
    oldPassword: z.string('Old password must be a string').optional(),
});