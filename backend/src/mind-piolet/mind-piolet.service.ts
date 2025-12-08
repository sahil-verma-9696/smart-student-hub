import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateMindPioletDto } from './dto/create-mind-piolet.dto';
import { UpdateMindPioletDto } from './dto/update-mind-piolet.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { StudentService } from 'src/student/student.service';
import { InjectModel } from '@nestjs/mongoose';
import { Activity, ActivityDocument } from 'src/activity/schema/activity.schema';
import { Model, Types } from 'mongoose';

export interface StudentSkillProfile {
  studentId: string;
  name: string;
  email: string;
  rollNumber: string;
  institute: string;
  academicDetails: {
    department: string;
    semester: number;
    cgpa: number;
  };
  skills: Array<{
    name: string;
    level: string; // 'beginner' | 'intermediate' | 'advanced'
    frequency: number; // how many times this skill appeared in activities/projects
  }>;
  activities: Array<{
    type: string;
    count: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    techStack: string[];
    date: string;
  }>;
}

@Injectable()
export class MindPioletService {
  private readonly logger = new Logger(MindPioletService.name);
  private readonly pythonBaseUrl = process.env.PYTHON_BASE_URL || 'http://127.0.0.1:8000';

  constructor(
    private readonly httpService: HttpService,
    private readonly studentService: StudentService,
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {}

  /**
   * Aggregate student data and skills for Mind Pilot features
   */
  async aggregateStudentSkillProfile(userId: string): Promise<StudentSkillProfile> {
    try {
      // Get student data with populated references
      const student = await this.studentService.getByUserId(userId);

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // Populate academic and user details
      await student.populate([
        { path: 'basicUserDetails', select: '-passwordHash' },
        { path: 'institute' },
        { path: 'academicDetails' },
      ]);

      // Get student's activities to extract skills
      const activities = await this.activityModel.find({
        student: student._id,
      }).exec();

      // Extract and aggregate skills from activities
      const skillsMap = new Map<string, { count: number; level?: string }>();

      activities.forEach((activity: any) => {
        if (activity.skills && Array.isArray(activity.skills)) {
          activity.skills.forEach((skill: string) => {
            const existing = skillsMap.get(skill);
            if (existing) {
              existing.count += 1;
            } else {
              skillsMap.set(skill, { count: 1 });
            }
          });
        }
      });

      // Determine skill levels based on frequency
      const skills = Array.from(skillsMap.entries()).map(([name, data]) => ({
        name,
        level: data.count >= 5 ? 'advanced' : data.count >= 3 ? 'intermediate' : 'beginner',
        frequency: data.count,
      }));

      // Aggregate activity types
      const activityTypesMap = new Map<string, number>();
      activities.forEach((activity: any) => {
        const type = activity.activityType || 'general';
        activityTypesMap.set(type, (activityTypesMap.get(type) || 0) + 1);
      });

      const activityTypes = Array.from(activityTypesMap.entries()).map(([type, count]) => ({
        type,
        count,
      }));

      // Build student skill profile
      const profile: StudentSkillProfile = {
        studentId: student._id.toString(),
        name: (student.basicUserDetails as any)?.name || '',
        email: (student.basicUserDetails as any)?.email || '',
        rollNumber: student.roll_number,
        institute: (student.institute as any)?.name || '',
        academicDetails: {
          department: (student.academicDetails as any)?.department || 'N/A',
          semester: (student.academicDetails as any)?.semester || 0,
          cgpa: (student.academicDetails as any)?.cgpa || 0,
        },
        skills,
        activities: activityTypes,
        achievements: [],
        projects: [],
      };

      // Extract projects from activities if they exist
      activities.forEach((activity: any) => {
        if (activity.activityType === 'project' || activity.type === 'project') {
          profile.projects.push({
            name: activity.title || 'Untitled Project',
            description: activity.description || '',
            techStack: activity.skills || [],
            date: activity.dateStart || new Date().toISOString(),
          });
        }

        // Extract achievements
        if (activity.activityType === 'achievement' || activity.type === 'achievement') {
          profile.achievements.push({
            title: activity.title || '',
            description: activity.description || '',
            date: activity.dateStart || new Date().toISOString(),
          });
        }
      });

      return profile;
    } catch (error) {
      this.logger.error(`Error aggregating student skills: ${error}`, error);
      throw error;
    }
  }

  /**
   * Get Mind Pilot data for logged-in student
   */
  async getMindPioletDataForStudent(userId: string) {
    try {
      const skillProfile = await this.aggregateStudentSkillProfile(userId);

      // Call Python backend with aggregated student data
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.pythonBaseUrl}/py/student/${skillProfile.studentId}/mind-piolet-data`,
          skillProfile,
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        ),
      );

      return {
        skillProfile,
        mindPioletData: response.data,
      };
    } catch (error) {
      this.logger.error(`Error fetching MindPilot data: ${error}`, error);
      throw error;
    }
  }

  /**
   * Chat with Mind Pilot using student context
   */
  async chatWithMindPilot(
    userId: string,
    message: string,
    role: string,
    feature: 'skill' | 'roadmap' | 'interview' | 'gap-finder' | 'guidance',
  ) {
    try {
      const skillProfile = await this.aggregateStudentSkillProfile(userId);

      if (!message || message.trim().length === 0) {
        throw new BadRequestException('Message cannot be empty');
      }

      // Determine Python endpoint based on feature
      const featureEndpoints: Record<string, string> = {
        skill: '/skill',
        roadmap: '/roadmap',
        interview: '/interview',
        'gap-finder': '/skill',
        guidance: '/skill',
      };

      const endpoint = featureEndpoints[feature] || '/chat';

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.pythonBaseUrl}${endpoint}`,
          {
            message,
            role: role || 'user',
            studentProfile: skillProfile,
            feature,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error in MindPilot chat: ${error}`, error);
      throw error;
    }
  }

  // Legacy endpoints (kept for backwards compatibility)
  async getMindPioletData(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://cb0510e92b7f.ngrok-free.app/py/student/${id}/mind-piolet-data`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          },
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error fetching MindPilot data: ${error}`, error);
      throw error;
    }
  }

  async chat(message: string, role: string, studentId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://doyle-unhumourous-mark.ngrok-free.dev/py/student/${studentId}/get-mindpiolet`,
          {
            message,
            role,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Error in MindPilot chat: ${error}`, error);
      throw error;
    }
  }

  create(createMindPioletDto: CreateMindPioletDto) {
    return 'This action adds a new mindPiolet';
  }

  findAll() {
    return `This action returns all mindPiolet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mindPiolet`;
  }

  update(id: number, updateMindPioletDto: UpdateMindPioletDto) {
    return `This action updates a #${id} mindPiolet`;
  }

  remove(id: number) {
    return `This action removes a #${id} mindPiolet`;
  }
}
