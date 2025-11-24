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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const institute_registration_body_dto_1 = __importDefault(require("./dto/institute-registration-body.dto"));
const student_registration_body_dto_1 = __importDefault(require("./dto/student-registration-body.dto"));
const user_login_body_dto_1 = require("./dto/user-login-body.dto.");
const faculty_registration_body_dto_1 = __importDefault(require("./dto/faculty-registration-body.dto"));
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const authType = __importStar(require("./types/auth.type"));
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        return await this.authService.instituteRegistration(body);
    }
    userLogin(userLoginDto) {
        return this.authService.userLogin(userLoginDto);
    }
    async studentRegistration(body, instituteId) {
        return await this.authService.studentRegistration(body, instituteId);
    }
    async facultyRegistration(body, institueId) {
        return await this.authService.facultyRegistration(body, institueId);
    }
    getMe(req) {
        return this.authService.me(req.user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('institute/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [institute_registration_body_dto_1.default]),
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
__decorate([
    (0, common_1.Post)('faculty/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('instituteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faculty_registration_body_dto_1.default, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facultyRegistration", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map