import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {
  public client: Redis;
  constructor(private redisService: RedisService) {
    this.createRedis();
  }

  // 创建redis服务
  async createRedis() {
    this.client = await this.redisService.getClient();
  }

  // 获取redis缓存数据
  async get(key: string): Promise<any> {
    if (!this.client) {
      await this.createRedis();
    }
    const data = await this.client.get(key);
    if (data) return JSON.parse(data);
    return null;
  }

  // 设置redis缓存
  async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.createRedis();
    }
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  // 根据key删除redis缓存数据
  async del(key: string): Promise<any> {
    return await this.client.del(key);
  }

  // 获取所有redis缓存
  async flushall(): Promise<any> {
    return await this.client.flushall();
  }
}
