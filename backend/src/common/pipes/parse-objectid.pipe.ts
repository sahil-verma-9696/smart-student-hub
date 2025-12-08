import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value) throw new BadRequestException('Missing id parameter');
    // If user accidentally includes a colon like ':<id>' strip it and validate
    const cleaned = value.startsWith(':') ? value.slice(1) : value;
    if (!isValidObjectId(cleaned)) {
      throw new BadRequestException('Invalid id format');
    }
    return cleaned;
  }
}
