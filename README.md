## 从 0-1 搭建一个 nestjs + mysql/typeORM 系统

### 搭建目录结构

- enter cmd , input nest new (your application name) , and choose pnpm install that
- nest g(generate) app(application) xxx , this allow us to keep our apps in separate folders, that's is 'monorepo';
- nest g lib db , create library to save database table and connect to a database
- nest g lib common , to save common methods

### 安装公共模块传递插件

- pnpm add @nestjs/config

### 安装 typeORM

- pnpm add @nestjs/typeorm typeorm mysql2
- pnpm add class-transformer class-validator (用于校验)

### 安装 swagger-ui

- pnpm add @nestjs/swagger swagger-ui-express

<a href="https://docs.nestjs.cn/6/recipes?id=openapi-swagger"></a>

> 通过装饰器告诉系统你要执行、读取什么数据
> 装饰器不能单独存在，它永远都在装饰某个东西
> @body 参数装饰器表示从 req.body 里获取数据 要在他后面增加个变量，告诉人们值要挂在谁的身上.
> 　同理，想获取 query 里的东西，用@Query 参数装饰器,如：create(@Body() body, @Query() query, @Param() param)

- setup('路径')函数调用接口文档路由
- 使用@api 开头的装饰器都属于接口文档的装饰器。
- @ApiProperty 属于某个模型的属性
- @ApiModelProperty({ description: '帖子内容' })
- @ApiTags('默认')标记当前下面这个控制器要应用哪个标签
- ApiOperation({ title: '创建帖子', description: 'get 帖子的接口' }) 接口名称及描述

### 创建应用

- nest g application(app) 创建应用
- nest g lib db 创建公共模块
- nest g in 创建拦截器
- nest g f 创建 filter
- nest g s (service) --no-spec(禁用 spec 文件生成)

### 创建模块

- nest g(generate) mo(module)
- 为子项目添加模块 : nest g mo -p admin users (表示在 admin 这个子项目下添加 users 模块)
- 为子项目添加控制器 : nest g co -p admin users (表示在 admin 这个子项目下添加 users 控制器)

## 坑点

- 注意！！！ 修改某个字段的字段类型的时候会把数据库内该字段的内容全部清空

### JWT

```js
 pnpm i @nestjs/jwt passport passport-jwt passport-http-bearer bcryptjs
```
