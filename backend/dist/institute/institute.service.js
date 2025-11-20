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
exports.InstituteService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const institute_schema_1 = require("./schemas/institute.schema");
const mongoose_2 = require("mongoose");
let InstituteService = class InstituteService {
    instituteModel;
    constructor(instituteModel) {
        this.instituteModel = instituteModel;
    }
    async create(createInstituteDto) {
        const newInstitute = new this.instituteModel(createInstituteDto);
        await newInstitute.save();
        return newInstitute;
    }
    findAll() {
        return `This action returns all institute`;
    }
    findOne(id) {
        return `This action returns a #${id} institute`;
    }
    update(id, updateInstituteDto) {
        return `This action updates a #${id} institute`;
    }
    remove(id) {
        return `This action removes a #${id} institute`;
    }
};
exports.InstituteService = InstituteService;
exports.InstituteService = InstituteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(institute_schema_1.Institute.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InstituteService);
//# sourceMappingURL=institute.service.js.map