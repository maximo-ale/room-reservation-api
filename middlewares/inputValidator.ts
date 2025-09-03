import type { ZodObject, ZodRawShape } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const validate = (schema: ZodObject<ZodRawShape>, type: 'body' | 'params' | 'query') => {
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req[type]);

        if (!result.success){
            return res.status(400).json({errors: result.error.format()});
        }

        (req as any).validatedQuery = result.data;
        next();
    }
}

export default validate;