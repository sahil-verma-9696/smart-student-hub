"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        try {
            console.error('Unhandled exception caught by GlobalExceptionFilter:', exception && (exception.stack || exception));
        }
        catch (logErr) {
        }
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse = {
            status,
            name: 'InternalServerError',
            message: 'Something went wrong',
            details: {},
        };
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            let message;
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && 'message' in res) {
                const msg = res.message;
                message = Array.isArray(msg) ? msg.join(', ') : msg;
            }
            else {
                message = exception.message;
            }
            errorResponse = {
                status,
                name: typeof res === 'object' && 'error' in res
                    ? res.error
                    : exception.name,
                message,
                details: typeof res === 'object' && 'details' in res
                    ? res.details
                    : {},
            };
        }
        else if (exception instanceof Error) {
            errorResponse = {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                name: exception.name,
                message: exception.message,
                details: {},
            };
        }
        else {
            errorResponse = {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                name: 'UnknownError',
                message: JSON.stringify(exception),
                details: {},
            };
        }
        return response.status(status).json({
            data: null,
            error: errorResponse,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=exception.filter.js.map