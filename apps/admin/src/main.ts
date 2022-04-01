import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import envConfig from 'config/env';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminModule);
  // app.enableCors({
  //   origin: 'http://120.78.213.250',
  // });
  // app.useGlobalInterceptors(new TransformInterceptor())
  app.setGlobalPrefix('api'); //设置公共接口路径api
  const options = new DocumentBuilder()
    .setTitle('CD-admin后台接口文档')
    .setDescription('cd-admin api-center')
    .setVersion('1.0')
    .addTag('admin')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const PORT = envConfig.config.ADMIN_PORT || 5000;
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`);
}
bootstrap();
