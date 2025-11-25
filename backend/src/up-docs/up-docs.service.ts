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

  getAccessToken() {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_NAME,
    };
  }
}
