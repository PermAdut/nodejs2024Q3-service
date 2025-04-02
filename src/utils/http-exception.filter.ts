import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const response = ctx.getContext();
    const message = exception.getError();

    const status = 400;

    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    };
  }
}
