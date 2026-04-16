import http.server
import socketserver
import json
import subprocess
import sys
import tempfile
import os
import uuid
import re

PORT = 8000

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

# 自定义HTTP请求处理器
class PythonCodeHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            # 健康检查
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "status": "healthy",
                "message": "Python在线编辑器API运行正常",
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/run':
            # 处理代码执行请求
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(post_data)
                if not data or "code" not in data:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {
                        "success": False,
                        "error": "请输入Python代码"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                code = data["code"].strip()
                
                if not code:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {
                        "success": False,
                        "error": "请输入Python代码"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 安全检查
                is_safe, error_msg = is_safe_code(code)
                if not is_safe:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {
                        "success": False,
                        "error": f"安全警告：{error_msg}"
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return
                
                # 执行代码
                stdout, stderr = execute_python_code(code)
                
                # 构造响应
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                if stderr:
                    response = {
                        "success": False,
                        "error": stderr
                    }
                else:
                    response = {
                        "success": True,
                        "output": stdout or "代码执行成功，没有输出"
                    }
                
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {
                    "success": False,
                    "error": f"服务器错误：{str(e)}"
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # 处理CORS预检请求
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# 主程序入口
if __name__ == "__main__":
    print("=" * 50)
    print("Python在线编辑器 - 后端服务")
    print("=" * 50)
    print("\n启动服务中...")
    print(f"访问地址: http://localhost:{PORT}")
    print("\n按 Ctrl+C 停止服务")
    print("=" * 50)
    
    # 创建服务器
    with socketserver.TCPServer(("0.0.0.0", PORT), PythonCodeHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务已停止")
            httpd.shutdown()
