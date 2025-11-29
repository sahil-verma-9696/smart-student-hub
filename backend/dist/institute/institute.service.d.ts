import { UpdateInstituteDto } from './dto/update-institute.dto';
import Institute from './schemas/institute.schema';
import { Model } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';
export declare class InstituteService {
    private instituteModel;
    constructor(instituteModel: Model<Institute>);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateInstituteDto: UpdateInstituteDto): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addProgram(instituteId: string, programId: string): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    removeProgram(instituteId: string, programId: string): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
