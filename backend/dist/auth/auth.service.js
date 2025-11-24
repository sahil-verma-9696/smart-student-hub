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
    async instituteRegistration(data) {
        const { admin_name, admin_email, admin_password, admin_contactInfo, admin_gender, ...instituteData } = data || {};
        const institute = await this.instituteService.create(instituteData);
        const user = await this.userService.create({
            userId: institute._id.toString(),
            email: admin_email,
            passwordHash: admin_password,
            name: admin_name,
            role: 'admin',
            contactInfo: admin_contactInfo,
            gender: admin_gender,
            instituteId: institute._id.toString(),
        });
        const admin = await this.adminService.create(user._id.toString());
        const { passwordHash, ...sanitizedUser } = user.toObject();
        const payload = this.buildJwtPayload(user);
        const token = this.jwtService.sign(payload);
        return {
            institute,
            admin,
            user,
            token,
            expires_in: process.env.JWT_EXPIRES_IN_MILI,
            msg: 'Institute Successfully Registered',
        };
    }
    async studentRegistration(data, instituteId) {
        const { password } = data || {};
        const user = await this.userService.create({
            passwordHash: password,
            userId: '22CSME017',
            instituteId,
            contactInfo: data.contactInfo,
            email: data.email,
            name: data.name,
            role: 'student',
            gender: data.gender,
        });
        const studentData = await this.studentService.create(user._id.toString());
        const { passwordHash, ...sanitizedUser } = user.toObject();
        const payload = this.buildJwtPayload(user);
        const token = this.jwtService.sign(payload);
        return {
            user: sanitizedUser,
            studentData,
            token,
            expires_in: process.env.JWT_EXPIRES_IN_MILI,
            msg: 'Student Successfully Registered',
        };
    }
    async facultyRegistration(data, instituteId) {
        const { password } = data;
        const user = await this.userService.create({
            userId: 'FAC001',
            email: data.email,
            name: data.name,
            gender: data.gender,
            contactInfo: data.contactInfo,
            passwordHash: password,
            role: 'faculty',
            instituteId,
        });
        const faculty = await this.facultyService.create(user._id.toString());
        const { passwordHash, ...sanitizedUser } = user.toObject();
        const payload = this.buildJwtPayload(user);
        const token = this.jwtService.sign(payload);
        return {
            user: sanitizedUser,
            faculty,
            token,
            expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
            msg: 'Faculty Successfully Registered',
        };
    }
    async userLogin(userLoginDto) {
        const { email, password } = userLoginDto;
        if (!email || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const { passwordHash, ...sanitizedUser } = user.toObject();
        const payload = this.buildJwtPayload(user);
        const token = this.jwtService.sign(payload);
        return {
            user: sanitizedUser,
            token,
            expires_in: Number(process.env.JWT_EXPIRES_IN_MILI),
            msg: `User ${user.name} (role: ${user.role}) successfully logged in`,
        };
    }
    async me(user) {
        const userData = await this.userService.findById(user.sub);
        return {
            userData,
            payload: user,
            msg: `User ${userData?.name} (role: ${userData?.role}) successfully logged in`,
        };
    }
    buildJwtPayload(user) {
        return {
            sub: user._id.toString(),
            userId: user.userId,
            email: user.email,
            role: user.role,
            instituteId: user.instituteId.toString(),
            name: user.name,
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