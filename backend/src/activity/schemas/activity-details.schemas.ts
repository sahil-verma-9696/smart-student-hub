import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class MoocDetails {
  @Prop() platform: string;
  @Prop() courseName: string;
  @Prop() instructor?: string;
  @Prop() durationHours?: number;
  @Prop() scorePercent?: number;
  @Prop() certificateId?: string;
  @Prop() verificationLink?: string;
}
export const MoocDetailsSchema = SchemaFactory.createForClass(MoocDetails);

@Schema({ _id: false })
export class CertificationDetails {
  @Prop() certifyingBody: string;
  @Prop() certificateName: string;
  @Prop() certificateId?: string;
  @Prop() verificationLink?: string;
  @Prop() issueDate?: Date;
  @Prop() expiryDate?: Date;
}
export const CertificationDetailsSchema = SchemaFactory.createForClass(CertificationDetails);

@Schema({ _id: false })
export class ConferenceDetails {
  @Prop() conferenceName: string;
  @Prop() organizer: string;
  @Prop() mode: string;
  @Prop() location?: string;
  @Prop() date?: Date;
}
export const ConferenceDetailsSchema = SchemaFactory.createForClass(ConferenceDetails);

@Schema({ _id: false })
export class ConferencePaperDetails {
  @Prop() paperTitle: string;
  @Prop() conferenceName: string;
  @Prop() presentationType: string;
  @Prop() indexing?: string;
  @Prop() doi?: string;
  @Prop() proceedings_isbn?: string;
  @Prop([String]) authors?: string[];
}
export const ConferencePaperDetailsSchema = SchemaFactory.createForClass(ConferencePaperDetails);

@Schema({ _id: false })
export class WorkshopDetails {
  @Prop() workshopName: string;
  @Prop() organizer: string;
  @Prop() mode: string;
  @Prop() durationHours?: number;
  @Prop([String]) skillsGained?: string[];
}
export const WorkshopDetailsSchema = SchemaFactory.createForClass(WorkshopDetails);

@Schema({ _id: false })
export class WebinarDetails {
  @Prop() topic: string;
  @Prop() speaker: string;
  @Prop() organizer: string;
  @Prop() date?: Date;
}
export const WebinarDetailsSchema = SchemaFactory.createForClass(WebinarDetails);

@Schema({ _id: false })
export class CompetitionDetails {
  @Prop() eventName: string;
  @Prop() organizer: string;
  @Prop() level?: string;
  @Prop() position?: string;
  @Prop() teamSize?: number;
}
export const CompetitionDetailsSchema = SchemaFactory.createForClass(CompetitionDetails);

@Schema({ _id: false })
export class InternshipDetails {
  @Prop() organization: string;
  @Prop() role: string;
  @Prop() startDate: Date;
  @Prop() endDate: Date;
  @Prop() stipend?: number;
}
export const InternshipDetailsSchema = SchemaFactory.createForClass(InternshipDetails);

@Schema({ _id: false })
export class LeadershipDetails {
  @Prop() roleTitle: string;
  @Prop() organization: string;
  @Prop() tenureStart: Date;
  @Prop() tenureEnd?: Date;
  @Prop() teamSize?: number;
}
export const LeadershipDetailsSchema = SchemaFactory.createForClass(LeadershipDetails);

@Schema({ _id: false })
export class VolunteeringDetails {
  @Prop() organization: string;
  @Prop() eventName?: string;
  @Prop() hoursServed?: number;
  @Prop() role?: string;
}
export const VolunteeringDetailsSchema = SchemaFactory.createForClass(VolunteeringDetails);

@Schema({ _id: false })
export class ClubActivityDetails {
  @Prop() clubName: string;
  @Prop() eventName: string;
  @Prop() role?: string;
}
export const ClubActivityDetailsSchema = SchemaFactory.createForClass(ClubActivityDetails);

@Schema({ _id: false })
export class ProjectDetails {
  @Prop() projectTitle: string;
  @Prop() description?: string;
  @Prop([String]) technologies?: string[];
  @Prop() githubUrl?: string;
}
export const ProjectDetailsSchema = SchemaFactory.createForClass(ProjectDetails);

@Schema({ _id: false })
export class SportsDetails {
  @Prop() sportName: string;
  @Prop() eventName?: string;
  @Prop() level?: string;
  @Prop() position?: string;
}
export const SportsDetailsSchema = SchemaFactory.createForClass(SportsDetails);

@Schema({ _id: false })
export class CulturalDetails {
  @Prop() eventName: string;
  @Prop() category?: string;
  @Prop() organizer?: string;
  @Prop() level?: string;
  @Prop() position?: string;
}
export const CulturalDetailsSchema = SchemaFactory.createForClass(CulturalDetails);

@Schema({ _id: false })
export class ResearchDetails {
  @Prop() title: string;
  @Prop() journal: string;
  @Prop() indexing?: string;
  @Prop() doi?: string;

  @Prop({
    type: {
      firstAuthor: { type: String, required: true },
      coAuthors: { type: [String], required: false },
    }
  })
  authors: {
    firstAuthor: string;
    coAuthors?: string[];
  };
  @Prop() status: string;
}
export const ResearchDetailsSchema = SchemaFactory.createForClass(ResearchDetails);


@Schema({ _id: false })
export class PatentDetails {
  @Prop() patentTitle: string;
  @Prop() applicationNumber?: string;
  @Prop() filingDate: Date;
  @Prop() status: string;
  @Prop([String]) inventors: string[];
}
export const PatentDetailsSchema = SchemaFactory.createForClass(PatentDetails);

@Schema({ _id: false })
export class OtherActivityDetails {
  @Prop() activityName: string;
  @Prop() organizer?: string;
  @Prop() date?: Date;
  @Prop() location?: string;
  @Prop() Description: string;
}
export const OtherActivityDetailsSchema = SchemaFactory.createForClass(OtherActivityDetails);
