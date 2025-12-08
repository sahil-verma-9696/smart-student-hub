import { Injectable, Logger } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';
import { ReportData } from '../interfaces/report-data.interface';

const { updateCursor, getGlobalCursor, setGlobalCursor } = require('../utils/cursor');
const { drawHeader } = require('../modules/header');
const { drawNarrativeSync } = require('../modules/narrative');
const { drawB4a } = require('../modules/tableB4a');
const { drawGraduatedTable } = require('../modules/tableGraduated');
const { drawEnrollmentRatioTable } = require('../modules/tableEnrollmentRatio');
const { drawSuccessRateTables } = require('../modules/tableSuccessRate');
const { drawPlacementTable } = require('../modules/tablePlacement');
const { drawPlacementDetailsTable } = require('../modules/tablePlacementDetails');
const { 
  drawInterInstituteEventsTable, 
  drawCodingCompetitionsTable, 
  drawUniversityMeritTable, 
  drawClosureStatement 
} = require('../modules/tableInterInstitute');

@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);
  private readonly OUTPUT_DIR = path.join(__dirname, '..', 'output');

  private readonly CONSTANTS = {
    MARGIN: 40,
    PAGE_WIDTH: 595.28,
    PAGE_HEIGHT: 841.89,
    BOTTOM_MARGIN: 50,
    BOTTOM_LIMIT: 841.89 - 50,
    USABLE_WIDTH: 595.28 - 80
  };

  async generate(
    reportData: ReportData,
    fileName?: string,
    options: any = {}
  ): Promise<{ filePath: string; fileName: string }> {
    return new Promise((resolve, reject) => {
      try {
        // Ensure output directory exists
        if (!fs.existsSync(this.OUTPUT_DIR)) {
          fs.mkdirSync(this.OUTPUT_DIR, { recursive: true });
        }

        // Generate filename with timestamp if not provided
        const timestamp = Date.now();
        const finalFileName = fileName || `criterion4-test-${timestamp}.pdf`;
        const filePath = path.join(this.OUTPUT_DIR, finalFileName);

        const doc = this.createDoc();
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        stream.on('finish', () => {
          this.logger.log(`Report saved to: ${filePath}`);
          resolve({ filePath, fileName: finalFileName });
        });
        stream.on('error', reject);
        doc.on('error', reject);

        // Generate report sections
        this.generateReportSections(doc, reportData, options);

        doc.end();
      } catch (error) {
        this.logger.error(`Error generating report: ${error.message}`, error.stack);
        reject(error);
      }
    });
  }

  private createDoc(): PDFKit.PDFDocument {
    const doc = new PDFDocument({ 
      margin: this.CONSTANTS.MARGIN,
      bufferPages: true,
      autoFirstPage: true
    });

    doc.on('pageAdded', () => {
      doc.x = this.CONSTANTS.MARGIN;
      doc.y = this.CONSTANTS.MARGIN;
      updateCursor(doc);
      setGlobalCursor({ x: doc.x, y: doc.y });
    });

    updateCursor(doc);
    setGlobalCursor({ x: doc.x, y: doc.y });

    return doc;
  }

  private generateReportSections(doc: PDFKit.PDFDocument, data: ReportData, options: any = {}): void {
    // Extract program info
    const programInfo: any = data.programInfo || {};
    const departmentName = options.departmentName || programInfo.department || 'Computer Science & Engineering';
    const instituteName = options.instituteName || programInfo.instituteShortName || programInfo.instituteName || 'AIT';
    const programName = options.programName || programInfo.programName || 'B.Tech (CSE)';
    const affiliatingUniversity = options.affiliatingUniversity || programInfo.affiliatingUniversity || 'AKTU, Lucknow';

    // Prepare options for modules
    const moduleOptions = {
      departmentName,
      instituteName,
      programName,
      affiliatingUniversity,
      useAI: options.useAI || false
    };

    let currentCursor = { x: doc.x, y: doc.y };

    // Draw Header
    currentCursor = drawHeader(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Draw Narrative
    currentCursor = getGlobalCursor();
    currentCursor = drawNarrativeSync(doc, data, currentCursor, this.CONSTANTS, moduleOptions) || currentCursor;
    setGlobalCursor(currentCursor);

    // Table B4a
    currentCursor = getGlobalCursor();
    currentCursor = drawB4a(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Graduated Table - Regular Program
    currentCursor = getGlobalCursor();
    currentCursor = drawGraduatedTable(doc, data, currentCursor, this.CONSTANTS, {
      title: 'Table 4.1b: Number of students who have successfully graduated in each year (Regular Program)',
      dataKey: 'graduationStats'
    }) || currentCursor;
    setGlobalCursor(currentCursor);

    // Graduated Table - Total (Regular + Lateral Entry)
    currentCursor = getGlobalCursor();
    currentCursor = drawGraduatedTable(doc, data, currentCursor, this.CONSTANTS, {
      title: 'Table 4.1c: Number of students who have successfully graduated in each year (Total)',
      dataKey: 'totalGraduationStats'
    }) || currentCursor;
    setGlobalCursor(currentCursor);

    // Enrollment Ratio Table
    currentCursor = getGlobalCursor();
    currentCursor = drawEnrollmentRatioTable(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Success Rate Tables
    currentCursor = getGlobalCursor();
    currentCursor = drawSuccessRateTables(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Placement Table
    currentCursor = getGlobalCursor();
    currentCursor = drawPlacementTable(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Placement Details Table
    currentCursor = getGlobalCursor();
    currentCursor = drawPlacementDetailsTable(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Inter-Institute Events
    currentCursor = getGlobalCursor();
    currentCursor = drawInterInstituteEventsTable(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // Coding Competitions
    currentCursor = getGlobalCursor();
    currentCursor = drawCodingCompetitionsTable(doc, data, currentCursor, this.CONSTANTS) || currentCursor;
    setGlobalCursor(currentCursor);

    // University Merit List
    currentCursor = getGlobalCursor();
    currentCursor = drawUniversityMeritTable(doc, data, currentCursor, this.CONSTANTS, moduleOptions) || currentCursor;
    setGlobalCursor(currentCursor);

    // Closure Statement
    currentCursor = getGlobalCursor();
    currentCursor = drawClosureStatement(doc, data, currentCursor, this.CONSTANTS, moduleOptions) || currentCursor;
    setGlobalCursor(currentCursor);
  }
}
