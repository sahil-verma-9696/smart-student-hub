import { InstituteType } from 'src/institute/types/enum';
export default class CreateInstituteDto {
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
}
