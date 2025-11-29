"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModule = void 0;
const common_1 = require("@nestjs/common");
const student_service_1 = require("./student.service");
const student_controller_1 = require("./student.controller");
const mongoose_1 = require("@nestjs/mongoose");
const student_schema_1 = require("./schema/student.schema");
const user_module_1 = require("../user/user.module");
const academic_module_1 = require("../academic/academic.module");
const faculty_schema_1 = require("../faculty/schemas/faculty.schema");
const activity_schema_1 = require("../activity/schema/activity.schema");
let StudentModule = class StudentModule {
};
exports.StudentModule = StudentModule;
exports.StudentModule = StudentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: student_schema_1.Student.name, schema: student_schema_1.StudentSchema },
                { name: faculty_schema_1.Faculty.name, schema: faculty_schema_1.FacultySchema },
                { name: activity_schema_1.Activity.name, schema: activity_schema_1.ActivitySchema }
            ]),
            user_module_1.UserModule,
            academic_module_1.AcademicModule,
        ],
        controllers: [student_controller_1.StudentController],
        providers: [student_service_1.StudentService],
        exports: [student_service_1.StudentService],
    })
], StudentModule);
//# sourceMappingURL=student.module.js.map