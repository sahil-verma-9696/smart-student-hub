import { HydratedDocument } from 'mongoose';
import { InstituteType } from 'src/auth/types/auth.enum';
export type InstituteDocument = HydratedDocument<Institute>;
export declare class Institute {
    name: string;
    isAffiliated: boolean;
    affiliation: string;
    state: string;
    country: string;
    type: InstituteType;
}
export declare const InstituteSchema: import("mongoose").Schema<Institute, import("mongoose").Model<Institute, any, any, any, import("mongoose").Document<unknown, any, Institute, any, {}> & Institute & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Institute, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Institute>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Institute> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
