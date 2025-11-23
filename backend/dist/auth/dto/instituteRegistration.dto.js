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
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../institute/types/enum");
const contact_info_dto_1 = require("../../user/dto/contact-info.dto");
class InstituteRegistrationDto {
    institute_name;
    institute_type;
    official_email;
    official_phone;
    address_line1;
    city;
    state;
    pincode;
    admin_name;
    admin_email;
    admin_password;
    admin_gender;
    admin_contactInfo;
    is_affiliated;
    affiliation_university;
    affiliation_id;
}
exports.default = InstituteRegistrationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "institute_name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.InstituteType),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "institute_type", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "official_email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "official_phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "address_line1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "pincode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "admin_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "admin_email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "admin_password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['male', 'female', 'other']),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "admin_gender", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => contact_info_dto_1.ContactInfoDto),
    __metadata("design:type", contact_info_dto_1.ContactInfoDto)
], InstituteRegistrationDto.prototype, "admin_contactInfo", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InstituteRegistrationDto.prototype, "is_affiliated", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "affiliation_university", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InstituteRegistrationDto.prototype, "affiliation_id", void 0);
//# sourceMappingURL=instituteRegistration.dto.js.map