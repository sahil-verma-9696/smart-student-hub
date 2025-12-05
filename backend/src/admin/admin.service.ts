import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model, Types } from 'mongoose';
import { Student } from 'src/student/schema/student.schema';
import { Faculty } from 'src/faculty/schemas/faculty.schema';
import { Program } from 'src/program/schema/program.schema';
import { Activity } from 'src/activity/schema/activity.schema';
import { User } from 'src/user/schema/user.schema';
import { Academic } from 'src/academic/schema/academic.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Faculty.name) private facultyModel: Model<Faculty>,
    @InjectModel(Program.name) private programModel: Model<Program>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Academic.name) private academicModel: Model<Academic>,
  ) { }

  // Create admin profile only (used by auth service)
  async createProfile(userId: string, institute: string) {
    const admin = await this.adminModel.create({
      basicUserDetails: userId,
      institute,
    });
    await admin.save();
    return admin;
  }

  // Legacy method name for compatibility
  async create(userId: string, institute: string) {
    return this.createProfile(userId, institute);
  }

  // Find admin by ID
  async findById(id: string) {
    return this.adminModel.findById(id).lean();
  }

  // Get dashboard statistics
  async getDashboardStats(institute: string) {
    const [studentCount, facultyCount, programCount, activityCount] = await Promise.all([
      this.studentModel.countDocuments({ institute }),
      this.facultyModel.countDocuments({ institute }),
      this.programModel.countDocuments({ institute }),
      this.activityModel.countDocuments({ institute }),
    ]);

    // Get unique departments from programs
    const programs = await this.programModel.find({ institute });
    const uniqueDepartments = new Set(programs.map(p => p.branch).filter(Boolean));

    return {
      totalStudents: studentCount,
      totalFaculty: facultyCount,
      totalPrograms: programCount,
      departments: uniqueDepartments.size,
      pendingRequests: activityCount, // or customize this based on your needs
    };
  }

  // Get analytics data for charts
  async getAnalyticsData(institute: string) {
    const instId = new Types.ObjectId(institute);

    // 1. Department-wise Student Distribution
    const studentDeptStats = await this.studentModel.aggregate([
      { $match: { institute: instId } },
      {
        $lookup: {
          from: 'academics',
          localField: 'acadmicDetails',
          foreignField: '_id',
          as: 'academic'
        }
      },
      { $unwind: { path: '$academic', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$academic.branch',
          count: { $sum: 1 }
        }
      }
    ]);

    // 2. Year-wise Student Strength
    const studentYearStats = await this.studentModel.aggregate([
      { $match: { institute: instId } },
      {
        $lookup: {
          from: 'academics',
          localField: 'acadmicDetails',
          foreignField: '_id',
          as: 'academic'
        }
      },
      { $unwind: { path: '$academic', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$academic.year',
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Faculty Distribution by Department
    const facultyDeptStats = await this.facultyModel.aggregate([
      { $match: { institute: instId } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Activity Growth (using creation date) - Last 5 years
    const currentYear = new Date().getFullYear();
    const activityGrowthStats = await this.activityModel.aggregate([
      { $match: { institute: instId } },
      {
        $project: {
          year: { $year: '$createdAt' }
        }
      },
      {
        $match: {
          year: { $gte: currentYear - 4 }
        }
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format data for frontend
    return {
      studentDistribution: studentDeptStats.map(s => ({ x: s._id || 'Unknown', y: s.count })),
      studentYearlyStrength: studentYearStats.map(s => ({ x: s._id ? `${s._id}` : 'Unknown', y: s.count })),
      facultyDistribution: facultyDeptStats.map(f => ({ x: f._id || 'Unknown', y: f.count })),
      activityGrowth: activityGrowthStats.map(a => ({ x: `${a._id}`, y: a.count })),
      // Dummy data for attendance as we don't have it yet
      attendanceTrend: [
        { x: "Jan", y: 75 },
        { x: "Feb", y: 78 },
        { x: "Mar", y: 80 },
        { x: "Apr", y: 85 },
        { x: "May", y: 86 }
      ]
    };
  }

  // Get recent registrations (last 10)
  async getRecentRegistrations(institute: string) {
    const [recentStudents, recentFaculty] = await Promise.all([
      this.studentModel
        .find({ institute })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('basicUserDetails', 'name email userId')
        .lean(),
      this.facultyModel
        .find({ institute })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('basicUserDetails', 'name email userId')
        .lean(),
    ]);

    // Combine and sort by date
    const combined = [
      ...recentStudents.map(s => ({
        id: s._id.toString(),
        name: (s.basicUserDetails as any)?.name || 'Unknown',
        role: 'Student',
        email: (s.basicUserDetails as any)?.email || '',
        userId: (s.basicUserDetails as any)?.userId || '',
        date: (s as any).createdAt,
      })),
      ...recentFaculty.map(f => ({
        id: f._id.toString(),
        name: (f.basicUserDetails as any)?.name || 'Unknown',
        role: 'Faculty',
        email: (f.basicUserDetails as any)?.email || '',
        userId: (f.basicUserDetails as any)?.userId || '',
        date: (f as any).createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return combined;
  }

  // Get recent activities (last 10)
  async getRecentActivities(institute: string) {
    const activities = await this.activityModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: 'student',
        populate: { path: 'basicUserDetails', select: 'name' }
      })
      .lean();

    return activities.map(act => ({
      id: (act as any)._id.toString(),
      action: act.description || act.title || 'Activity performed',
      time: this.getRelativeTime((act as any).createdAt),
      user: 'Student',
      type: 'activity',
    }));
  }

  // Helper to get relative time
  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) return `${days} days ago`;
    if (days === 1) return 'Yesterday';
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
}
