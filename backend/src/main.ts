import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io'; // 👈 ADD THIS

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 VERY IMPORTANT
  app.useWebSocketAdapter(new IoAdapter(app));

  // for dot env variables
  const config = app.get(ConfigService);

  /**********************************
   * CORS
   *********************************/
  app.enableCors({
    origin: '*', // allow all (for testing)
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
    Credentials: true,
  });

  // Global ValidationPipe (Required for DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Cloudinary
  cloudinary.config({
    cloud_name: config.get('CLOUDINARY_NAME'),
    api_key: config.get('CLOUDINARY_API_KEY'),
    api_secret: config.get('CLOUDINARY_API_SECRET'),
  });

  // Morgan Logger (useful for HTTP request tracking)
  app.use(morgan('combined'));

  // Global Interceptor (formats response)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Error Handler
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Start Server
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Server running at http://localhost:${process.env.PORT ?? 3000}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
