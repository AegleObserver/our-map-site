# 15 分钟生活圈项目发布站

这是独立的项目介绍页仓库。它不运行 FastAPI、不加载 OSM 路网，也不读取百度服务端密钥；页面可以在后端不可用时独立构建和访问。

## 本地运行

需要 Node.js 20 或更高版本：

```bash
npm install
npm run check
npm run dev
```

然后打开 `http://127.0.0.1:4173/`。

## 页面配置

通过构建环境变量配置发布站链接。本项目只提供静态介绍页和固定模拟数据的离线 Demo，不计划提供在线分析工作台。需要运行自己的实例时，用户可克隆源码，按主仓库 README 在本机配置并启动。

```text
PUBLIC_DEMO_URL=https://aegleobserver.github.io/our-map-demo/
PUBLIC_REPOSITORY_URL=https://github.com/PennEwan/Baidu-map
PUBLIC_RELEASES_URL=https://github.com/PennEwan/Baidu-map/releases
```

只有 HTTPS URL 和相对路径会被接受。`PUBLIC_*` 中不放任何服务端 AK。

## 构建

```bash
npm run check
npm run build
```

构建产物在 `dist/`，可部署到 GitHub Pages 或任意静态托管服务。在线 Demo 始终使用固定模拟数据；本项目不托管在线分析工作台，实际分析需由用户在本机配置和启动。

## 内容边界

- 15 分钟步行圈与 1 公里分类服务判断是两套独立指标。
- Demo 使用固定模拟数据，不代表真实社区结论。
- 单个中心点的结果不能代表整个社区、街道或全体人口的覆盖率。

## 进度与后续待办

- **#1 仓库链接：已完成。** 源码链接指向 `PennEwan/Baidu-map`，Releases 链接指向该仓库的 `/releases` 页面。
- **#2 在线入口：已完成（范围已明确）。** 仅提供固定模拟数据的在线 Demo，不规划在线分析工作台。需要本地使用时，用户从源码仓库克隆项目并在本机配置运行。
- **#3 页面截图：已完成。** 四张截图来自本地离线 Demo，使用虚构演示数据；图片使用相对路径，兼容 GitHub Pages 项目子路径。
- **#4 修订帮助文档：后置。** 按当前任务安排暂不进行帮助文档整体修订。
- **#5 依赖与示例数据：已同步。** 依赖清单镜像后端锁文件；JSON 样例对应当前体检 v2 创建请求，并明确标为请求格式示例。
- **#6 性能表格：待完成。** 尚无适合公开展示的统一实测指标，不填未经验证的数值。
- **#7 侧边导航：待完成。** 仍需在完整页面下复查滚动定位及视觉表现。
