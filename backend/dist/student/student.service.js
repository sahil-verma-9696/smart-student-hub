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
var StudentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const student_schema_1 = require("./schema/student.schema");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
const enum_1 = require("../user/types/enum");
const fs = __importStar(require("fs"));
const csv = __importStar(require("fast-csv"));
const academic_service_1 = require("../academic/academic.service");
const constants_1 = require("./constants");
let StudentService = StudentService_1 = class StudentService {
    studentModel;
    userService;
    academicService;
    logger = new common_1.Logger(StudentService_1.name);
    constructor(studentModel, userService, academicService) {
        this.studentModel = studentModel;
        this.userService = userService;
        this.academicService = academicService;
    }
    async validateInstitute(instituteId) {
        if (!mongoose_2.Types.ObjectId.isValid(instituteId)) {
            throw new Error(`Invalid instituteId: ${instituteId}`);
        }
        const exists = await this.studentModel.db
            .collection('institutes')
            .findOne({ _id: new mongoose_2.Types.ObjectId(instituteId) });
        if (!exists) {
            throw new Error(`Institute not found for ID: ${instituteId}`);
        }
    }
    async createStudent(dto, session) {
        await this.studentModel.syncIndexes();
        await this.validateInstitute(dto.instituteId);
        const userDto = {
            name: dto.name,
            email: dto.email,
            password: dto.password,
            gender: dto.gender,
            role: enum_1.USER_ROLE.STUDENT,
            contactInfo: dto.contactInfo,
        };
        const user = await this.userService.createUser(userDto, session);
        const academic = await this.academicService.create({
            department: dto.department ?? null,
            backlogs: dto.backlogs ?? 0,
            studentId: null,
        });
        const createdStudent = await this.studentModel.create([
            {
                basicUserDetails: user._id,
                institute: new mongoose_2.Types.ObjectId(dto.instituteId),
                academicDetails: academic._id,
            },
        ], { session });
        const student = createdStudent[0];
        await this.academicService.updateStudentId(academic._id, student._id);
        return student.populate(['basicUserDetails', 'academicDetails']);
    }
    async bulkUploadStudents(csvPath) {
        const rows = await this.parseCsv(csvPath);
        const success = [];
        const failed = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const dto = this.mapCsvRowToStudentDto(row);
            try {
                const createdStudent = await this.createStudent(dto);
                success.push(createdStudent);
            }
            catch (err) {
                const reason = err instanceof Error
                    ? err.message
                    : typeof err === 'string'
                        ? err
                        : JSON.stringify(err);
                this.logger.error(`CSV row ${i + 1} FAILED | Email: ${dto.email} | Reason: ${reason}`);
                failed.push({ rowNumber: i + 1, row: dto, reason });
            }
        }
        await fs.promises
            .unlink(csvPath)
            .catch((err) => this.logger.warn(`Failed to delete CSV ${csvPath}: ${err}`));
        return {
            total: rows.length,
            successCount: success.length,
            failedCount: failed.length,
            success,
            failed,
        };
    }
    parseCsv(filePath) {
        const REQUIRED = Object.values(constants_1.CSV_FIELD_MAP)
            .filter((f) => f.required)
            .map((f) => f.csv);
        return new Promise((resolve, reject) => {
            const rows = [];
            let headersVerified = false;
            fs.createReadStream(filePath)
                .pipe(csv.parse({
                headers: true,
                ignoreEmpty: true,
            }))
                .on('headers', (headers) => {
                const missing = REQUIRED.filter((col) => !headers.includes(col));
                if (missing.length > 0) {
                    return reject(new Error(`CSV missing required columns: ${missing.join(', ')}`));
                }
                headersVerified = true;
            })
                .on('error', reject)
                .on('data', (data) => rows.push(data))
                .on('end', () => {
                if (!headersVerified) {
                    reject(new Error('CSV headers not detected.'));
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    mapCsvRowToStudentDto(row) {
        const mapped = {};
        for (const [key, conf] of Object.entries(constants_1.CSV_FIELD_MAP)) {
            mapped[key] = row[conf.csv]?.trim() ?? null;
        }
        return {
            name: mapped.name,
            email: mapped.email,
            password: mapped.password,
            gender: mapped.gender,
            instituteId: mapped.instituteId,
            department: mapped.department,
            backlogs: mapped.backlogs ? Number(mapped.backlogs) : 0,
            contactInfo: {
                phone: mapped.phone,
                alternatePhone: mapped.alternatePhone,
                address: mapped.address,
            },
        };
    }
    async getByUserId(userId) {
        const student = await this.studentModel
            .findOne({ basicUserDetails: new mongoose_2.Types.ObjectId(userId) })
            .populate(['basicUserDetails', 'academicDetails', 'institute'])
            .exec();
        if (!student) {
            throw new common_1.NotFoundException(`Student with basicUserDetails ${userId} not found`);
        }
        return student;
    }
    async getAllStudents() {
        return this.studentModel
            .find()
            .populate(['basicUserDetails', 'academicDetails'])
            .exec();
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = StudentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        academic_service_1.AcademicService])
], StudentService);
//# sourceMappingURL=student.service.js.map