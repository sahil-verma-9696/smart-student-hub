"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const morgan_1 = __importDefault(require("morgan"));
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const exception_filter_1 = require("./common/filters/exception.filter");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'ngrok-skip-browser-warning',
        ],
        Credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    cloudinary_1.v2.config({
        cloud_name: config.get('CLOUDINARY_NAME'),
        api_key: config.get('CLOUDINARY_API_KEY'),
        api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
    app.use((0, morgan_1.default)('combined'));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new exception_filter_1.GlobalExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Server running at http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map