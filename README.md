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

通过构建环境变量注入外部入口。未配置 Demo 或正式工作台地址时，页面会显示“待配置”，不会伪造可用入口。

```text
PUBLIC_DEMO_URL=https://<demo-pages-url>/
PUBLIC_APP_URL=https://<official-app-url>/
PUBLIC_REPOSITORY_URL=https://github.com/<owner>/<site-repo>/
PUBLIC_RELEASES_URL=https://github.com/<owner>/<site-repo>/releases
```

只有 HTTPS URL 和相对路径会被接受。`PUBLIC_*` 中不放任何服务端 AK。

## 构建

```bash
npm run check
npm run build
```

构建产物在 `dist/`，可部署到 GitHub Pages 或任意静态托管服务。发布站中的 Demo 说明必须继续标注为模拟数据；正式分析需要独立的 API 服务。

## 内容边界

- 15 分钟步行圈与 1 公里分类服务判断是两套独立指标。
- Demo 使用固定模拟数据，不代表真实社区结论。
- 单个中心点的结果不能代表整个社区、街道或全体人口的覆盖率。

## 后续待办

以下内容需要在正式发布前补齐：

- **接入真实仓库链接**：`config.js` 中 `repositoryUrl` / `releasesUrl` 目前指向示例仓库，需要替换为实际源码仓库地址。
- **配置在线入口**：`PUBLIC_DEMO_URL`、`PUBLIC_APP_URL` 未配置时页面显示"待配置"，正式部署前需注入真实地址。
- **补充页面截图**：截图轮播板块引用 `/figure/` 目录下的四张截图（`01-select-location.png`、`02-walkable-area.png`、`03-facilities.png`、`04-report.png`），需要将实际使用截图放入该目录。
- **修订帮助文档**：`help/` 目录下的帮助文档涉及百度 AK 配置与 OSM 路网下载，需与真实后端仓库的启动步骤核对后修订。
- **补全性能表格**：`#method` 板块的性能表格（构圈耗时、边界精度、设施匹配率、报告生成耗时）数值与说明列仍为空，需依据实际测试数据填写。
- **校验侧边导航**：右侧导航的折线路径、板块锚点与新增板块（资源、指南）需在完整页面下复查滚动定位。
