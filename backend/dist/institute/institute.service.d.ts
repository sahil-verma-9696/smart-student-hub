import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { Institute } from './schemas/institute.schema';
import { Model } from 'mongoose';
export declare class InstituteService {
    private instituteModel;
    constructor(instituteModel: Model<Institute>);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateInstituteDto: UpdateInstituteDto): string;
    remove(id: number): string;
}
