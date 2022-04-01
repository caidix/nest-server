import { IsEmail, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString({
    message: '角色名称格式不正确',
    context: { errorCode: 1111 },
  })
  @ApiProperty({ description: '用户姓名', example: '王力宏' })
  name: string;

  @IsString({
    message: '该编码角色已经存在',
    context: { errorCode: 2222 },
  })
  @ApiProperty({ description: '角色编码', example: 'dsxamdd' })
  code: string;

  @ApiProperty({ description: '描述', example: 'role权限描述' })
  desc: any;
}
