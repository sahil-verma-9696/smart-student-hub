import { Module } from '@nestjs/common';
import { Criterion4Controller } from './criterion4.controller';
import { Criterion4Service } from './criterion4.service';
import { ReportGeneratorService } from './services/report-generator.service';
import { DataFetcherService } from './services/data-fetcher.service';

@Module({
  controllers: [Criterion4Controller],
  providers: [
    Criterion4Service,
    ReportGeneratorService,
    DataFetcherService,
  ],
  exports: [Criterion4Service],
})
export class Criterion4Module {}
