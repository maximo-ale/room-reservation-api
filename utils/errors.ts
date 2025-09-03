export class AppError extends Error{
    public statusCode: number;

    constructor(statusCode: number, message: string){
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class NotFoundError extends AppError{
    constructor(message: string){
        super(404, message);

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class BadRequestError extends AppError{
    constructor (message: string){
        super(400, message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class NoTokenError extends AppError{
    constructor(message: string){
        super(401, message);

        Object.setPrototypeOf(this, NoTokenError.prototype);
    }
}

export class NotAuthorizedError extends AppError{
    constructor(message: string){
        super(403, message);

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}