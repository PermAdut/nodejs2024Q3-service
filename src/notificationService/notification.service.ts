import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  private prisma = new PrismaClient();

  async addNotification(notificationInfo: Notification): Promise<Notification> {
    return await this.prisma.notification.create({ data: notificationInfo });
  }

  async deleteNotification(id: number): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { idNotification: id },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    return await this.prisma.notification.delete({
      where: { idNotification: id },
    });
  }

  async addUserToNotification(
    idUser: number,
    idNotification: number,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { idNotification: idNotification },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    const usersIds = notification.idUser;
    const user = await this.prisma.user.findUnique({
      where: { idUser: idUser },
    });
    if (!user) {
      throw new Error('Invalid user id');
    }
    usersIds.push(user.idUser);
    return await this.prisma.notification.update({
      where: { idNotification: idNotification },
      data: { idUser: usersIds },
    });
  }

  async deleteUserNotification(
    idUser: number,
    idNotification: number,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { idNotification: idNotification },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    const usersIds = notification.idUser;
    const user = await this.prisma.user.findUnique({
      where: { idUser: idUser },
    });
    if (!user) {
      throw new Error('Invalid user id');
    }
    usersIds.splice(
      usersIds.findIndex((el) => el == user.idUser),
      1,
    );
    return await this.prisma.notification.findUnique({
      where: { idNotification: idNotification },
    });
  }
}
