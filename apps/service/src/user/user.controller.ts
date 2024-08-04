import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { UpdateUserDto } from './dto/udpate-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    return {
      user,
      token: this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.create(registerUser);
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserDetailById(userId);
  }

  @Post('update_password')
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Get('update/captcha')
  async updateCaptcha(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('邮箱地址不能为空');
    }
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('update')
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }
}
