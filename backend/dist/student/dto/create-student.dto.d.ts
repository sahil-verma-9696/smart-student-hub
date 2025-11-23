import { ContactInfoDto } from 'src/user/dto/contact-info.dto';
export declare class CreateStudentDto {
    name: string;
    email: string;
    password: string;
    role: string;
    gender: string;
    contactInfo: ContactInfoDto;
    instituteId: string;
}
