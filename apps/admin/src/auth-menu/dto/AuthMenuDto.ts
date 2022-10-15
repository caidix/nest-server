import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthMenuDto {
  @IsString()
  @ApiProperty({ title: '权限点名称' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '权限点编码', example: '' })
  code: string;

  @ApiProperty({ title: '权限点描述', default: '' })
  desc?: string;

  @IsNotEmpty()
  @ApiProperty({ title: '归属应用code' })
  systemCode: string;

  @IsNotEmpty()
  @ApiProperty({ title: '归属菜单code' })
  menuCode: string;
}

export class UpdateAuthMenuDto extends CreateAuthMenuDto {
  @ApiProperty({ title: '权限点id', example: '' })
  id: number;
}

export class DeleteAuthMenuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '权限点编码', example: '' })
  code: string;

  @IsNotEmpty()
  @ApiProperty({ title: '归属应用code' })
  systemCode: string;

  @IsNotEmpty()
  @ApiProperty({ title: '归属菜单code' })
  menuCode: string;
}

export class ValidAuthMenuDto {
  @ApiProperty({ title: '权限点编码', example: '' })
  code?: string;

  @ApiProperty({ title: '权限点名称' })
  name?: string;

  @ApiProperty({ title: '归属应用code' })
  systemCode: string;

  @ApiProperty({ title: '归属菜单code' })
  menuCode: string;
}

export class AuthMenuListDto {
  @IsNotEmpty()
  @ApiProperty({ title: '归属应用code' })
  systemCode: string;

  @IsNotEmpty()
  @ApiProperty({ title: '归属菜单code' })
  menuCode: string;
}
