# Python在线编辑器

一个简单、安全、易用的Python在线代码编辑器，支持在浏览器中编写和运行Python代码。

## 项目结构

```
python-online-editor/
├── README.md              # 项目说明文档（本文件）
├── requirements.txt       # Python依赖包列表
├── frontend/              # 前端代码目录
│   ├── index.html        # 前端HTML页面（主页面）
│   ├── styles.css        # 前端CSS样式（页面样式）
│   └── app.js            # 前端JavaScript逻辑（编辑器和交互）
└── backend/              # 后端代码目录
    └── main.py           # FastAPI后端服务（代码执行API）
```

## 技术栈

### 前端
- **HTML5**：页面结构
- **CSS3**：页面样式
- **原生JavaScript**：交互逻辑
- **Monaco Editor**：VS Code同款代码编辑器，提供Python语法高亮

### 后端
- **Python 3.x**：编程语言
- **FastAPI**：Web框架
- **Uvicorn**：ASGI服务器

## 本地运行步骤

### 1. 环境准备

确保你的电脑已经安装了Python 3.7或更高版本。可以在终端输入以下命令检查：

```bash
python --version
```

或

```bash
python3 --version
```

### 2. 安装后端依赖

打开终端，进入项目根目录：

```bash
cd python-online-editor
```

安装所需的Python包：

```bash
pip install -r requirements.txt
```

如果pip命令很慢，可以使用国内镜像源：

```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 3. 启动后端服务

在终端中运行后端服务：

```bash
cd backend
python main.py
```

或者使用uvicorn直接启动：

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

看到以下提示说明后端启动成功：

```
==================================================
Python在线编辑器 - 后端服务
==================================================

启动服务中...
访问地址: http://localhost:8000
API文档: http://localhost:8000/docs

按 Ctrl+C 停止服务
==================================================
```

### 4. 打开前端页面

前端页面不需要额外启动服务，直接用浏览器打开即可：

1. 找到 `frontend` 文件夹
2. 双击打开 `index.html` 文件
3. 或者在浏览器地址栏输入文件路径，例如：
   ```
   file:///你的项目路径/python-online-editor/frontend/index.html
   ```

## 使用说明

### 基本操作

1. **编写代码**：在编辑器中输入Python代码
2. **运行代码**：点击"运行代码"按钮或按 `Ctrl+Enter` 快捷键
3. **查看结果**：在下方的"运行结果"区域查看输出
4. **清空代码**：点击"清空代码"按钮清空编辑器

### 示例代码

编辑器默认提供了一个简单的示例代码，可以直接运行：

```python
# 欢迎使用Python在线编辑器！
print("Hello, Python!")

# 试试这个示例：计算斐波那契数列
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("斐波那契数列前10项:")
for i in range(10):
    print(fibonacci(i), end=" ")
```

### 状态指示

- **灰色圆点**：等待状态
- **橙色闪烁**：正在执行
- **绿色圆点**：执行成功
- **红色圆点**：执行错误

## 本地测试注意事项

### 安全限制

为了安全起见，本项目做了以下限制：

1. **超时限制**：代码执行时间不能超过5秒
2. **禁止危险操作**：禁止执行以下操作：
   - 文件系统操作（open、os.remove等）
   - 系统命令执行（os.system、subprocess等）
   - 网络操作（socket、requests等）
   - 动态代码执行（eval、exec等）

### 常见问题

**Q: 点击运行代码没反应？**

A: 请确保：
1. 后端服务已经启动
2. 后端服务运行在 http://localhost:8000
3. 打开浏览器的开发者工具（F12）查看控制台是否有错误

**Q: 提示"网络错误"？**

A: 这通常是因为后端服务没有启动，或者前端和后端的地址不匹配。请检查：
1. 后端是否正常运行
2. 浏览器地址栏是否正确
3. app.js文件中的API_URL是否正确

**Q: 可以修改超时时间吗？**

A: 可以！打开 `backend/main.py` 文件，找到 `execute_python_code` 函数，修改 `timeout` 参数即可。

**Q: 可以在手机上使用吗？**

A: 可以！页面已经做了响应式适配，在手机浏览器中也能正常使用。

## API文档

后端提供了API文档，启动后端服务后访问：

```
http://localhost:8000/docs
```

可以在浏览器中直接测试API接口。

## 技术细节

### 前后端通信

使用原生Ajax（XMLHttpRequest）进行异步通信，无需刷新页面即可提交代码和获取结果。

### 代码执行原理

1. 前端将代码发送到后端API
2. 后端接收代码并进行安全检查
3. 后端将代码写入临时文件
4. 使用subprocess执行Python代码
5. 捕获标准输出和错误
6. 返回结果给前端
7. 清理临时文件

### 安全措施

- 使用正则表达式检查危险代码
- 限制代码执行时间
- 不允许访问文件系统
- 不允许执行系统命令
- 执行完成后清理临时文件

## 项目特色

1. **简洁美观**：现代化的UI设计，简洁易用
2. **语法高亮**：使用Monaco Editor，提供专业的代码编辑体验
3. **快速响应**：无刷新执行，结果实时显示
4. **安全可靠**：多重安全限制，保护本地环境
5. **新手友好**：详细的文档和说明，开箱即用
6. **响应式设计**：支持电脑和手机端

## 下一步

你可以尝试：
1. 修改前端样式，打造自己喜欢的界面
2. 扩展后端功能，添加更多安全限制
3. 集成更多Python库
4. 添加代码保存功能
5. 支持多个编辑器标签页

## 许可证

本项目仅供学习和个人使用。

---

祝你使用愉快！有问题随时查看本文档。
