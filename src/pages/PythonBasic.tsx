import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

// 声明Pyodide类型
declare global {
  interface Window {
    pyodide: any;
  }
}

// 代码示例数据
const codeExamples = {
  variables: `# 变量赋值
name = "黄安德"
age = 20
is_student = True

# 动态类型
x = 10  # int
x = "hello"  # str
x = [1, 2, 3]  # list

print(name, age, is_student)`,
  dataTypes: `# 基本数据类型
integer = 100
float_num = 3.14
complex_num = 1 + 2j
boolean = True
string = "Python基础"

# 容器数据类型
list_example = [1, 2, 3, "Python"]
tuple_example = (1, 2, 3, "Python")
dict_example = {"name": "黄安德", "age": 20}
set_example = {1, 2, 3, 3, 4}  # 自动去重

print(list_example[0])
print(dict_example["name"])`,
  operators: `# 算术运算符
print(10 + 3)  # 13
print(10 - 3)  # 7
print(10 * 3)  # 30
print(10 / 3)  # 3.333...
print(10 // 3)  # 3 (取整)
print(10 % 3)  # 1 (取余)
print(10 ** 3)  # 1000 (乘方)

# 比较运算符
print(10 == 3)  # False
print(10 != 3)  # True
print(10 > 3)  # True

# 逻辑运算符
print(True and False)  # False
print(True or False)  # True
print(not True)  # False`,
  controlFlow: `# if-elif-else
score = 85
if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 60:
    print("及格")
else:
    print("不及格")

# for循环
for i in range(5):
    print(i)

# while循环
count = 0
while count < 5:
    print(count)
    count += 1

# 列表推导式
squares = [x**2 for x in range(10)]
print(squares)`,
  functions: `# 函数定义
def greet(name):
    """问候函数"""
    return f"Hello, {name}!"

# 默认参数
def calculate_area(length, width=1):
    return length * width

# 可变参数
def sum_numbers(*args):
    return sum(args)

# 关键字参数
def student_info(**kwargs):
    return kwargs

print(greet("黄安德"))
print(calculate_area(5))
print(sum_numbers(1, 2, 3, 4, 5))
print(student_info(name="黄安德", age=20))`,
  oop: `# 类定义
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def study(self, course):
        return f"{self.name} is studying {course}"
    
    def __str__(self):
        return f"Student(name='{self.name}', age={self.age})"

# 继承
class DataScienceStudent(Student):
    def __init__(self, name, age, major):
        super().__init__(name, age)
        self.major = major
    
    def analyze_data(self):
        return f"{self.name} is analyzing data"

# 创建对象
student = Student("黄安德", 20)
data_student = DataScienceStudent("黄安德", 20, "商务数据分析")

print(student)
print(student.study("Python基础"))
print(data_student.analyze_data())`,
  exception: `# 异常处理
try:
    result = 10 / 0
except ZeroDivisionError:
    print("除数不能为零")
except Exception as e:
    print(f"发生错误: {e}")
finally:
    print("无论是否发生异常都会执行")

# 自定义异常
class CustomError(Exception):
    pass

try:
    raise CustomError("这是一个自定义异常")
except CustomError as e:
    print(f"捕获到自定义异常: {e}")`,
  file: `# 文件读写
# 写入文件
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("Hello, Python!\n")
    f.write("这是一个文件写入示例\n")

# 读取文件
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 逐行读取
with open("example.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())`
};

