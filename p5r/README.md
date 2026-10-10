# P5R 课设（小组协作说明）

本仓库是 **P5R（女神异闻录5 皇家版）主题** 的 Web 前端课设原型与素材整理。技术栈约束：**HTML + CSS + 原生 JavaScript（禁止 Vue/React 等框架）**。

## 目录约定（重要）

- `code/`：**最终要交付的“商业原型站”**（多页面 + 共享样式/脚本）
- `code/shared/`：全站共享资源（`site.css` / `site.js`）
- `code/player1/pages/` ~ `code/player4/pages/`：按成员拆分的页面（互不直接改对方负责页面）
- `code/player1/分工明细.md` ~ `code/player4/分工明细.md`：每个人的页面/功能责任边界
- `shared/p5ui/`：移植的 p5-ui 素材与 CSS（字体、图标、肖像、背景等）
- `test/`：组件/交互大演示页（用来参考样式与写法，不一定作为最终交付）

> 协作铁律：**每个人主改自己负责的 pages**；共享文件（`code/shared/*`）改动要小、要同步通知、要写清楚提交说明。

## 第一次拉取与运行

### 克隆仓库

```bash
git clone https://gitee.com/maosiyu26/p5r.git
cd p5r
```

### 本地打开（推荐用本地服务器）

```bash
# Python
python -m http.server 8000
```

浏览器访问 `http://localhost:8000/code/`，入口会跳转到登录页。

## Git 协作流程（推荐做法）

### 1）不要直接在 main 上开发

每个人从 `main` 拉一个自己的分支：

```bash
git checkout main
git pull
git checkout -b feat/player2-login   # 分支名示例：feat/你的模块
```

### 2）开发中：小步提交、写清楚信息

```bash
git status
git add .
git commit -m "feat(player2): 优化登录校验与跳转"
```

**提交信息建议格式**：

- `feat(playerX): ...` 新功能/增强
- `fix(playerX): ...` 修复 bug
- `style: ...` 纯样式调整
- `docs: ...` 文档/分工说明
- `chore: ...` 杂项（重命名、清理文件等）

### 3）推送自己的分支到远端

```bash
git push -u origin HEAD
```

### 4）用 Gitee 发起 Pull Request（合并请求）

- 目标分支：`main`
- 标题写清楚：改了哪些页面/模块
- 自测说明写清楚：从哪个页面进入、怎么点能看到效果

**合并规则（建议）**：

- 共享文件（`code/shared/*`）改动：至少让另一位同学过一眼
- PR 合并后，大家都要执行一次：

```bash
git checkout main
git pull
```

## 冲突处理（最常见问题）

### 什么时候会冲突

- 两个人同时改了同一个文件（尤其是 `code/shared/site.css`、`code/shared/site.js`）
- 或者同时改同一段 HTML 结构

### 怎么解决（基础步骤）

```bash
git checkout 你的分支
git pull --rebase origin main
```

出现冲突后：

1. 打开冲突文件，手动保留正确内容
2. `git add 冲突文件`
3. `git rebase --continue`
4. 推送（必要时加 `--force-with-lease`，仅限你自己的分支）

> 重要：**不要对 main 做强推**。只在自己分支 rebase 后使用 `--force-with-lease`。

## 大文件/素材注意事项

- 素材尽量放在 `shared/` 或项目约定目录，不要随意散落根目录
- 不要提交临时文件：例如 Office 锁文件 `~$*.docx`、系统垃圾文件等（已在 `.gitignore` 中排除）
- 若仓库变得非常大：优先讨论“哪些素材必须进仓库”，不要盲目塞所有图片

## 页面分工入口

直接查看每个人的 `分工明细.md`：

- `code/player1/分工明细.md`
- `code/player2/分工明细.md`
- `code/player3/分工明细.md`
- `code/player4/分工明细.md`

