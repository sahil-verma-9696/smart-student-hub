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
const class_validator_1 = require("class-validator");
const enum_1 = require("../types/enum");
class CreateInstituteDto {
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
}
exports.default = CreateInstituteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9 .&()-]+$/, {
        message: 'Institute name contains invalid characters',
    }),
    (0, class_validator_1.Length)(3, 100, { message: 'Institute name must be between 3 and 100 characters' }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "institute_name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.InstituteType, { message: 'Invalid institute type' }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "institute_type", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid official email format' }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "official_email", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^(?:(\+91[\s-]?)?[6-9]\d{9})$/, {
        message: 'Invalid official phone number',
    }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "official_phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9 ,.-/()]+$/, {
        message: 'Address contains invalid characters',
    }),
    (0, class_validator_1.Length)(3, 120),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "address_line1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z ]+$/, {
        message: 'City must contain letters only',
    }),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z ]+$/, {
        message: 'State must contain letters only',
    }),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: 'Pincode must be a 6-digit number' }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "pincode", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInstituteDto.prototype, "is_affiliated", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.is_affiliated === true),
    (0, class_validator_1.IsString)({ message: 'Affiliation university is required when affiliated' }),
    (0, class_validator_1.Matches)(/^[A-Za-z .&()-]+$/, {
        message: 'Affiliation university contains invalid characters',
    }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "affiliation_university", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.is_affiliated === true),
    (0, class_validator_1.IsString)({ message: 'Affiliation ID is required when affiliated' }),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9-_/]+$/, {
        message: 'Affiliation ID contains invalid characters',
    }),
    __metadata("design:type", String)
], CreateInstituteDto.prototype, "affiliation_id", void 0);
//# sourceMappingURL=create-institute.dto.js.map