# OSM 路网数据下载说明

「15 分钟生活圈」的路网数据有两种取得方式：直接使用部署方提供的运行包（推荐），或从 Geofabrik 下载原始数据自行构建。任选其一即可。

## 方式一：使用部署方提供的运行包（推荐）

运行包是预先构建好的 ZIP，内含图缓存、覆盖边界、风险层、障碍层和 `data/osm/manifest.json`。下载地址与 ZIP 的 SHA256 会随包一同提供。

在仓库根目录执行一条命令，即可完成下载、校验、解压和激活：

```bash
python backend/scripts/setup_osm_region.py download --url <runtime-package-url> --region <region-id> --sha256 <archive-sha256>
```

- `<runtime-package-url>`：运行包 ZIP 的下载地址。
- `<region-id>`：地区标识，如 `shanghai`，仅使用小写字母、数字、`_`、`-`；可省略，省略时按包内 `manifest.json` 自动识别。
- `<archive-sha256>`：可省略但建议提供；填写后会校验下载文件的完整性。

如果 ZIP 已经手动解压到 `data/osm/`，跳过下载，改为查看并激活地区包：

```bash
python backend/scripts/setup_osm_region.py list
python backend/scripts/setup_osm_region.py select --region <region-id>
```

暂时不使用 OSM 时，执行 `python backend/scripts/setup_osm_region.py clear` 可恢复纯百度模式。

## 方式二：从 Geofabrik 自行构建（高级）

需要其他地区或想重建快照时，从 Geofabrik 官方站点下载原始文件：

1. 打开 [Geofabrik Downloads](https://download.geofabrik.de/)，按「大洲 → 国家 → 地区」进入目标页面（如 Asia → China → Shanghai）；各地区的页面会列出可下载文件，格式说明见官方的 [Technical Details](https://download.geofabrik.de/technical.html)。
2. 下载同一次快照的 `.osm.pbf`（路网数据）与 `.poly`（覆盖边界），保存到本地并记录两者的 SHA256。
3. 安装一次构图依赖，再运行构建命令：

   ```bash
   python -m pip install -r backend/requirements-osm-build.txt
   python backend/scripts/setup_osm_region.py build --region <region-id> --pbf <path-to-pbf> --coverage <path-to-poly> --version <snapshot-id> --metric-crs <metric-crs> --source <pbf-url> --downloaded-at <yyyy-mm-dd>
   ```

- `--version`：快照标识，如 `geofabrik-shanghai-260913`。
- `--metric-crs`：米制投影，如 `EPSG:32651`。
- `--source` 和 `--downloaded-at`：记录数据来源与下载日期，一并写入 `manifest.json`。

构建产物位于 `data/osm/regions/<region-id>/`，通过校验后自动激活；`--no-simplify` 用于排查构图问题，替换已有地区时追加 `--force`。

## 参考与注意事项

- 构图细节与完整流程见仓库内的 `data/osm/README.md` 和 `backend/docs/OSM_REGION_SETUP.md`。
- 路网数据来自 OpenStreetMap contributors，按 [Open Database License（ODbL）](https://opendatacommons.org/licenses/odbl/1-0/) 提供；使用或再分发时请保留 `© OpenStreetMap contributors` 署名。
- 数据是固定快照，不代表实时道路状态，也不保证包含所有门禁、校园通道和小区内部道路；缺少数据时相关结果标为「未评估」或「部分证据」，不会写成 0。
