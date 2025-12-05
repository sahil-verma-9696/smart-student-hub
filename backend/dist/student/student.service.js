"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const student_schema_1 = require("./schema/student.schema");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
const academic_service_1 = require("../academic/academic.service");
const create_student_admin_dto_1 = require("./dto/create-student-admin.dto");
const xlsx = __importStar(require("xlsx"));
let StudentService = class StudentService {
    studentModel;
    userService;
    academicService;
    constructor(studentModel, userService, academicService) {
        this.studentModel = studentModel;
        this.userService = userService;
        this.academicService = academicService;
    }
    async createProfile(userId, institute) {
        const student = await this.studentModel.create({
            basicUserDetails: userId,
            institute,
        });
        await student.save();
        await this.userService.updateUserProfile(userId, { studentId: student._id });
        return student;
    }
    async findById(id) {
        return this.studentModel.findById(id).lean();
    }
    async createStudentFromAdmin(dto) {
        console.log('DTO received:', dto);
        let createdUser = null;
        let createdAcademic = null;
        let createdStudent = null;
        try {
            createdUser = await this.userService.create({
                userId: dto.studentId,
                name: dto.name,
                email: dto.email,
                passwordHash: dto.email,
                gender: dto.gender,
                role: 'student',
                contactInfo: {
                    phone: dto.phone,
                },
            });
            createdAcademic = await this.academicService.create({
                course: dto.course,
                branch: dto.branch,
                year: parseInt(dto.year),
                universityId: '',
                semester: dto.semester,
                section: dto.section,
            });
            createdStudent = await this.studentModel.create({
                basicUserDetails: createdUser._id,
                acadmicDetails: createdAcademic._id,
                assignedFaculty: null,
                activities: [],
                instituteId: dto.institute,
            });
            await this.userService.updateUserProfile(createdUser._id.toString(), { studentId: createdStudent._id });
            const data = await this.studentModel
                .findById(createdStudent._id)
                .populate('basicUserDetails', '-passwordHash')
                .populate('acadmicDetails');
            return data;
        }
        catch (err) {
            console.error('createStudentFromAdmin failed, cleaning up partially created resources:', err);
            try {
                if (createdStudent && createdStudent._id) {
                    await this.studentModel.findByIdAndDelete(createdStudent._id).exec();
                }
            }
            catch (e) {
                console.error('Failed to remove created student during cleanup:', e);
            }
            try {
                if (createdAcademic && createdAcademic._id) {
                    await this.academicService.remove(createdAcademic._id.toString());
                }
            }
            catch (e) {
                console.error('Failed to remove created academic during cleanup:', e);
            }
            try {
                if (createdUser && createdUser._id) {
                    await this.userService.remove(createdUser._id.toString());
                }
            }
            catch (e) {
                console.error('Failed to remove created user during cleanup:', e);
            }
            throw err;
        }
    }
    async create(dto) {
        dto.studentId = (dto.studentId || '').toString();
        dto.name = (dto.name || '').toString();
        dto.email = (dto.email || '').toString();
        dto.phone = dto.phone ? String(dto.phone) : '';
        dto.course = (dto.course || '').toString();
        dto.branch = (dto.branch || '').toString();
        dto.year = (dto.year || '').toString();
        dto.semester = (dto.semester || '').toString();
        dto.section = (dto.section || '').toString();
        let createdUser = null;
        let createdAcademic = null;
        let createdStudent = null;
        try {
            createdUser = await this.userService.create({
                userId: dto.studentId,
                name: dto.name,
                email: dto.email,
                passwordHash: dto.email,
                gender: dto.gender,
                role: 'student',
                contactInfo: {
                    phone: dto.phone,
                },
            });
            createdAcademic = await this.academicService.create({
                course: dto.course,
                branch: dto.branch,
                year: parseInt(dto.year) || 0,
                universityId: '',
                semester: dto.semester,
                section: dto.section,
            });
            createdStudent = await this.studentModel.create({
                basicUserDetails: createdUser._id,
                acadmicDetails: createdAcademic._id,
                assignedFaculty: null,
                activities: [],
                instituteId: dto.institute,
            });
            await this.userService.updateUserProfile(createdUser._id.toString(), { studentId: createdStudent._id });
            const data = await this.studentModel
                .findById(createdStudent._id)
                .populate('basicUserDetails', '-passwordHash')
                .populate('acadmicDetails');
            return data;
        }
        catch (err) {
            console.error('Student.create failed, cleaning up:', err);
            try {
                if (createdStudent && createdStudent._id) {
                    await this.studentModel.findByIdAndDelete(createdStudent._id).exec();
                }
            }
            catch (e) {
                console.error('Failed to cleanup createdStudent', e);
            }
            try {
                if (createdAcademic && createdAcademic._id) {
                    await this.academicService.remove(createdAcademic._id.toString());
                }
            }
            catch (e) {
                console.error('Failed to cleanup createdAcademic', e);
            }
            try {
                if (createdUser && createdUser._id) {
                    await this.userService.remove(createdUser._id.toString());
                }
            }
            catch (e) {
                console.error('Failed to cleanup createdUser', e);
            }
            throw err;
        }
    }
    async uploadBulk(file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file received');
        }
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        const createdStudents = [];
        const errors = [];
        for (const row of data) {
            try {
                const dto = new create_student_admin_dto_1.CreateStudentAdminDto();
                dto.studentId = row['studentId'] || row['Student ID'] || row['StudentID'];
                dto.name = row['name'] || row['Name'];
                dto.email = row['email'] || row['Email'];
                const genderValue = row['gender'] || row['Gender'];
                dto.gender = genderValue?.toString().toLowerCase();
                const phoneValue = row['phone'] || row['Phone'];
                dto.phone = String(phoneValue);
                dto.course = row['course'] || row['Course'];
                dto.branch = row['branch'] || row['Branch'];
                dto.year = String(row['year'] || row['Year']);
                dto.semester = String(row['semester'] || row['Semester']);
                dto.section = String(row['section'] || row['Section']);
                dto.institute = user.instituteId;
                const missing = [];
                if (!dto.studentId)
                    missing.push('studentId');
                if (!dto.name)
                    missing.push('name');
                if (!dto.email)
                    missing.push('email');
                if (!dto.gender)
                    missing.push('gender');
                if (!dto.phone)
                    missing.push('phone');
                if (!dto.course)
                    missing.push('course');
                if (!dto.branch)
                    missing.push('branch');
                if (!dto.year)
                    missing.push('year');
                if (!dto.semester)
                    missing.push('semester');
                if (!dto.section)
                    missing.push('section');
                if (missing.length > 0) {
                    errors.push({ student: row, error: `Missing required fields: ${missing.join(', ')}` });
                    continue;
                }
                const validGenders = ['male', 'female', 'other'];
                if (!validGenders.includes(dto.gender)) {
                    errors.push({ student: row, error: `Invalid gender value: ${dto.gender}` });
                    continue;
                }
                const createdStudent = await this.create(dto);
                if (createdStudent) {
                    createdStudents.push(createdStudent);
                }
            }
            catch (error) {
                console.error('Student bulk upload error:', error);
                errors.push({ student: row, error: error.message || String(error) });
            }
        }
        return {
            message: 'Bulk upload completed',
            createdCount: createdStudents.length,
            errorCount: errors.length,
            errors,
        };
    }
    async findAll() {
        return await this.studentModel
            .find()
            .populate('basicUserDetails', '-passwordHash')
            .populate('acadmicDetails');
    }
    async findOne(id) {
        return await this.studentModel.findById(id).populate('basicUserDetails').populate('acadmicDetails');
    }
    async update(id, updateStudentDto) {
        const student = await this.studentModel.findById(id).populate('acadmicDetails').populate('basicUserDetails');
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
        }
        const userFields = {};
        if (updateStudentDto.name)
            userFields.name = updateStudentDto.name;
        if (updateStudentDto.email)
            userFields.email = updateStudentDto.email;
        if (updateStudentDto.phone) {
            userFields['contactInfo.phone'] = updateStudentDto.phone;
        }
        if (Object.keys(userFields).length > 0) {
            const userId = student.basicUserDetails?._id;
            if (userId) {
                await this.userService.updateUserProfile(userId.toString(), userFields);
            }
        }
        const academicFields = {};
        if (updateStudentDto.course)
            academicFields.course = updateStudentDto.course;
        if (updateStudentDto.branch)
            academicFields.branch = updateStudentDto.branch;
        if (updateStudentDto.year)
            academicFields.year = updateStudentDto.year;
        if (updateStudentDto.semester)
            academicFields.semester = updateStudentDto.semester;
        if (updateStudentDto.section)
            academicFields.section = updateStudentDto.section;
        if (Object.keys(academicFields).length > 0) {
            const academicId = student.acadmicDetails?._id;
            if (academicId) {
                await this.academicService.update(academicId.toString(), academicFields);
            }
        }
        return await this.studentModel
            .findById(id)
            .populate('basicUserDetails', '-passwordHash')
            .populate('acadmicDetails');
    }
    async remove(id) {
        const session = await this.studentModel.db.startSession();
        try {
            let resultMessage = '';
            await session.withTransaction(async () => {
                const student = await this.studentModel
                    .findById(id)
                    .populate('basicUserDetails')
                    .populate('acadmicDetails')
                    .session(session)
                    .exec();
                if (!student) {
                    throw new common_1.BadRequestException('Student not found');
                }
                const userId = student.basicUserDetails?._id;
                const academicId = student.acadmicDetails?._id;
                if (userId) {
                    await this.userService.remove(userId.toString(), session);
                }
                if (academicId) {
                    await this.academicService.remove(academicId.toString(), session);
                }
                await this.studentModel.findByIdAndDelete(id, { session }).exec();
                resultMessage = 'Student & associated user and academic records deleted successfully';
            });
            return resultMessage;
        }
        finally {
            await session.endSession();
        }
    }
    async addActivity(studentId, activityId) {
        return this.studentModel.findByIdAndUpdate(studentId, { $push: { activities: activityId } }, { new: true });
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        academic_service_1.AcademicService])
], StudentService);
//# sourceMappingURL=student.service.js.map