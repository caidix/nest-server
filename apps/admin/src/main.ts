import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import envConfig from 'config/env';
import { AdminModule } from './admin.module';
import { TransformInterceptor } from 'libs/common/interceptor/transform.interceptor';
import { ReturnClientFilter } from 'libs/common/filters/return-client.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminModule);
  // cors跨域
  // app.enableCors({
  //   origin: 'http://120.78.213.250',
  // });

  //设置公共接口 prefix 路径api
  app.setGlobalPrefix('api');

  // swagger 文档配置
  const options = new DocumentBuilder()
    .setTitle('CD-admin后台接口文档')
    .setDescription('cd-admin api-center')
    .setVersion('1.0')
    .addTag('admin')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // 正确响应体拦截处理
  app.useGlobalInterceptors(new TransformInterceptor());

  // 错误响应体拦截处理
  app.useGlobalFilters(new ReturnClientFilter());

  const PORT = envConfig.config.ADMIN_PORT || 5000;
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`);
}
bootstrap();
