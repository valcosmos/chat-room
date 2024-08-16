import { IsNotEmpty } from 'class-validator';

export class FriendAddDto {
  @IsNotEmpty({
    message: '添加的好友 id 不能为空',
  })
  username: string;


  reason: string;
}
