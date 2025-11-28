import Institute, { InstituteDocument } from './schemas/institute.schema';
import { Model, Types } from 'mongoose';
import CreateInstituteDto from './dto/create-institute.dto';
import { IInstituteService } from './types/service.interface';
import { ClientSession } from 'mongoose';
export declare class InstituteService implements IInstituteService {
    private instituteModel;
    constructor(instituteModel: Model<Institute>);
    create(createInstituteDto: CreateInstituteDto): Promise<import("mongoose").Document<unknown, {}, Institute, {}, {}> & Institute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createInstitute(dto: CreateInstituteDto, session?: ClientSession): Promise<InstituteDocument>;
    getInstituteById(instituteId: string, session?: ClientSession): Promise<InstituteDocument>;
    addAdminToInstitute(instituteId: string, adminId: string, session?: ClientSession): Promise<InstituteDocument>;
}
