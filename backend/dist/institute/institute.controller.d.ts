import { InstituteService } from './institute.service';
import CreateInstituteDto from './dto/create-institute.dto';
export declare class InstituteController {
    private readonly instituteService;
    constructor(instituteService: InstituteService);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").default, {}, {}> & import("./schemas/institute.schema").default & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findOne(id: string): Promise<import("./schemas/institute.schema").InstituteDocument>;
}
