import { InstituteType } from 'src/auth/types/auth.enum';
export declare class CreateInstituteDto {
    name: string;
    isAffiliated: boolean;
    affiliation?: string;
    state: string;
    country: string;
    type: InstituteType;
}
