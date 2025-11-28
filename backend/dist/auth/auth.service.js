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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const institute_service_1 = require("../institute/institute.service");
const user_service_1 = require("../user/user.service");
const admin_service_1 = require("../admin/admin.service");
const jwt_1 = require("@nestjs/jwt");
const student_service_1 = require("../student/student.service");
const faculty_service_1 = require("../faculty/faculty.service");
let AuthService = class AuthService {
    instituteService;
    adminService;
    userService;
    jwtService;
    studentService;
    facultyService;
    constructor(instituteService, adminService, userService, jwtService, studentService, facultyService) {
        this.instituteService = instituteService;
        this.adminService = adminService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }
    async registerInstitute(dto) {
        console.log(dto, 'dto');
        const createAdminDto = {
            contactInfo: dto.admin_contactInfo,
            email: dto.admin_email,
            gender: dto.admin_gender,
            name: dto.admin_name,
            password: dto.admin_password,
        };
        const admin = await this.adminService.createAdmin(createAdminDto);
        const createInstituteDto = {
            address_line1: dto.inst_address_line1,
            city: dto.inst_city,
            institute_name: dto.inst_name,
            institute_type: dto.inst_type,
            official_email: dto.inst_email,
            official_phone: dto.inst_phone,
            pincode: dto.inst_pincode,
            state: dto.inst_state,
            is_affiliated: dto.inst_is_affiliated,
            affiliation_id: dto.inst_affiliation_id,
            affiliation_university: dto.inst_affiliation_university,
        };
        const institute = await this.instituteService.createInstitute(createInstituteDto);
        const joinedAdmin = await this.adminService.joinInstitute(admin._id.toString(), institute._id.toString());
        if (!joinedAdmin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const user = joinedAdmin.basicUserDetails;
        const payload = {
            email: user.email,
            name: user.name,
            role: user.role,
            instituteId: joinedAdmin.institute._id.toString(),
            sub: joinedAdmin._id.toString(),
            userId: joinedAdmin._id.toString(),
        };
        const token = this.jwtService.sign(payload);
        return {
            user: joinedAdmin,
            institute,
            token,
            expires_in: process.env.JWT_EXPIRES_IN_MILI,
            msg: 'Institute Successfully Registered',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [institute_service_1.InstituteService,
        admin_service_1.AdminService,
        user_service_1.UserService,
        jwt_1.JwtService,
        student_service_1.StudentService,
        faculty_service_1.FacultyService])
], AuthService);
//# sourceMappingURL=auth.service.js.map