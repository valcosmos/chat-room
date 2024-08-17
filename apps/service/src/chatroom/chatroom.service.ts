import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async queryOneToOneChatroom(userId1: number, userId2: number) {
    const chatrooms = await this.prismaService.userChatroom.findMany({
      where: {
        userId: userId1,
      },
    });
    const chatrooms2 = await this.prismaService.userChatroom.findMany({
      where: {
        userId: userId2,
      },
    });

    let res;

    for (const item of chatrooms) {
      const chatroom = await this.prismaService.chatroom.findFirst({
        where: {
          id: item.chatroomId,
        },
      });
      if (chatroom.type === true) {
        continue;
      }

      const found = chatrooms2.find(
        (item2) => item2.chatroomId === chatroom.id,
      );
      if (found) {
        res = found.chatroomId;
        break;
      }
    }

    return res;
  }

  async createOneToOneChatroom(friendId: number, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name: '聊天室' + Math.random().toString().slice(2, 8),
        type: false,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });
    await this.prismaService.userChatroom.create({
      data: {
        userId: friendId,
        chatroomId: id,
      },
    });
    // return '创建成功';
    return id;
  }

  async createGroupChatroom(name: string, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name,
        type: true,
      },
    });
    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });
    return '创建成功';
  }

  async list(userId: number, name: string) {
    const chatroomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    });
    const chatrooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: chatroomIds.map((item) => item.chatroomId),
        },
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true,
      },
    });

    const res = [];

    for (const item of chatrooms) {
      const userIds = await this.prismaService.userChatroom.findMany({
        where: {
          chatroomId: item.id,
        },
        select: {
          userId: true,
        },
      });
      res.push({
        ...item,
        userCount: userIds.length,
        userIds: userIds.map((item) => item.userId),
      });
    }

    // for (let i = 0; i < chatrooms.length; i++) {

    // }

    return res;
  }

  async members(chatroomId: number) {
    const userIds = await this.prismaService.userChatroom.findMany({
      where: {
        chatroomId,
      },
      select: {
        userId: true,
      },
    });
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        headPic: true,
        createTime: true,
        email: true,
      },
    });
    return users;
  }

  async info(id: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id,
      },
    });
    return { ...chatroom, users: await this.members(id) };
  }

  async join(id: number, userId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id,
      },
    });
    if (chatroom.type === false) {
      throw new BadRequestException('一对一聊天室不能加人');
    }

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });

    return '加入成功';
  }

  async quit(id: number, userId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id,
      },
    });
    if (chatroom.type === false) {
      throw new BadRequestException('一对一聊天室不能退出');
    }

    await this.prismaService.userChatroom.deleteMany({
      where: {
        userId,
        chatroomId: id,
      },
    });

    return '退出成功';
  }
}
