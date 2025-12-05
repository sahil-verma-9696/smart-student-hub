import { PartialType } from '@nestjs/mapped-types';
import { BranchDto } from './branch.dto';

export class UpdateBranchDto extends PartialType(BranchDto) {}
