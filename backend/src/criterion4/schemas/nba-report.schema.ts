
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NbaReportDocument = NbaReport & Document;

@Schema({ collection: 'nbareports' })
export class NbaReport {
    @Prop({ type: Object })
    reportData: Record<string, any>;
}

export const NbaReportSchema = SchemaFactory.createForClass(NbaReport);
