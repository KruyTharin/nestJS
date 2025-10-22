import { ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

export class HttpExceptionFIlter implements ExceptionFilter {
  logger = new Logger();
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const errorDetail = exception.getResponse();

    this.logger.error(exception.error);
    response.status(status).json({
      error: true,
      errorDetail,
    });
  }
}
