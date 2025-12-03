// notification.service.ts
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    @Inject(forwardRef(() => NotificationGateway)) // forwardRef is used to avoid circular dependency
    private gateway: NotificationGateway,
  ) {}

  async createNotification(userId: string, title: string, message: string) {
    const notification = await this.notificationModel.create({
      userId,
      title,
      message,
    });

    // Emit in real-time
    this.gateway.sendToUser(userId, {
      title,
      message,
      // createdAt: notification.createdAt,
    });

    return notification;
  }
}
