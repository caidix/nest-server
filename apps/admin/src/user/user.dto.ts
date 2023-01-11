import { UserStatusEnum } from '@libs/db/entity/UserEntity';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';
import { PageDto } from 'libs/common/types/PageDto';

export class CreateUserDto {
  @ApiProperty({ title: '用户名', example: 'admin' })
  name: string;

  @ApiProperty({ description: '邮箱', example: '123456@qq.com' })
  email: string;

  @ApiProperty({ description: '角色id', example: 18 })
  roleId: string;

  @ApiProperty({ description: '年龄', example: 18 })
  age?: string;

  @ApiProperty({ title: '昵称', example: 'admin' })
  nick?: string;

  @ApiProperty({ title: '手机号' })
  phone?: string;

  @ApiProperty({ title: '状态' })
  status?: UserStatusEnum;

  @ApiProperty({ title: '所属组织ID' })
  organization?: number;

  @ApiProperty({ title: '所属角色枚举ID' })
  roles?: number[];

  @ApiProperty({ title: '是否超管' })
  isSuper?: boolean;

  @ApiProperty({ title: '密码', example: '123456' })
  password?: string;

  @ApiProperty({ title: '用户概述', example: '描述' })
  desc?: string;

  @ApiProperty({ description: '验证码' })
  verifyCode?: string;

  @ApiProperty({
    description: '是否需要验证码',
  })
  needVerifyCode?: boolean;

  address?: string;
}

export class QueryUserListDto extends PageDto {
  @ApiProperty({ title: '用户名', example: 'admin' })
  name?: string;
  @ApiProperty({ title: '昵称', example: 'admin' })
  nick?: string;
  @ApiProperty({ title: '所属组织id', example: 1 })
  organization?: number;
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty({ description: 'id' })
  id: number;
}

export class DeleteUserDto {
  @ApiProperty({
    description: '需要删除的用户ID列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  userIds: number[];
}
