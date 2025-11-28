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
exports.InstituteService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const institute_schema_1 = __importDefault(require("./schemas/institute.schema"));
const mongoose_2 = require("mongoose");
let InstituteService = class InstituteService {
    instituteModel;
    constructor(instituteModel) {
        this.instituteModel = instituteModel;
    }
    async create(createInstituteDto) {
        const instituteExists = await this.instituteModel.findOne({
            official_email: createInstituteDto.official_email,
        });
        if (instituteExists) {
            throw new Error('Institute already exists');
        }
        const newInstitute = new this.instituteModel(createInstituteDto);
        await newInstitute.save();
        return newInstitute;
    }
    async createInstitute(dto, session) {
        const created = await this.instituteModel.create([dto], { session });
        return created[0];
    }
    async getInstituteById(instituteId, session) {
        const institute = await this.instituteModel
            .findById(instituteId)
            .session(session ?? null);
        if (!institute) {
            throw new common_1.NotFoundException('Institute not found');
        }
        return institute;
    }
    async addAdminToInstitute(instituteId, adminId, session) {
        const updatedInstitute = await this.instituteModel
            .findByIdAndUpdate(instituteId, { $addToSet: { admins: new mongoose_2.Types.ObjectId(adminId) } }, { new: true, session })
            .populate('admins')
            .session(session ?? null);
        if (!updatedInstitute) {
            throw new common_1.NotFoundException(`Institute ${instituteId} not found`);
        }
        return updatedInstitute;
    }
};
exports.InstituteService = InstituteService;
exports.InstituteService = InstituteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(institute_schema_1.default.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InstituteService);
//# sourceMappingURL=institute.service.js.map