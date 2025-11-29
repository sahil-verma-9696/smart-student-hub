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
    async createProfile(userId) {
        const student = await this.studentModel.create({
            basicUserDetails: userId,
        });
        await student.save();
        return student;
    }
    async create(userId) {
        return this.createProfile(userId);
    }
    async createStudentFromAdmin(dto) {
        console.log('DTO received:', dto);
        const user = await this.userService.create({
            userId: dto.studentId,
            name: dto.name,
            email: dto.email,
            passwordHash: dto.email,
            gender: dto.gender,
            role: 'student',
            contactInfo: {
                phone: dto.phone,
            },
            instituteId: dto.instituteId
        });
        const academic = await this.academicService.create({
            course: dto.course,
            branch: dto.branch,
            year: parseInt(dto.year),
            universityId: '',
            semester: dto.semester,
            section: dto.section,
        });
        const student = await this.studentModel.create({
            basicUserDetails: user._id,
            acadmicDetails: academic._id,
            assignedFaculty: null,
            activities: [],
        });
        const data = await this.studentModel
            .findById(student._id)
            .populate('basicUserDetails', '-passwordHash')
            .populate('acadmicDetails');
        return data;
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
                dto.studentId = row['studentId'];
                dto.name = row['name'];
                dto.email = row['email'];
                dto.gender = row['gender'];
                dto.phone = row['phone'];
                dto.course = row['course'];
                dto.branch = row['branch'];
                dto.year = row['year'];
                dto.semester = row['semester'];
                dto.section = row['section'];
                dto.instituteId = user.instituteId;
                const createdStudent = await this.createStudentFromAdmin(dto);
                if (createdStudent) {
                    createdStudents.push(createdStudent);
                }
            }
            catch (error) {
                errors.push({ student: row, error: error.message });
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
        return await this.studentModel.findById(id).populate('basicUserDetails');
    }
    async update(id, updateStudentDto) {
        return await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true });
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