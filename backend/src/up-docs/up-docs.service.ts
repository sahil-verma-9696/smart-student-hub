import { Injectable } from '@nestjs/common';
import { UpdateUpDocDto } from './dto/update-up-doc.dto';
import { v2 as cloudinary } from 'cloudinary';
import { AttachmentService } from 'src/attachment/attachment.service';
import { CreateAttachmentDto } from 'src/attachment/dto/create-attachment.dto';
import { CreateUpDocDto } from './dto/create-up-doc.dto';

@Injectable()
export class UpDocsService {
  constructor(private readonly attachmentService: AttachmentService) {}
  async create(att: CreateUpDocDto) {

    const attachment = await this.attachmentService.upload({
      access_mode: att.access_mode!,
      asset_id: att.asset_id!,
      bytes: att.bytes!,
      createdAtCloudinary: att.createdAtCloudinary!,
      etag: att.etag!,
      folder: att.folder!,
      format: att.format!,
      height: att.height!,
      original_filename: att.original_filename!,
      public_id: att.public_id!,
      resource_type: att.resource_type!,
      secure_url: att.secure_url!,
      signature: att.signature!,
      tags: att.tags!,
      type: att.type!,
      url: att.url!,
      version: att.version!,
      version_id: att.version_id!,
      width: att.width!,
    });
    return {
      attachment,
      msg: 'File uploaded successfully',
    };
  }

  findAll() {
    return `This action returns all upDocs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upDoc`;
  }

  update(id: number, updateUpDocDto: UpdateUpDocDto) {
    return `This action updates a #${id} upDoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} upDoc`;
  }

  getAccessToken(folderName = 'ssh-up-docs') {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folderName,
      },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      timestamp,
      signature,
      folder: folderName,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_NAME,
    };
  }
}
