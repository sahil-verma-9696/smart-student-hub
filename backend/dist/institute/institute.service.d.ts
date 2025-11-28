import Institute, { InstituteDocument } from './schemas/institute.schema';
import { Model, Types } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';
import { IInstituteService } from './types/service.interface';
export declare class InstituteService implements IInstituteService {
    private instituteModel;
    constructor(instituteModel: Model<Institute>);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createInstitute(dto: CreateInstituteDto): Promise<InstituteDocument>;
    getInstituteById(instituteId: string): Promise<InstituteDocument>;
    addAdminToInstitute(instituteId: string, adminId: string): Promise<InstituteDocument>;
}
