import { Module } from '@nestjs/common';
import { Criterion4Module } from './criterion4.module';

@Module({
  imports: [Criterion4Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
