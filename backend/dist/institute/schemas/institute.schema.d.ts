import { Document, Types } from 'mongoose';
import { InstituteType } from 'src/auth/types/auth.enum';
export declare class Institute extends Document {
    institute_name: string;
    institute_type: InstituteType;
    official_email: string;
    official_phone: string;
    address_line1: string;
    city: string;
    state: string;
    pincode: string;
    is_affiliated: boolean;
    affiliation_university?: string;
    affiliation_id?: string;
    programs: Types.ObjectId[];
}
export declare const InstituteSchema: import("mongoose").Schema<Institute, import("mongoose").Model<Institute, any, any, any, Document<unknown, any, Institute, any, {}> & Institute & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Institute, Document<unknown, {}, import("mongoose").FlatRecord<Institute>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Institute> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
