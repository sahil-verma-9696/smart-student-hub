import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get(':id/notifications')
  getNotifications(@Param('id') id: string) {
    return this.notificationService.getUserNotifications(id);
  }
}
