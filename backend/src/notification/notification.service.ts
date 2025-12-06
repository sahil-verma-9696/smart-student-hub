// notification.service.ts
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    this.gateway.sendToUser(userId, notification);

    return notification;
  }

  async getUserNotifications(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const notifications = await this.notificationModel.find({
      userId: userObjId,
    });

    if (!notifications.length) {
      return [];
    }

    return notifications;
  }
}
