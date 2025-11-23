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
exports.InstituteController = void 0;
const common_1 = require("@nestjs/common");
const institute_service_1 = require("./institute.service");
const create_institute_dto_1 = __importDefault(require("./dto/create-institute.dto"));
const update_institute_dto_1 = require("./dto/update-institute.dto");
let InstituteController = class InstituteController {
    instituteService;
    constructor(instituteService) {
        this.instituteService = instituteService;
    }
    create(createInstituteDto) {
        return this.instituteService.create(createInstituteDto);
    }
    findAll() {
        return this.instituteService.findAll();
    }
    findOne(id) {
        return this.instituteService.findOne(+id);
    }
    update(id, updateInstituteDto) {
        return this.instituteService.update(+id, updateInstituteDto);
    }
    remove(id) {
        return this.instituteService.remove(+id);
    }
};
exports.InstituteController = InstituteController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_institute_dto_1.default]),
    __metadata("design:returntype", void 0)
], InstituteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InstituteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstituteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_institute_dto_1.UpdateInstituteDto]),
    __metadata("design:returntype", void 0)
], InstituteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstituteController.prototype, "remove", null);
exports.InstituteController = InstituteController = __decorate([
    (0, common_1.Controller)('institute'),
    __metadata("design:paramtypes", [institute_service_1.InstituteService])
], InstituteController);
//# sourceMappingURL=institute.controller.js.map