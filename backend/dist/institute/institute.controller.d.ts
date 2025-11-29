import { InstituteService } from './institute.service';
import CreateInstituteDto from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
export declare class InstituteController {
    private readonly instituteService;
    constructor(instituteService: InstituteService);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateInstituteDto: UpdateInstituteDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addProgram(id: string, programId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeProgram(id: string, programId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
