"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const enum_1 = require("../user/types/enum");
let StudentService = class StudentService {
    studentModel;
    userService;
    constructor(studentModel, userService) {
        this.studentModel = studentModel;
        this.userService = userService;
    }
    async create(dto, session) {
        const userDto = {
            name: dto.name,
            email: dto.email,
            password: dto.password,
            gender: dto.gender,
            role: enum_1.USER_ROLE.STUDENT,
            contactInfo: dto.contactInfo,
        };
        const user = await this.userService.createUser(userDto, session);
        const created = await this.studentModel.create([
            {
                basicUserDetails: user._id,
                institute: dto.instituteId
                    ? new mongoose_2.Types.ObjectId(dto.instituteId)
                    : null,
            },
        ], { session });
        return created[0];
    }
    async getByUserId(userId) {
        const student = (await this.studentModel
            .findOne({ basicUserDetails: userId })
            .populate('basicUserDetails')
            .populate('institute')
            .exec());
        if (!student) {
            throw new common_1.NotFoundException(`Student with userId ${userId} not found`);
        }
        return student;
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], StudentService);
//# sourceMappingURL=student.service.js.map