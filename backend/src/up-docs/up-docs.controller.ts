import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UpDocsService } from './up-docs.service';
import { CreateUpDocDto } from './dto/create-up-doc.dto';
import { UpdateUpDocDto } from './dto/update-up-doc.dto';

@Controller('up-docs')
export class UpDocsController {
  constructor(private readonly upDocsService: UpDocsService) {}

  @Post()
  create(@Body() createUpDocDto: CreateUpDocDto) {
    // Log incoming payload for debugging upload metadata issues
    try {
      console.debug('UpDocsController.create payload ->', JSON.stringify(createUpDocDto));
    } catch (e) {
      // ignore serialization errors
    }

    return this.upDocsService.create(createUpDocDto);
  }

  @Get('/access-token')
  accessToken(@Query('folderName') folderName: string) {
    return this.upDocsService.getAccessToken(folderName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.upDocsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUpDocDto: UpdateUpDocDto) {
    return this.upDocsService.update(+id, updateUpDocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.upDocsService.remove(+id);
  }
}
