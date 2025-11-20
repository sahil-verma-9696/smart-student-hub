"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteModule = void 0;
const common_1 = require("@nestjs/common");
const institute_service_1 = require("./institute.service");
const institute_controller_1 = require("./institute.controller");
const mongoose_1 = require("@nestjs/mongoose");
const institute_schema_1 = require("./schemas/institute.schema");
let InstituteModule = class InstituteModule {
};
exports.InstituteModule = InstituteModule;
exports.InstituteModule = InstituteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: institute_schema_1.Institute.name, schema: institute_schema_1.InstituteSchema },
            ]),
        ],
        controllers: [institute_controller_1.InstituteController],
        providers: [institute_service_1.InstituteService],
    })
], InstituteModule);
//# sourceMappingURL=institute.module.js.map