import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './Common';

export enum IApiTypeEnum {
  Category = 1,
  ApiResource = 2,
}

@Entity({ name: 'ApiResource' })
export class ApiResource extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text', { nullable: true })
  desc: string;

  @Column()
  value: string;

  @Column('enum', {
    comment: '1: ： 分类 2： 接口',
    default: IApiTypeEnum.ApiResource,
    enum: IApiTypeEnum,
  })
  type: IApiTypeEnum;

  @Column({ nullable: false, comment: '归属分类code' })
  categoryCode: string;

  @Column({ comment: '归属应用code -- System' })
  systemCode: string;

  @Column()
  code: string;
}
