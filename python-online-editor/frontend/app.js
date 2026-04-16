// 全局变量
let editor = null;
const API_URL = 'http://localhost:8000/run';

// 初始化Monaco Editor
function initMonacoEditor() {
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
    
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('monaco-editor'), {
            value: `# 欢迎使用Python在线编辑器！
# 在这里输入你的Python代码，点击"运行代码"查看结果

print("Hello, Python!")

# 试试这个示例：计算斐波那契数列
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("斐波那契数列前10项:")
for i in range(10):
    print(fibonacci(i), end=" ")
`,
            language: 'python',
            theme: 'vs-dark',
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true
        });
    });
}

// 发送Ajax请求运行Python代码
function runPythonCode() {
    const code = editor.getValue();
    const outputArea = document.getElementById('output');
    const statusIndicator = document.getElementById('status-indicator');
    
    if (!code.trim()) {
        outputArea.textContent = '请输入Python代码';
        outputArea.className = 'output-area error';
        return;
    }
    
    outputArea.textContent = '正在执行...';
    outputArea.className = 'output-area';
    statusIndicator.className = 'status-indicator running';
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        statusIndicator.className = 'status-indicator';
        
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    outputArea.textContent = response.output;
                    outputArea.className = 'output-area success';
                    statusIndicator.className = 'status-indicator success';
                } else {
                    outputArea.textContent = response.error || '执行失败';
                    outputArea.className = 'output-area error';
                    statusIndicator.className = 'status-indicator error';
                }
            } catch (e) {
                outputArea.textContent = '解析响应失败: ' + e.message;
                outputArea.className = 'output-area error';
                statusIndicator.className = 'status-indicator error';
            }
        } else {
            outputArea.textContent = '服务器错误: ' + xhr.status;
            outputArea.className = 'output-area error';
            statusIndicator.className = 'status-indicator error';
        }
    };
    
    xhr.onerror = function() {
        outputArea.textContent = '网络错误，请检查后端服务是否启动';
        outputArea.className = 'output-area error';
        statusIndicator.className = 'status-indicator error';
    };
    
    xhr.send(JSON.stringify({ code: code }));
}

// 清空代码
function clearCode() {
    if (editor) {
        editor.setValue('');
    }
    document.getElementById('output').textContent = '';
    document.getElementById('output').className = 'output-area';
    document.getElementById('status-indicator').className = 'status-indicator';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initMonacoEditor();
    
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    if (runBtn) {
        runBtn.addEventListener('click', runPythonCode);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCode);
    }
    
    // 快捷键支持：Ctrl+Enter 运行代码
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            runPythonCode();
        }
    });
});
