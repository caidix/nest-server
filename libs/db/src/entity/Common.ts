import { Column } from 'typeorm';

export class CommonEntity {
  @Column({ default: 0 })
  isDelete: number;

  @Column({ default: '', nullable: true })
  createTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;

  @Column({ default: '', nullable: true })
  deleteTime: string;

  @Column({ comment: '创建者id' })
  creator: number;

  @Column({ comment: '操作者id' })
  operator: number;
}
