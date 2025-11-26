import { IsString, IsNumber, IsUrl, IsArray } from 'class-validator';

export class CreateAttachmentDto {
  @IsString() asset_id: string;
  @IsString() public_id: string;
  @IsNumber() version: number;
  @IsString() version_id: string;
  @IsString() signature: string;
  @IsString() format: string;
  @IsNumber() width: number;
  @IsNumber() height: number;
  @IsString() resource_type: string;
  @IsNumber() bytes: number;
  @IsUrl() url: string;
  @IsUrl() secure_url: string;
  @IsString() folder: string;

  @IsArray() tags: string[];

  @IsString() original_filename: string;
  @IsString() access_mode: string;
  @IsString() etag: string;

  // Cloudinary timestamp (ISO string)
  @IsString() createdAtCloudinary: string;

  @IsString() type: string;
}
