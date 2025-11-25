import { Injectable } from '@nestjs/common';
import { CreateUpDocDto } from './dto/create-up-doc.dto';
import { UpdateUpDocDto } from './dto/update-up-doc.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UpDocsService {
  create(createUpDocDto: CreateUpDocDto) {
    return 'This action adds a new upDoc';
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

    // ✨ IMPORTANT: sign the same params you'll send from frontend
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
