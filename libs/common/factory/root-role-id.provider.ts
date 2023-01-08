import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 提供使用 @Inject(ROOT_ROLE_ID) 直接获取RootRoleId
 */
export const ROOT_ROLE_ID = 'ROOT_ROLE_ID';
export const rootRoleIdProvider = {
  provide: ROOT_ROLE_ID,
  useFactory: (configService: ConfigService) => {
    return configService.get<number>('rootRoleId', 1);
  },
  inject: [ConfigService],
};
