import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attachment } from './schema/attachment.schema';
import { Model } from 'mongoose';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectModel(Attachment.name) private attachmentModel: Model<Attachment>,
  ) {}

  async upload(payload: CreateAttachmentDto) {
    return await this.attachmentModel.create({
      assetId: payload.asset_id,
      publicId: payload.public_id,
      version: payload.version,
      versionId: payload.version_id,
      signature: payload.signature,
      format: payload.format,
      width: payload.width,
      height: payload.height,
      resourceType: payload.resource_type,
      bytes: payload.bytes,
      url: payload.url,
      secureUrl: payload.secure_url,
      folder: payload.folder,
      tags: payload.tags,
      accessMode: payload.access_mode,
      etag: payload.etag,
      originalFilename: payload.original_filename,
      type: payload.type,

      // Cloudinary sends created_at as ISO string
      createdAtCloudinary: new Date(payload.createdAtCloudinary),
    });
  }
}
