"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstituteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_institute_dto_1 = __importDefault(require("./create-institute.dto"));
class UpdateInstituteDto extends (0, mapped_types_1.PartialType)(create_institute_dto_1.default) {
}
exports.UpdateInstituteDto = UpdateInstituteDto;
//# sourceMappingURL=update-institute.dto.js.map