import { Injectable } from '@nestjs/common';
import { CreateMindPioletDto } from './dto/create-mind-piolet.dto';
import { UpdateMindPioletDto } from './dto/update-mind-piolet.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MindPioletService {
  constructor(private readonly httpService: HttpService) { }

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

  // Ngrok GET endpoint
  async getMindPioletData(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://cb0510e92b7f.ngrok-free.app/py/student/${id}/mind-piolet-data`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          },
        ),
      );
      return data;
    } catch (error) {
      console.error('Error fetching MindPilot data:', error.message);
      throw error;
    }
  }

  // Ngrok POST endpoint
  async chat(message: string, role: string, studentId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://doyle-unhumourous-mark.ngrok-free.dev/py/student/${studentId}/get-mindpiolet`,
          {
            message,
            role,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        ),
      );
      return data;
    } catch (error) {
      console.error('Error in MindPilot chat:', error.message);
      throw error;
    }
  }
}
