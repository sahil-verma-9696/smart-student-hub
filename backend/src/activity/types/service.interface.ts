// import { Attachment } from 'src/attachment/schema/attachment.schema';
// import { CreateActivityDto } from '../dto/create-activity.dto';
// import { UpdateActivityDto } from '../dto/update-activity.dto';
// import { ActivityDocument } from '../schema/activity.schema';
// import { ActivityStatus } from '../schema/activity.schema';
// import { ActivityChangeLog } from '../schema/change-log.schema';

// export interface IActivityService {
//   /**
//    * Student creates a new activity.
//    */
//   createActivity(dto: CreateActivityDto): Promise<ActivityDocument>;

//   /**
//    * Student updates an existing activity.
//    * Add change logs inside service.
//    */
//   updateActivity(
//     activityId: string,
//     dto: UpdateActivityDto,
//     studentId: string,
//   ): Promise<ActivityDocument>;

//   /**
//    * Fetch single activity.
//    */
//   getActivityById(activityId: string): Promise<ActivityDocument>;

//   /**
//    * Faculty/Admin: fetch all activities with filters.
//    */
//   getAllActivities(query?: any): Promise<ActivityDocument[]>;

//   /**
//    * Faculty: approve activity.
//    */
//   approveActivity(
//     activityId: string,
//     facultyId: string,
//   ): Promise<ActivityDocument>;

//   /**
//    * Faculty: reject activity with remarks.
//    */
//   rejectActivity(
//     activityId: string,
//     facultyId: string,
//     remarks: string,
//   ): Promise<ActivityDocument>;

//   /**
//    * Upload attachments (Certificates, images, pdf).
//    * Should integrate cloud service.
//    */
//   addAttachments(
//     activityId: string,
//     attachments: Attachment[],
//     studentId: string,
//   ): Promise<ActivityDocument>;

//   /**
//    * Add external links (GitHub, Drive, etc.)
//    */
//   addExternalLinks(
//     activityId: string,
//     links: string[],
//     studentId: string,
//   ): Promise<ActivityDocument>;

//   /**
//    * Share activity to social media platforms.
//    * (LinkedIn, Twitter, Instagram, WhatsApp)
//    */
//   shareActivity(
//     activityId: string,
//     platform: SocialMediaPlatform,
//     userId: string,
//   ): Promise<{ success: boolean; url?: string }>;

//   /**
//    * Track changes in activity — fetch change logs.
//    * Student edits after feedback.
//    */
//   getActivityChangeLogs(activityId: string): Promise<ActivityChangeLog[]>;

//   /**
//    * Soft-delete activity (if needed).
//    */
//   deleteActivity(activityId: string, userId: string): Promise<void>;
// }

// export default IActivityService;
