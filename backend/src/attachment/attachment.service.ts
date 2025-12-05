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
    // Normalize possible Cloudinary keys (snake_case) and camelCase
    const normalized: any = {
      assetId: (payload as any).asset_id || (payload as any).assetId || null,
      publicId: (payload as any).public_id || (payload as any).publicId || null,
      version: Number((payload as any).version) || Number((payload as any).version?.toString()) || 0,
      versionId: (payload as any).version_id || (payload as any).versionId || null,
      signature: (payload as any).signature || null,
      format: (payload as any).format || null,
      width: Number((payload as any).width) || 0,
      height: Number((payload as any).height) || 0,
      resourceType: (payload as any).resource_type || (payload as any).resourceType || null,
      bytes: Number((payload as any).bytes) || 0,
      url: (payload as any).url || null,
      secureUrl: (payload as any).secure_url || (payload as any).secureUrl || null,
      folder: (payload as any).folder || null,
      tags: Array.isArray((payload as any).tags) ? (payload as any).tags : (typeof (payload as any).tags === 'string' ? ((payload as any).tags ? (payload as any).tags.split(',') : []) : []),
      originalFilename: (payload as any).original_filename || (payload as any).originalFilename || null,
      accessMode: (payload as any).access_mode || (payload as any).accessMode || null,
      etag: (payload as any).etag || null,
      type: (payload as any).type || null,
      // Convert createdAtCloudinary from various possible keys
      createdAtCloudinary: (payload as any).createdAtCloudinary || (payload as any).created_at || null,
    };

    // Ensure createdAtCloudinary becomes a Date (if provided)
    if (normalized.createdAtCloudinary) {
      const d = new Date(normalized.createdAtCloudinary);
      normalized.createdAtCloudinary = isNaN(d.getTime()) ? new Date() : d;
    } else {
      normalized.createdAtCloudinary = new Date();
    }

    // Basic validation before DB insert - produce clearer error if missing required fields
    const missing: string[] = [];
    ['assetId', 'publicId', 'versionId', 'signature', 'format', 'url', 'secureUrl', 'folder', 'originalFilename'].forEach((k) => {
      if (!normalized[k]) missing.push(k);
    });

    if (missing.length > 0) {
      throw new Error(`Attachment payload missing required fields: ${missing.join(', ')}`);
    }

    try {
      return await this.attachmentModel.create(normalized);
    } catch (err) {
      console.error('AttachmentService.upload: DB insert error', err && (err.message || err));
      throw new Error('Failed to save attachment metadata');
    }
  }
}
