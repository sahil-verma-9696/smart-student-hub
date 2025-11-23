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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const institute_registration_dto_1 = __importDefault(require("./dto/institute-registration.dto"));
const student_registration_body_dto_1 = __importDefault(require("./dto/student-registration-body.dto"));
const user_login_body_dto_1 = require("./dto/user-login-body.dto.");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        const res = await this.authService.instituteRegistration(body);
        return { ...res.data, msg: res.msg };
    }
    userLogin(userLoginDto) {
        return this.authService.userLogin(userLoginDto);
    }
    async studentRegistration(body, instituteId) {
        const res = await this.authService.studentRegistration(body, instituteId);
        return { ...res.data, msg: res.msg };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('institute/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [institute_registration_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('user/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_body_dto_1.UserLoginBodyDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "userLogin", null);
__decorate([
    (0, common_1.Post)('student/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('instituteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_registration_body_dto_1.default, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "studentRegistration", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map