# API Key 安全设置指南

## 🔐 安全最佳实践

### 1. 环境变量管理

**推荐方式** - 使用 `.env` 文件（已加入 .gitignore）：

```bash
# .env 文件（不要提交到git）
OPENAI_API_KEY=sk-your-actual-api-key-here
FLASK_DEBUG=True
PORT=3001
SECRET_KEY=your-secret-key-here
```

### 2. 生产环境设置

**方式一：系统环境变量**

```bash
export OPENAI_API_KEY="sk-your-actual-api-key-here"
```

**方式二：Docker 环境变量**

```yaml
# docker-compose.yml
environment:
  - OPENAI_API_KEY=${OPENAI_API_KEY}
```

**方式三：云平台环境变量**

- Heroku: `heroku config:set OPENAI_API_KEY=your-key`
- Vercel: 在项目设置中添加环境变量
- AWS: 使用 Parameter Store 或 Secrets Manager

### 3. 开发环境设置

**本地开发**：

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 中填入真实的 API key
3. 确保 `.env` 在 `.gitignore` 中

```bash
# .env.example（可以提交到git）
OPENAI_API_KEY=your_openai_api_key_here
FLASK_DEBUG=True
PORT=3001
SECRET_KEY=dev-secret-key-change-in-production
```

### 4. 安全检查清单

- ✅ `.env` 文件已加入 `.gitignore`
- ✅ 生产环境使用环境变量而非硬编码
- ✅ API key 不在代码中暴露
- ✅ 定期轮换 API key
- ✅ 使用最小权限原则

### 5. 测试模式

如果没有设置 API key，应用会自动进入测试模式：

- 返回模拟的 AI 响应
- 功能完全可用
- 适合开发和测试

### 6. 获取 OpenAI API Key

1. 访问 https://platform.openai.com/
2. 注册/登录账户
3. 进入 API Keys 页面
4. 创建新的 API key
5. 复制并安全保存

### 7. 验证设置

```bash
# 检查环境变量
echo $OPENAI_API_KEY

# 启动应用
python app_refactored.py

# 应该看到：
# Warning: OPENAI_API_KEY not set. Running in test mode.
# 或者没有警告（如果设置了正确的key）
```

## 🚨 安全警告

1. **永远不要**将 API key 提交到 git 仓库
2. **永远不要**在代码中硬编码 API key
3. **永远不要**在日志中打印 API key
4. **定期检查**API 使用情况，避免意外费用

## 🔧 故障排除

**问题**: "OPENAI_API_KEY is required"
**解决**: 设置环境变量或使用测试模式

**问题**: API 调用失败
**解决**: 检查 API key 是否正确，网络连接是否正常

**问题**: 费用过高
**解决**: 设置使用限制，监控 API 调用
