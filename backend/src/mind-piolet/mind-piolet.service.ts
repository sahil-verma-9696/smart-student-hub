import { Injectable } from '@nestjs/common';
import { CreateMindPioletDto } from './dto/create-mind-piolet.dto';
import { UpdateMindPioletDto } from './dto/update-mind-piolet.dto';

@Injectable()
export class MindPioletService {
  create(createMindPioletDto: CreateMindPioletDto) {
    return 'This action adds a new mindPiolet';
  }

  findAll() {
    return `This action returns all mindPiolet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mindPiolet`;
  }

  update(id: number, updateMindPioletDto: UpdateMindPioletDto) {
    return `This action updates a #${id} mindPiolet`;
  }

  remove(id: number) {
    return `This action removes a #${id} mindPiolet`;
  }
}
