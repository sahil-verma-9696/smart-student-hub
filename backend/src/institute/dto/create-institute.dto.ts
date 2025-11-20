import { InstituteType } from 'src/auth/types/auth.enum';

export class CreateInstituteDto {
  name: string;
  isAffiliated: boolean;
  affiliation?: string;
  state: string;
  country: string;
  code: string;
  type: InstituteType;
}
