# 中瑞医疗 · 月度拍摄计划可视化管理系统

多人协作版，部署到 Railway，所有人通过同一密码访问，数据实时共享。

## 部署到 Railway

### 步骤 1：上传到 GitHub

1. 在 GitHub 新建一个 private 仓库，比如 `zr-shooting-plan`
2. 把整个 `zr-shooting-plan-server` 文件夹的内容推上去
   ```bash
   cd zr-shooting-plan-server
   git init
   git add .
   git commit -m "init"
   git remote add origin git@github.com:你的GitHub用户名/zr-shooting-plan.git
   git branch -M main
   git push -u origin main
   ```

### 步骤 2：在 Railway 创建项目

1. 打开 https://railway.app/dashboard
2. 点 **New Project** → **Deploy from GitHub repo**
3. 选刚才上传的仓库
4. Railway 自动检测到 nixpacks.toml，开始构建

### 步骤 3：配置环境变量（可选）

在 Railway 项目的 **Variables** 标签里加：

| Key | Value | 说明 |
|---|---|---|
| `APP_PASSWORD` | `888` | 访问密码（默认就是 888，可不设） |
| `SESSION_SECRET` | （随机字符串） | 登录会话签名密钥（建议改成你自己的） |

### 步骤 4：添加持久化卷

**⚠️ 重要**：数据库默认存在容器内，Railway 重启会丢数据。必须挂载持久卷：

1. Railway 项目 → **Settings** → **Volumes**
2. 点 **+ New Volume**
3. **Mount Path** 填：`/app/data`
4. **Size** 选 1GB（够用很久）
5. 点 **Create**
6. 触发一次重新部署

### 步骤 5：生成公网 URL

1. **Settings** → **Networking** → **Generate Domain**
2. 拿到类似 `zr-shooting-plan-production.up.railway.app` 的地址
3. 打开网址，输入密码 `888` 即可登录

---

## 本地开发

```bash
cd zr-shooting-plan-server
npm install
node server.js
```

打开 http://localhost:3000

## 默认密码

`888`

修改方式：设 Railway 环境变量 `APP_PASSWORD`

## 数据备份

数据存在 `data/plan.db`（Railway 上是 Volume 里的 `plan.db`）。

定期备份方法：登录页右上角点退出 → 用 SQLite 客户端连接 Volume 上的 db 文件下载。
（或者后面我可以加一个 `/api/export` 接口让你下 JSON 备份。）
