import { InstituteType } from '../types/auth.enum';

export default class InstitueRegistrationDto {
  name: string;
  isAffiliated: boolean;
  affiliation?: string;
  state: string;
  country: string;
  code: string;
  type: InstituteType;
}
