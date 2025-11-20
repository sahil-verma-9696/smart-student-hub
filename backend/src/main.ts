import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  /**********************************
   * Create app
   *********************************/
  const app = await NestFactory.create(AppModule);

  /**********************************
   * CORS
   *********************************/
  app.enableCors({
    origin: '*', // allow all (for testing)
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  /**********************************
   * Morgan middleware
   *********************************/
  app.use(morgan('combined')); // or 'combined', 'tiny', etc.

  /**********************************
   * Global interceptors
   *********************************/
  app.useGlobalInterceptors(new ResponseInterceptor());

  /**********************************
   * Global filters
   *********************************/
  app.useGlobalFilters(new GlobalExceptionFilter());

  /**********************************
   * Start server
   *********************************/
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
