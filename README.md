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

通过构建环境变量配置发布站链接。发布站提供静态介绍页、在线工作台入口和固定模拟数据的离线 Demo。在线工作台连的是已部署的后端，后端不可用时页面会明确报错；需要自己的实例时，克隆源码按主仓库 README 在本机配置启动。

```text
PUBLIC_APP_URL=https://linyu-life-circle.netlify.app
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

构建产物在 `dist/`，可部署到 GitHub Pages 或任意静态托管服务。在线工作台指向已部署的独立后端（本仓库只放链接，不托管后端）；离线 Demo 始终使用固定模拟数据。

## 内容边界

- 15 分钟步行圈与 1 公里分类服务判断是两套独立指标。
- Demo 使用固定模拟数据，不代表真实社区结论。
- 单个中心点的结果不能代表整个社区、街道或全体人口的覆盖率。

## 进度与后续待办

- **#1 仓库链接：已完成。** 源码链接指向 `PennEwan/Baidu-map`，Releases 链接指向该仓库的 `/releases` 页面。
- **#2 在线入口：已完成（2026-10-12）。** 正式工作台入口指向 `https://linyu-life-circle.netlify.app`（`PUBLIC_APP_URL` / `config.js` 的 `appUrl`），离线 Demo 入口保留；两者在页面上分开说明，工作台需要后端在线。
- **#3 页面截图：已改为真实体检截图（2026-10-11）。** 首屏与四张「操作界面」图来自一次在本机运行的**真实体检**（E8.2、400 档，中心 `121.513925, 31.313079`，真实百度底图与真实后端），随图标注了实测日期与结果状态。它们只说明界面长什么样，**不构成精度验收**；离线 Demo 仍是固定模拟数据，两者不要混读。
- **#4 修订帮助文档：已完成（2026-10-11）。** 帮助页已按当前工作台改写：坐标是 BD09LL 且经度在前、1 公里＝步行 1000 米、浏览器 AK 缺失时的实际表现、Node 版本要求、OSM 启动预热、类别口径（10 大类 / 31 个检索小类）、两个 AK 变量分别写在哪，并标注了核对日期。
- **#5 依赖与示例数据：已同步。** 依赖清单镜像后端锁文件；JSON 样例对应当前体检 v2 创建请求，并明确标为请求格式示例。
- **#6 性能表格：待完成。** 尚无适合公开展示的统一实测指标，不填未经验证的数值。
- **#7 侧边导航：待完成。** 仍需在完整页面下复查滚动定位及视觉表现。
