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
exports.InstituteSchema = exports.Institute = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const auth_enum_1 = require("../../auth/types/auth.enum");
let Institute = class Institute {
    name;
    isAffiliated;
    affiliation;
    state;
    country;
    type;
};
exports.Institute = Institute;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Institute.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Institute.prototype, "isAffiliated", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Institute.prototype, "affiliation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Institute.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Institute.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: auth_enum_1.InstituteType.Private }),
    __metadata("design:type", String)
], Institute.prototype, "type", void 0);
exports.Institute = Institute = __decorate([
    (0, mongoose_1.Schema)()
], Institute);
exports.InstituteSchema = mongoose_1.SchemaFactory.createForClass(Institute);
//# sourceMappingURL=institute.schema.js.map