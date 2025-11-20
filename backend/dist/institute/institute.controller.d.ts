import { InstituteService } from './institute.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
export declare class InstituteController {
    private readonly instituteService;
    constructor(instituteService: InstituteService);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/institute.schema").Institute, {}, {}> & import("./schemas/institute.schema").Institute & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateInstituteDto: UpdateInstituteDto): string;
    remove(id: string): string;
}
