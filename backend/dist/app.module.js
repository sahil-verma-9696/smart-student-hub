"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const mongoose_1 = require("@nestjs/mongoose");
const student_module_1 = require("./student/student.module");
const institute_module_1 = require("./institute/institute.module");
const faculty_module_1 = require("./faculty/faculty.module");
const admin_module_1 = require("./admin/admin.module");
const up_docs_module_1 = require("./up-docs/up-docs.module");
const attachment_module_1 = require("./attachment/attachment.module");
const program_module_1 = require("./program/program.module");
const notifications_module_1 = require("./notifications/notifications.module");
const activity_module_1 = require("./activity/activity.module");
const activity_type_module_1 = require("./activity-type/activity-type.module");
const activity_assignment_module_1 = require("./activity-assignment/activity-assignment.module");
const activity_type_assignment_module_1 = require("./activity-type-assignment/activity-type-assignment.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            auth_module_1.AuthModule,
            student_module_1.StudentModule,
            institute_module_1.InstituteModule,
            activity_module_1.ActivityModule,
            faculty_module_1.FacultyModule,
            admin_module_1.AdminModule,
            up_docs_module_1.UpDocsModule,
            attachment_module_1.AttachmentModule,
            program_module_1.ProgramModule,
            notifications_module_1.NotificationsModule,
            activity_module_1.ActivityModule,
            activity_type_module_1.ActivityTypeModule,
            activity_assignment_module_1.ActivityAssignmentModule,
            activity_type_assignment_module_1.ActivityTypeAssignmentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map