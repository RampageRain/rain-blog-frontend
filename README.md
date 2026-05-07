# rain-blog-frontend

Rain Blog 前端项目，基于 Vue 3、Vite、TypeScript 和 Element Plus。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios
- Element Plus

## 功能概览

- 后台登录页
- 后台管理页基础路由
- 本地 token 存储
- 基于 Axios 的接口请求封装

## 目录结构

```text
src
├─ api
├─ assets
├─ router
├─ stores
├─ styles
└─ views
   ├─ blog
   └─ studio
```

## 环境要求

- Node.js 20.19+ 或 22.12+
- npm 10+

## 安装依赖

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

默认开发地址：

```text
http://localhost:5173
```

## 构建命令

```bash
npm run build
```

## 代码检查

```bash
npm run type-check
npm run lint
```

## 接口联调

当前请求基地址配置在 [src/api/request.ts](/D:/Blog/rain-blog-frontend/src/api/request.ts:1)：

```text
http://localhost:8080
```

后端登录接口：

```text
POST /api/auth/login
```

## 页面路由

主要页面：

- `/`
- `/studio/login`
- `/studio/dashboard`

路由定义见 [src/router/index.ts](/D:/Blog/rain-blog-frontend/src/router/index.ts:1)。

## 登录态说明

- 登录成功后会把 token 存入 `localStorage`
- 存储键名为 `rain_blog_token`
- 管理员信息存储键名为 `rain_blog_admin`

## 当前说明

- 该项目与 `rain-blog-backend` 配套使用
- 后台页面和鉴权流程仍在迭代中
- 如需部署，建议将接口地址改为环境变量而不是写死在源码里

## 后续建议

- 增加 `.vue` 类型声明文件，完善 TypeScript 检查
- 用 Vite 环境变量管理 `baseURL`
- 增加登录后跳转、退出登录和接口拦截逻辑
