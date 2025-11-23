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
exports.InstituteSchema = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_enum_1 = require("../../auth/types/auth.enum");
let Institute = class Institute extends mongoose_2.Document {
    institute_name;
    institute_type;
    official_email;
    official_phone;
    address_line1;
    city;
    state;
    pincode;
    is_affiliated;
    affiliation_university;
    affiliation_id;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "institute_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(auth_enum_1.InstituteType),
    }),
    __metadata("design:type", String)
], Institute.prototype, "institute_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, lowercase: true, unique: true }),
    __metadata("design:type", String)
], Institute.prototype, "official_email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "official_phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "address_line1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "pincode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Institute.prototype, "is_affiliated", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Institute.prototype, "affiliation_university", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Institute.prototype, "affiliation_id", void 0);
Institute = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Institute);
exports.default = Institute;
exports.InstituteSchema = mongoose_1.SchemaFactory.createForClass(Institute);
//# sourceMappingURL=institute.schema.js.map