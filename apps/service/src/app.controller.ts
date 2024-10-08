import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { RequireLogin, UserInfo } from './custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('aaa')
  // @RequireLogin()
  // // @SetMetadata('require-login', true)
  // aaa(@UserInfo() userInfo, @UserInfo('username') username) {
  //   return 'aaa';
  // }

  // @Get('bbb')
  // bbb() {
  //   return 'bbb';
  // }
}
