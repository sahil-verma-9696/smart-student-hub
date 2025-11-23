import { InstituteType } from 'src/institute/types/enum';
import { ContactInfoDto } from 'src/user/dto/contact-info.dto';
export default class InstituteRegistrationDto {
    institute_name: string;
    institute_type: InstituteType;
    official_email: string;
    official_phone: string;
    address_line1: string;
    city: string;
    state: string;
    pincode: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
    admin_gender: string;
    admin_contactInfo: ContactInfoDto;
    is_affiliated: boolean;
    affiliation_university?: string;
    affiliation_id?: string;
}
