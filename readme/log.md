## 日志收集中间件、拦截器、过滤器

> 接口日志收集，在此之前可以先看看[官方文档](https://docs.nestjs.com/techniques/logger#logger)， 这里阐述了nestjs自带的log记录仪以及扩展的方式。这里我采用的是winston来做日志记录模块，用了[nestjs-winston包](https://github.com/gremo/nest-winston)。

1. 安装依赖

首先我们按照文档里的要求安装下面两个插件
```js
pnpm add --save nest-winston winston
```



还没想明白怎么用，日后再写