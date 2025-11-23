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
let AuthService = class AuthService {
    instituteService;
    adminService;
    userService;
    jwtService;
    constructor(instituteService, adminService, userService, jwtService) {
        this.instituteService = instituteService;
        this.adminService = adminService;
        this.userService = userService;
        this.jwtService = jwtService;
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
        const token = this.jwtService.sign({
            user_id: user._id,
            institute_id: institute._id,
            role: 'admin',
        });
        return {
            data: {
                institute,
                admin,
                user,
                token,
            },
            msg: 'Institute Successfully Registered',
        };
    }
    async studentRegistration(data) {
        const studentData = { ...data, role: 'student' };
        return {
            data: { studentData },
            msg: 'Student Successfully Registered',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [institute_service_1.InstituteService,
        admin_service_1.AdminService,
        user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map