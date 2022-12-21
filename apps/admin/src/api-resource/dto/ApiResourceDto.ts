import { ApiProperty } from '@nestjs/swagger';
import { IApiTypeEnum } from '@libs/db/entity/ApiResourceEntity';

export class CreateApiResourceDto {
  @ApiProperty({ title: '接口名称' })
  name: string;

  @ApiProperty({ title: '编码', example: '' })
  code: string;

  @ApiProperty({ title: '接口描述', default: '' })
  desc?: string;

  @ApiProperty({ title: '接口路径', default: '' })
  value?: string;

  @ApiProperty({
    title: '类型',
    default: IApiTypeEnum,
  })
  type: IApiTypeEnum;

  @ApiProperty({ title: '归属应用code' })
  systemCode: string;

  @ApiProperty({ title: '归属分类' })
  categoryCode?: string;
}

export class UpdateApiResourceDto extends CreateApiResourceDto {
  @ApiProperty({ title: 'id' })
  id?: number;
}

export class DeleteApiResourceDto {
  @ApiProperty({ title: 'id' })
  ids?: number[];

  @ApiProperty({
    title: '类型',
    default: IApiTypeEnum,
  })
  type: IApiTypeEnum;

  @ApiProperty({ title: '归属分类' })
  categoryCode: string;

  @ApiProperty({ title: '归属应用code' })
  systemCode: string;
}

export class DeleteApiCategoryDto {
  @ApiProperty({ title: 'id' })
  id?: number;

  @ApiProperty({ title: '归属应用code' })
  systemCode: string;
}

export class QueryApiResourceDto {
  name: string;

  code: string;

  categoryCode: string;

  systemCode: string;

  page: number;

  pageSize: number;
}
