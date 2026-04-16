from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import sys
import tempfile
import os
import uuid
from typing import Optional
import re

# 初始化FastAPI应用
app = FastAPI(title="Python在线编辑器API", version="1.0.0")

# 配置CORS允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义请求数据模型
class CodeRequest(BaseModel):
    code: str

# 定义响应数据模型
class CodeResponse(BaseModel):
    success: bool
    output: Optional[str] = None
    error: Optional[str] = None

# 安全检查：禁止执行危险操作
def is_safe_code(code: str) -> tuple[bool, str]:
    """
    检查代码是否包含危险操作
    返回：(是否安全, 错误信息)
    """
    # 禁止的危险模块和函数
    dangerous_patterns = [
        # 文件系统操作
        r'os\.system',
        r'os\.popen',
        r'subprocess',
        r'eval\(',
        r'exec\(',
        r'compile\(',
        # 网络操作
        r'socket',
        r'requests',
        r'urllib',
        # 系统操作
        r'__import__',
        r'globals\(\)',
        r'locals\(\)',
        # 文件操作
        r'open\(',
        r'os\.open',
        r'os\.remove',
        r'os\.rmdir',
        r'os\.mkdir',
        # 进程操作
        r'os\.kill',
        r'os\.execl',
        r'os\.execv',
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, code):
            return False, f"检测到危险操作：{pattern}"
    
    return True, ""

# 执行Python代码
def execute_python_code(code: str, timeout: int = 5) -> tuple[str, str]:
    """
    执行Python代码并返回结果
    返回：(标准输出, 标准错误)
    """
    # 创建临时文件
    temp_file = None
    try:
        # 生成唯一的临时文件名
        temp_filename = f"temp_{uuid.uuid4().hex}.py"
        temp_file = os.path.join(tempfile.gettempdir(), temp_filename)
        
        # 写入代码到临时文件
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(code)
        
        # 执行Python代码
        result = subprocess.run(
            [sys.executable, temp_file],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        
        return result.stdout, result.stderr
        
    except subprocess.TimeoutExpired:
        return "", f"执行超时（超过{timeout}秒）"
    except Exception as e:
        return "", str(e)
    finally:
        # 清理临时文件
        if temp_file and os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except:
                pass

# API端点：执行Python代码
@app.post("/run", response_model=CodeResponse)
async def run_code(request: CodeRequest):
    """
    接收Python代码并执行，返回执行结果
    """
    code = request.code.strip()
    
    if not code:
        raise HTTPException(status_code=400, detail="请输入Python代码")
    
    # 安全检查
    is_safe, error_msg = is_safe_code(code)
    if not is_safe:
        return CodeResponse(
            success=False,
            error=f"安全警告：{error_msg}"
        )
    
    # 执行代码
    stdout, stderr = execute_python_code(code)
    
    # 构造响应
    if stderr:
        return CodeResponse(
            success=False,
            error=stderr
        )
    else:
        return CodeResponse(
            success=True,
            output=stdout or "代码执行成功，没有输出"
        )

# API端点：健康检查
@app.get("/")
async def health_check():
    """
    健康检查接口
    """
    return {
        "status": "healthy",
        "message": "Python在线编辑器API运行正常",
        "version": "1.0.0"
    }

# 主程序入口
if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print("Python在线编辑器 - 后端服务")
    print("=" * 50)
    print("\n启动服务中...")
    print("访问地址: http://localhost:8000")
    print("API文档: http://localhost:8000/docs")
    print("\n按 Ctrl+C 停止服务")
    print("=" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )
