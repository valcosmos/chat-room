import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(userId: number) {
    const favorites = await this.prismaService.favorite.findMany({
      where: {
        uerId: userId,
      },
    });
    const res = [];
    for (const item of favorites) {
      const chatHistory = await this.prismaService.chatHistory.findUnique({
        where: {
          id: item.chatHistoryId,
        },
      });
      res.push({
        ...item,
        chatHistory,
      });
    }
    return res;
  }

  async add(userId: number, chatHistoryId: number) {
    return this.prismaService.favorite.create({
      data: {
        uerId: userId,
        chatHistoryId,
      },
    });
  }

  async del(id: number) {
    return this.prismaService.favorite.deleteMany({
      where: {
        id,
      },
    });
  }
}
