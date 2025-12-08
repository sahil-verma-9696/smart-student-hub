import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Criterion4 NestJS Module running on: http://localhost:${port}`);
  console.log(`📁 Output directory: ${path.join(__dirname, 'output')}`);
  console.log(`📄 API Documentation:`);
  console.log(`   - Health: GET http://localhost:${port}/api/criterion4/health`);
  console.log(`   - Generate: POST http://localhost:${port}/api/criterion4/generate`);
}

bootstrap();
