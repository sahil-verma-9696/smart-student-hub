import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: {
      status: number;
      name: string;
      message: string;
      details: any;
    } = {
      status,
      name: 'InternalServerError',
      message: 'Something went wrong',
      details: {},
    };

    // ------------------------------------------
    // 1. Handle Nest HttpException
    // ------------------------------------------
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // Normalize message
      let message: string;

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && 'message' in res) {
        const msg = (res as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      } else {
        message = exception.message;
      }

      errorResponse = {
        status,
        name:
          typeof res === 'object' && 'error' in res
            ? (res as any).error
            : exception.name,
        message,
        details:
          typeof res === 'object' && 'details' in res
            ? (res as any).details
            : {},
      };
    }

    // ------------------------------------------
    // 2. Plain JS Error (throw new Error())
    // ------------------------------------------
    else if (exception instanceof Error) {
      errorResponse = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: exception.name,
        message: exception.message,
        details: {},
      };
    }

    // ------------------------------------------
    // 3. Unknown / weird error (throw "abc")
    // ------------------------------------------
    else {
      errorResponse = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        name: 'UnknownError',
        message: JSON.stringify(exception),
        details: {},
      };
    }

    return response.status(status).json({
      data: null,
      error: errorResponse,
    });
  }
}
