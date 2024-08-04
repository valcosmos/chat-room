import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaServices: PrismaService;

  @Inject(RedisService)
  private redisServices: RedisService;

  private logger = new Logger();

  async create(user: RegisterUserDto) {
    const captcha = await this.redisServices.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prismaServices.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.prismaServices.user.create({
        data: {
          username: user.username,
          password: user.password,
          nickName: user.nickName,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
    } catch (error) {
      this.logger.error(error, UserService);
      return null;
    }
  }
}
