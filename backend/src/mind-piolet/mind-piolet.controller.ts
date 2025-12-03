import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MindPioletService } from './mind-piolet.service';
import { CreateMindPioletDto } from './dto/create-mind-piolet.dto';
import { UpdateMindPioletDto } from './dto/update-mind-piolet.dto';
import { mindPioletData } from './constants';

@Controller('mind-piolet')
export class MindPioletController {
  constructor(private readonly mindPioletService: MindPioletService) {}

  @Post()
  create(@Body() createMindPioletDto: CreateMindPioletDto) {
    return this.mindPioletService.create(createMindPioletDto);
  }

  @Get()
  findAll() {
    return mindPioletData;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mindPioletService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMindPioletDto: UpdateMindPioletDto,
  ) {
    return this.mindPioletService.update(+id, updateMindPioletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mindPioletService.remove(+id);
  }
}