export default function PythonBasic() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [exerciseInput, setExerciseInput] = useState<string>('');
  const [exerciseOutput, setExerciseOutput] = useState<string>('');
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [pyodide, setPyodide] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Starting Pyodide initialization...');

        // 检查Pyodide是否已经加载
        if (typeof window.loadPyodide === 'function') {
          try {
            console.log('Using top-level loadPyodide function');
            const pyodideInstance = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
            });
            console.log('Pyodide initialized successfully');
            setPyodide(pyodideInstance);
          } catch (loadError) {
            console.error('Error loading Pyodide:', loadError);
            throw loadError;
          }
        } else {
          console.log('loadPyodide not found, loading script...');
          
          // 动态加载Pyodide脚本
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
            script.type = 'text/javascript';
            script.crossOrigin = 'anonymous';
            script.onload = () => {
              console.log('Pyodide script loaded successfully');
              // 直接调用loadPyodide
              if (typeof window.loadPyodide === 'function') {
                resolve();
              } else {
                reject(new Error('loadPyodide function not available after script load'));
              }
            };
            script.onerror = (e) => {
              console.error('Failed to load pyodide.js:', e);
              reject(new Error('Failed to load pyodide.js'));
            };
            document.body.appendChild(script);
          });

          // 再次尝试初始化
          if (typeof window.loadPyodide === 'function') {
            try {
              const pyodideInstance = await window.loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
              });
              console.log('Pyodide initialized successfully');
              setPyodide(pyodideInstance);
            } catch (loadError) {
              console.error('Error loading Pyodide:', loadError);
              throw loadError;
            }
          } else {
            throw new Error('loadPyodide function not found');
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError('Failed to load Python interpreter: ' + errorMessage);
        console.error('Pyodide initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initPyodide();
  }, []);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
      setActiveSubSection(null);
    } else {
      setActiveSection(section);
      setActiveSubSection(null);
    }
  };

  const toggleSubSection = (subsection: string) => {
    if (activeSubSection === subsection) {
      setActiveSubSection(null);
    } else {
      setActiveSubSection(subsection);
    }
  };

  const runExercise = (exercise: string) => {
    setCurrentExercise(exercise);
    setExerciseInput('');
    setExerciseOutput('');
  };

  const executeCode = async () => {
    if (!pyodide) {
      setExerciseOutput('Python interpreter is not loaded yet.');
      return;
    }

    try {
      setExerciseOutput('Executing...');
      
      // 执行代码
      const result = await pyodide.runPythonAsync(exerciseInput);
      setExerciseOutput(result || 'No output');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setExerciseOutput('执行错误：' + errorMessage);
      console.error('Code execution error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 导航栏 */}
      <nav className="bg-white text-emerald-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-light tracking-wide">黄安德</div>
          <div className="flex space-x-6">
            <a href="/" className="hover:text-emerald-500 transition-colors text-sm font-medium">首页</a>
            <a href="/#courses" className="hover:text-emerald-500 transition-colors text-sm font-medium">课程</a>
            <a href="/#about" className="hover:text-emerald-500 transition-colors text-sm font-medium">关于我</a>
          </div>
        </div>
      </nav>

      {/* 页面标题 */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <div className="w-24 h-1 bg-emerald-400 mx-auto mb-6"></div>
            <h1 className="text-4xl font-light text-gray-800 mb-4">Python基础知识体系</h1>
            <div className="w-24 h-1 bg-emerald-400 mx-auto"></div>
          </div>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Python作为一门高级、解释型、通用的编程语言，以其简洁的语法和强大的生态成为了数据分析领域的首选工具。
            本课程将系统梳理Python的基础语法、数据结构、控制逻辑及模块化编程，为后续的数据采集、清洗与分析打下坚实的基石。
          </p>
        </div>
      </section>

      {/* 知识点内容 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* 一、开发环境与基础语法规范 */}
          <div className="mb-12">
            <div 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => toggleSection('environment')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">一、开发环境与基础语法规范</h2>
                <span className={`text-emerald-600 transition-transform ${activeSection === 'environment' ? 'transform rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              <p className="text-gray-600 mt-2">Python编程的基石，涉及代码的编写规则与运行环境。</p>
            </div>
            
            {activeSection === 'environment' && (
              <div className="mt-4 pl-6 border-l-2 border-emerald-100">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">环境搭建与管理</h3>
                  <p className="text-gray-600 mb-4">
                    推荐安装Python 3.x版本（Python 2已停止维护）。开发工具可选择轻量级的VS Code或专业的PyCharm，
                    数据分析场景强烈推荐使用Anaconda进行环境与包的管理。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">编码与标识符</h3>
                  <p className="text-gray-600 mb-4">
                    Python 3源码文件默认使用UTF-8编码，支持中文作为变量名。标识符（变量名）需以字母或下划线开头，
                    区分大小写，且不能使用Python保留字（关键字）。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">缩进与注释</h3>
                  <p className="text-gray-600 mb-4">
                    Python最具特色的是使用缩进（通常为4个空格）来表示代码块，而非大括号。
                    注释分为单行注释（#）和多行注释（三引号'''或"""）。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">语句排版</h3>
                  <p className="text-gray-600 mb-4">
                    使用反斜杠\实现多行语句，但在括号()、[]、{}内的多行语句则不需要；
                    同一行显示多条语句可用分号;分隔。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">自主练习</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">练习：编写一个简单的Python程序</h4>
                    <p className="text-gray-600 mb-4">
                      编写一个程序，输出你的姓名、年龄和专业，并添加适当的注释说明。
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => runExercise('environment')}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium mb-4"
                      >
                        开始练习
                      </button>
                      
                      {currentExercise === 'environment' && (
                        <div className="mt-4">
                          {loading ? (
                            <div className="flex justify-center items-center py-10">
                              <div className="text-emerald-600">加载Python解释器中...</div>
                            </div>
                          ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                              {error}
                            </div>
                          ) : (
                            <>
                              <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <CodeMirror
                                  value={exerciseInput}
                                  onChange={(value) => setExerciseInput(value)}
                                  extensions={[python()]}
                                  theme={oneDark}
                                  height="200px"
                                  placeholder="在此输入Python代码..."
                                />
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={executeCode}
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                                >
                                  运行代码
                                </button>
                              </div>
                              {exerciseOutput && (
                                <div className="mt-4 p-3 bg-gray-900 text-gray-100 rounded-lg">
                                  <pre className="text-sm whitespace-pre-wrap">{exerciseOutput}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 二、变量与数据类型 */}
          <div className="mb-12">
            <div 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => toggleSection('variables')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">二、变量与数据类型</h2>
                <span className={`text-emerald-600 transition-transform ${activeSection === 'variables' ? 'transform rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              <p className="text-gray-600 mt-2">Python是动态类型语言，变量无需声明类型即可直接赋值。其数据类型可分为基本类型与容器类型，理解可变与不可变类型是关键。</p>
            </div>
            
            {activeSection === 'variables' && (
              <div className="mt-4 pl-6 border-l-2 border-emerald-100">
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSubSection('basicTypes')}
                  >
                    <h3 className="text-xl font-medium text-gray-700">基本数据类型（不可变）</h3>
                    <span className={`text-emerald-600 transition-transform ${activeSubSection === 'basicTypes' ? 'transform rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                  {activeSubSection === 'basicTypes' && (
                    <div className="mt-3 pl-4">
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li><strong>数值类型</strong>：包括整数（int，无大小限制）、浮点数（float，支持科学计数法如3E-2）、复数（complex，如1+2j）。</li>
                        <li><strong>布尔类型（bool）</strong>：只有True和False两个值，本质上是int的子类（分别对应1和0）。在布尔判断中，0、空字符串""、空容器等均被视为False。</li>
                        <li><strong>字符串（str）</strong>：由Unicode字符序列组成，支持索引（从左往右0开始，从右往左-1开始）、切片、拼接（+）和重复（*）操作。使用r前缀可声明原始字符串，防止反斜杠转义。</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSubSection('containerTypes')}
                  >
                    <h3 className="text-xl font-medium text-gray-700">容器数据类型</h3>
                    <span className={`text-emerald-600 transition-transform ${activeSubSection === 'containerTypes' ? 'transform rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                  {activeSubSection === 'containerTypes' && (
                    <div className="mt-3 pl-4">
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li><strong>列表（list，可变）</strong>：有序序列，用[]表示，支持增删改查及切片操作（如append()、pop()），是数据分析中最常用的动态数据存储容器。</li>
                        <li><strong>元组（tuple，不可变）</strong>：有序序列，用()表示，常用于保护数据不被修改或作为函数的多返回值载体。</li>
                        <li><strong>字典（dict，可变）</strong>：无序（Python 3.7+有序）的键值对集合，用{}表示。键必须是不可变类型，通过键查找值的速度极快，适用于存储映射关系（如用户信息）。</li>
                        <li><strong>集合（set，可变）</strong>：无序且元素唯一的集合，常用于数据去重及交集、并集、差集等数学运算。</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">代码示例</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.variables}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">自主练习</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">练习：数据类型操作</h4>
                    <p className="text-gray-600 mb-4">
                      创建一个包含学生信息的字典，包括姓名、年龄、专业和课程列表，然后进行相应的操作。
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => runExercise('variables')}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium mb-4"
                      >
                        开始练习
                      </button>
                      
                      {currentExercise === 'variables' && (
                        <div className="mt-4">
                          {loading ? (
                            <div className="flex justify-center items-center py-10">
                              <div className="text-emerald-600">加载Python解释器中...</div>
                            </div>
                          ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                              {error}
                            </div>
                          ) : (
                            <>
                              <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <CodeMirror
                                  value={exerciseInput}
                                  onChange={(value) => setExerciseInput(value)}
                                  extensions={[python()]}
                                  theme={oneDark}
                                  height="200px"
                                  placeholder="在此输入Python代码..."
                                />
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={executeCode}
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                                >
                                  运行代码
                                </button>
                              </div>
                              {exerciseOutput && (
                                <div className="mt-4 p-3 bg-gray-900 text-gray-100 rounded-lg">
                                  <pre className="text-sm whitespace-pre-wrap">{exerciseOutput}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 三、运算符与控制流 */}
          <div className="mb-12">
            <div 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => toggleSection('operators')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">三、运算符与控制流</h2>
                <span className={`text-emerald-600 transition-transform ${activeSection === 'operators' ? 'transform rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              <p className="text-gray-600 mt-2">程序逻辑的核心在于运算与流程控制，决定了数据如何被加工和处理。</p>
            </div>
            
            {activeSection === 'operators' && (
              <div className="mt-4 pl-6 border-l-2 border-emerald-100">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">运算符与表达式</h3>
                  <p className="text-gray-600 mb-4">
                    支持算术运算符（+、-、*、/、//取整、%取余、**乘方）、比较运算符（==、!=、&gt;、&lt;）、逻辑运算符（and、or、not）等。
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.operators}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">条件分支</h3>
                  <p className="text-gray-600 mb-4">
                    使用if、elif、else进行条件判断，通过缩进划分代码块。Python 3.10+还引入了match-case语句进行模式匹配。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">循环结构</h3>
                  <p className="text-gray-600 mb-4">
                    for循环用于遍历序列或可迭代对象，常与range()函数结合用于计数循环，是处理列表、字典等数据的主力。
                    while循环在条件为真时反复执行代码块，适用于状态判断不确定次数的循环，需注意避免死循环。
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.controlFlow}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">自主练习</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">练习：成绩等级判断</h4>
                    <p className="text-gray-600 mb-4">
                      编写一个程序，根据输入的分数判断成绩等级：90-100为优秀，80-89为良好，70-79为中等，60-69为及格，60以下为不及格。
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => runExercise('operators')}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium mb-4"
                      >
                        开始练习
                      </button>
                      
                      {currentExercise === 'operators' && (
                        <div className="mt-4">
                          {loading ? (
                            <div className="flex justify-center items-center py-10">
                              <div className="text-emerald-600">加载Python解释器中...</div>
                            </div>
                          ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                              {error}
                            </div>
                          ) : (
                            <>
                              <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <CodeMirror
                                  value={exerciseInput}
                                  onChange={(value) => setExerciseInput(value)}
                                  extensions={[python()]}
                                  theme={oneDark}
                                  height="200px"
                                  placeholder="在此输入Python代码..."
                                />
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={executeCode}
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                                >
                                  运行代码
                                </button>
                              </div>
                              {exerciseOutput && (
                                <div className="mt-4 p-3 bg-gray-900 text-gray-100 rounded-lg">
                                  <pre className="text-sm whitespace-pre-wrap">{exerciseOutput}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 四、函数与模块化编程 */}
          <div className="mb-12">
            <div 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => toggleSection('functions')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">四、函数与模块化编程</h2>
                <span className={`text-emerald-600 transition-transform ${activeSection === 'functions' ? 'transform rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              <p className="text-gray-600 mt-2">当代码规模扩大时，需要通过函数和模块进行组织与复用，这是工程化的起步。</p>
            </div>
            
            {activeSection === 'functions' && (
              <div className="mt-4 pl-6 border-l-2 border-emerald-100">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">函数定义与调用</h3>
                  <p className="text-gray-600 mb-4">
                    使用def关键字定义函数。需掌握位置参数、默认参数、关键字参数以及可变参数（*args和**kwargs）的使用。
                    函数通过return语句返回结果，若无return则默认返回None。
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.functions}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">变量作用域</h3>
                  <p className="text-gray-600 mb-4">
                    理解局部变量（函数内部定义）与全局变量（函数外部定义）的区别。
                    在函数内部若需修改全局变量，必须使用global关键字声明。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">模块与包</h3>
                  <p className="text-gray-600 mb-4">
                    模块是包含Python代码的.py文件，包是包含__init__.py文件的目录。
                    通过import导入整个模块，或使用from ... import ...导入特定功能，也可使用as指定别名。
                    Python拥有丰富的标准库（如math、os、json），更可通过pip或conda安装海量第三方库（如numpy、pandas）。
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">自主练习</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">练习：温度转换函数</h4>
                    <p className="text-gray-600 mb-4">
                      编写一个函数，将摄氏度转换为华氏度，公式：华氏度 = 摄氏度 × 9/5 + 32。
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => runExercise('functions')}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium mb-4"
                      >
                        开始练习
                      </button>
                      
                      {currentExercise === 'functions' && (
                        <div className="mt-4">
                          {loading ? (
                            <div className="flex justify-center items-center py-10">
                              <div className="text-emerald-600">加载Python解释器中...</div>
                            </div>
                          ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                              {error}
                            </div>
                          ) : (
                            <>
                              <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <CodeMirror
                                  value={exerciseInput}
                                  onChange={(value) => setExerciseInput(value)}
                                  extensions={[python()]}
                                  theme={oneDark}
                                  height="200px"
                                  placeholder="在此输入Python代码..."
                                />
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={executeCode}
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                                >
                                  运行代码
                                </button>
                              </div>
                              {exerciseOutput && (
                                <div className="mt-4 p-3 bg-gray-900 text-gray-100 rounded-lg">
                                  <pre className="text-sm whitespace-pre-wrap">{exerciseOutput}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 五、面向对象与异常处理 */}
          <div className="mb-12">
            <div 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-all"
              onClick={() => toggleSection('oop')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">五、面向对象与异常处理</h2>
                <span className={`text-emerald-600 transition-transform ${activeSection === 'oop' ? 'transform rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              <p className="text-gray-600 mt-2">这是编写大型、健壮Python程序的必经之路，也是理解第三方数据分析库底层逻辑的关键。</p>
            </div>
            
            {activeSection === 'oop' && (
              <div className="mt-4 pl-6 border-l-2 border-emerald-100">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">面向对象编程（OOP）</h3>
                  <p className="text-gray-600 mb-4">
                    类是对象的蓝图，使用class定义。通过__init__构造方法初始化对象属性，使用self代表实例本身。
                    子类可继承父类的属性和方法，实现代码复用。通过重写（Override）父类方法可实现多态。
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.oop}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">异常处理</h3>
                  <p className="text-gray-600 mb-4">
                    使用try包裹可能出错的代码，用except捕获特定异常（如TypeError、ValueError），避免程序崩溃。
                    finally块中的代码无论是否发生异常都会执行，常用于资源清理。
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.exception}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">文件操作</h3>
                  <p className="text-gray-600 mb-4">
                    使用内置open()函数配合with语句（上下文管理器）安全地读写文件，是数据I/O的基础。
                    对于数据分析，更常使用pandas的read_csv()/read_excel()等高级接口处理结构化数据。
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{codeExamples.file}</pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-gray-700 mb-3">自主练习</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">练习：创建图书类</h4>
                    <p className="text-gray-600 mb-4">
                      编写一个Book类，包含书名、作者、出版年份等属性，以及获取图书信息的方法。
                    </p>
                    <div className="mt-4">
                      <button 
                        onClick={() => runExercise('oop')}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium mb-4"
                      >
                        开始练习
                      </button>
                      
                      {currentExercise === 'oop' && (
                        <div className="mt-4">
                          {loading ? (
                            <div className="flex justify-center items-center py-10">
                              <div className="text-emerald-600">加载Python解释器中...</div>
                            </div>
                          ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                              {error}
                            </div>
                          ) : (
                            <>
                              <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <CodeMirror
                                  value={exerciseInput}
                                  onChange={(value) => setExerciseInput(value)}
                                  extensions={[python()]}
                                  theme={oneDark}
                                  height="200px"
                                  placeholder="在此输入Python代码..."
                                />
                              </div>
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={executeCode}
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                                >
                                  运行代码
                                </button>
                              </div>
                              {exerciseOutput && (
                                <div className="mt-4 p-3 bg-gray-900 text-gray-100 rounded-lg">
                                  <pre className="text-sm whitespace-pre-wrap">{exerciseOutput}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-50 text-gray-500 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-1 bg-emerald-400 mx-auto mb-6"></div>
          <p className="text-sm">© 2026 黄安德的个人页面 | 部署于 Cloudflare Pages</p>
        </div>
      </footer>
    </div>
  );
}