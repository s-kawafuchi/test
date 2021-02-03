type errorData = {
    [key: string]: any,
}

export class HttpException extends Error {
    statusCode?: number;
    data: errorData;
    constructor(statusCode: number, message: string, data?: errorData) {
        super(message);
        this.message = message;
        this.statusCode = statusCode || 500;
        this.data = data ? data : {};
        // this.name = 'HttpException';
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpException);
        }
    }
}

export const badRequestException = (message = '400 Bad Request', data?: errorData) => {
    return new HttpException(400, message, data);
};
export const unAuthorizedException = (message = '401 Unauthorized', data?: errorData,) => {
    return new HttpException(401, message, data);
};
export const forbiddenException = (message = '403 Forbidden', data?: errorData,) => {
    return new HttpException(403, message, data);
};
