import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  Max,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMenuTypeEnum, PageOpenEnum } from '@libs/db/entity/SystemMenuEntity';
import { IShowStatusEnum } from 'libs/common/types/enums';

export class CreateSystemMenuDto {
  @ApiProperty({ title: '菜单名称' })
  name: string;

  @ApiProperty({ title: '应用编码', example: '' })
  code?: string;

  @ApiProperty({ title: '菜单路由', default: '/' })
  url: string;

  @ApiProperty({ title: '菜单描述', default: '' })
  desc: string;

  @ApiProperty({ title: 'Icon图标', default: '' })
  iconUrl: string;

  @ApiProperty({
    title: '菜单类型',
    default: IMenuTypeEnum.PAGE,
  })
  menuType: IMenuTypeEnum;

  /** 找到同级下最大的排序 + 1 */
  @ApiProperty({ title: '菜单排序', default: 1 })
  sort?: number;

  @ApiProperty({
    title: '显示隐藏 1：显示  2：隐藏',
    default: IShowStatusEnum.HIDDEN,
  })
  isShow: IShowStatusEnum;

  @ApiProperty({
    title: '页面打开方式 1：内嵌  2：跳转',
    default: PageOpenEnum.Inline,
  })
  pageOpenMethod: PageOpenEnum;

  @ApiProperty({ title: '归属应用id' })
  systemId: number;

  @ApiProperty({ title: '归属父级菜单id' })
  parentId: number;
}

export class UpdateSystemMenu extends CreateSystemMenuDto {
  @ApiProperty({ title: 'id' })
  id?: number;
}
