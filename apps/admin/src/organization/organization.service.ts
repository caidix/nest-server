import { Organization } from '@libs/db/entity/OrganizationEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatData } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { Brackets, In, NotBrackets, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/OrganizationDto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** 创建组织 */
  public async createOrganization(
    organization: CreateOrganizationDto,
    user: User,
  ) {
    try {
      const res = await this.organizationRepository.save({
        ...organization,
        ...getFormatData('create', user),
      });
      return res;
    } catch (error) {
      throw new ApiException(
        '创建组织失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 删除组织 */
  public async deleteOrganization(ids: number[], user) {
    try {
      return await this.organizationRepository
        .createQueryBuilder()
        .update(Organization)
        .set({ ...getFormatData('delete', user) })
        .whereInIds(ids)
        .execute();
    } catch (e) {
      throw new ApiException('删除组织失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 获取所有组织 */
  async getOrganizationList() {
    return await this.organizationRepository.find({
      order: { sort: 'DESC', createTime: 'DESC' },
    });
  }

  /** 根据当前角色id获取部门列表 */
  public async getListByUser(query: any, user) {
    try {
      if (user.isSuper) {
        return this.organizationRepository.find();
      }
      // const roleIds = await
      // TODO: 这里留获取用户角色的底
      return null;
    } catch (e) {
      console.log({ e });
      throw new ApiException('查询组织失败', 400, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 查询组织关联的用户数量 */
  async countUserByOrgId(id: number): Promise<number> {
    try {
      return await this.userRepository.count({ where: { organization: id } });
    } catch (e) {
      throw new ApiException(
        '查询关联用户数量失败',
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 查找当前部门下的子部门数量* /
  public async countChildOrganization(id: number): Promise<number> {
    return await this.organizationRepository.count({ where: { parentId: id } });
  }

  /** 更新单个组织 */
  public async updateOrganization(organization: any) {
    try {
      return await this.organizationRepository
        .createQueryBuilder()
        .update(Organization)
        .set({ ...organization, ...getFormatData('update') })
        .where('id=:id', { id: organization.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '组织更新失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 查看组织详情 */
  public async organizationInfo(id: number) {
    try {
      const org = await this.organizationRepository.findOne({ id });
      if (!org) {
        throw Error();
      }
      return org;
    } catch (error) {
      throw new ApiException(
        '查找组织失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /**
   * 转移组织
   */
  async transfer(userIds: number[], organizationId: number): Promise<void> {
    try {
      await this.userRepository.update(
        { id: In(userIds) },
        { organization: organizationId },
      );
    } catch (error) {
      throw new ApiException('转移组织失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }
}
