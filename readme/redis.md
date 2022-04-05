# nestjs 接入 redis 步骤

> Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。我们可以使用redis来稍微的弥补jwt策略的缺陷

- Redis 完全基于内存，绝大部分请求是纯粹的内存操作，执行效率高。
- Redis 使用单进程单线程模型的（K，V）数据库，将数据存储在内存中，存取均不会受到硬盘 IO 的限制，因此其执行速度极快。另外单线程也能处理高并发请求，还可以避免频繁上下文切换和锁的竞争，如果想要多核运行也可以启动多个实例。
- 数据结构简单，对数据操作也简单，Redis 不使用表，不会强制用户对各个关系进行关联，不会有复杂的关系限制，其存储结构就是键值对，类似于 HashMap，HashMap 最大的优点就是存取的时间复杂度为 O(1)。
- Redis 使用多路 I/O 复用模型，为非阻塞 IO。

## 本地安装

> 百度操作下载好redis。本地redis安装后如何跑： 到redis根目录，打开cmd ： redis-server.exe redis.windows.conf。 执行完cmd之后，可以使用Redis Desktop Manager可视化工具来查看本地redis情况。破解版去网上下载

## nestjs接入redis
### 安装依赖

1. pnpm add --save @liaoliaots/nestjs-redis ioredis ，[文档](https://github.com/liaoliaots/nestjs-redis), 注意！千万不要直接下载nestjs-redis依赖，它会去下载skunight这个哥们的包，有BUG，这上海的老哥已经快一年没更新了，外国佬都快杀疯了，踩过坑了别人别踩-。-
2. 找到libs/db/src/db.module.ts接入redis

```js

import { RedisModule } from '@liaoliaots/nestjs-redis';
imports: [
  RedisModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      config: {
        name: configService.get('REDIS_NAME', 'test-redis'),
        host: configService.get('REDIS_HOST', '127.0.0.1'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD', 'cd@redis'),
      },
    }),
  }),
],
```

### 创建service服务

- nest g s --no-spec , 选择admin ， 名字为redis
- 找到redis.service文件夹

```js
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
// (这里的命名和redisService冲突了，我将它改成了RedisCacheService)
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
```

### 实现单点登录

> 实现单点登录的逻辑就是，当我们在为用户sign token的时候，我们通过key: 用户id， value:token的形式存储进redis，如果下次还有同样的用户id登录就把原来的redis中的key对应的值换成新的，这样先前的那个用户 再次访问的时候发现这个token和之前的不相同，那么就认为它在别的地方登录了，本地就强制下线，　从而保证一个用户只允许在一个地方登录，这里暂不考虑redis缓存丢失，服务器宕机等问题。

1. 我统一把登录相关的鉴权接口写在auth.service里，我们来到auth.service

```js
// auth.module 导入redis服务
import { RedisCacheService } from '../redis/redis.service';
providers: [
  .....
  RedisCacheService,
],

// auth.service 注入服务并编写接口
constructor(
  @Inject(RedisCacheService)
  private readonly redisCacheService: RedisCacheService,
) {}

async createRedisByToken({ name, id, token }): Promise<any> {
  this.redisCacheService.set(
    `jwt-${id}-${name}`,
    token,
    Number(this.configService.get('REDIS_CACHE_TIME', 60 * 60)),
  );
}

async getRedisByToken({ name, id }): Promise<string> {
  return this.redisCacheService.get(`jwt-${id}-${name}`);
}
```

来到user.controller，我们在成功登录后使用createRedisByToken来为用户生成缓存

```js
// user.controller
...
const token = await this.authService.creatToken({
  name,
  id,
});
await this.authService.createRedisByToken({
  name,
  id,
  token: token.accessToken,
});
...
```

这个时候我们就拥有了用户缓存，在来到jwt.strategy下面为该策略书写redis验证

```js
// jwt.strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // 这里我们需要增加passReqToCallback：true参数，让validate返回req从而获取前端传入的token
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req, payload: JwtPayloadToken, done: any) {
    const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const { name, id } = payload;
    const cacheToken = await this.authService.getRedisByToken({ name, id });
    const user = await this.authService.validateUser(name);
    console.log({ originToken, cacheToken });

    //单点登陆验证， 要排除redis为空的情况
    if (cacheToken && cacheToken !== originToken) {
      throw new ApiException(
        '您账户已经在另一处登陆，请重新登陆',
        400,
        ErrorCodeEnum.USER_LOGGED,
      );
    }

    if (!user || user.id !== Number(id)) {
      return done(
        new ApiException('token无效', 400, ErrorCodeEnum.TOKEN_OVERDUE),
        false,
      );
    }
    done(null, user);
  }
}
```

到此为止，登录鉴权就完成了。可以自己在nest中构造demo实践一下，实践才能得真知。
