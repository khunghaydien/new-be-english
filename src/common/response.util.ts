import { Response } from 'express';
import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';

export class ResponseUtil {
    static success(res: Response, message: string, data: any, statusCode: number = HttpStatus.OK) {
        res.status(statusCode).json({
            statusCode,
            message,
            data,
        });
    }
    static error(res: Response, message: string, error: any): void {
        // Determine the status code based on the type of error
        const statusCode = ResponseUtil.getStatusCode(error);

        res.status(statusCode).json({
            statusCode,
            message,
            error: error.message || error,
        });
    }

    private static getStatusCode(error: any): number {
        if (error instanceof BadRequestException) {
            return HttpStatus.BAD_REQUEST;
        }
        if (error instanceof UnauthorizedException) {
            return HttpStatus.UNAUTHORIZED;
        }
        if (error instanceof ForbiddenException) {
            return HttpStatus.FORBIDDEN;
        }
        if (error instanceof NotFoundException) {
            return HttpStatus.NOT_FOUND;
        }
        if (error instanceof ConflictException) {
            return HttpStatus.CONFLICT;
        }
        // Default to Internal Server Error if the type of error is not recognized
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}