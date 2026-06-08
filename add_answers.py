#!/usr/bin/env python3
import re

# 读取文件
with open('src/pages/PythonBasic.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 添加showAnswer状态
old_state = '''const [exerciseInput, setExerciseInput] = useState<string>('');
  const [exerciseOutput, setExerciseOutput] = useState<string>('');
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);'''

new_state = '''const [exerciseInput, setExerciseInput] = useState<string>('');
  const [exerciseOutput, setExerciseOutput] = useState<string>('');
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);'''

content = content.replace(old_state, new_state)

# 定义练习和答案
exercises = [
    {
        'id': 'environment',
        'title': '练习：编写一个简单的Python程序',
        'description': '编写一个程序，输出你的姓名、年龄和专业，并添加适当的注释说明。',
        'answer': '''# 这是我的个人信息程序
name = "张三"  # 学生姓名
age = 20      # 学生年龄
major = "数据分析"  # 所学专业

# 输出个人信息
print(f"姓名：{name}")
print(f"年龄：{age}")
print(f"专业：{major}")

# 使用f-string格式化输出
print(f"大家好，我叫{name}，今年{age}岁，专业是{major}。")'''
    },
    {
        'id': 'variables',
        'title': '练习：数据类型操作',
        'description': '创建一个包含学生信息的字典，包括姓名、年龄，专业和课程列表，然后进行相应的操作。',
        'answer': '''# 创建学生信息字典
student = {
    'name': '张三',
    'age': 20,
    'major': '数据分析',
    'courses': ['Python', '统计学', '机器学习']
}

# 访问字典元素
print(f"学生姓名: {student['name']}")
print(f"学生年龄: {student['age']}")

# 修改字典元素
student['age'] = 21
print(f"修改后的年龄: {student['age']}")

# 添加新课程
student['courses'].append('深度学习')
print(f"更新后的课程: {student['courses']}")

# 使用items()遍历字典
for key, value in student.items():
    print(f"{key}: {value}")'''
    },
    {
        'id': 'operators',
        'title': '练习：成绩等级判断',
        'description': '编写一个程序，根据输入的分数判断成绩等级：90-100为优秀，80-89为良好，70-79为中等，60-69为及格，60以下为不及格。',
        'answer': '''# 成绩等级判断程序
score = 85  # 可以修改这个值来测试不同的分数

# 使用if-elif-else判断
if score >= 90 and score <= 100:
    grade = "优秀"
elif score >= 80 and score <= 89:
    grade = "良好"
elif score >= 70 and score <= 79:
    grade = "中等"
elif score >= 60 and score <= 69:
    grade = "及格"
else:
    grade = "不及格"

print(f"分数: {score}")
print(f"等级: {grade}")

# 更简洁的写法（利用Python的特性）
# if 90 <= score <= 100:
#     print("优秀")'''
    },
    {
        'id': 'functions',
        'title': '练习：温度转换函数',
        'description': '编写一个函数，将摄氏度转换为华氏度，公式：华氏度 = 摄氏度 × 9/5 + 32。',
        'answer': '''# 温度转换函数
def celsius_to_fahrenheit(celsius):
    """
    将摄氏度转换为华氏度
    参数: celsius - 摄氏温度
    返回: 华氏温度
    """
    fahrenheit = celsius * 9/5 + 32
    return fahrenheit

# 测试函数
celsius = 25
fahrenheit = celsius_to_fahrenheit(celsius)
print(f"{celsius}°C = {fahrenheit}°F")

# 批量转换
temps_celsius = [0, 20, 37, 100]
temps_fahrenheit = [celsius_to_fahrenheit(c) for c in temps_celsius]
print("批量转换结果:")
for c, f in zip(temps_celsius, temps_fahrenheit):
    print(f"{c}°C = {f:.2f}°F")'''
    },
    {
        'id': 'oop',
        'title': '练习：创建图书类',
        'description': '编写一个Book类，包含书名、作者、出版年份等属性，以及获取图书信息的方法。',
        'answer': '''# 定义Book类
class Book:
    def __init__(self, title, author, year, pages=0):
        """初始化图书对象"""
        self.title = title
        self.author = author
        self.year = year
        self.pages = pages
    
    def get_info(self):
        """获取图书信息"""
        return f"《{self.title}》- {self.author} ({self.year})"
    
    def get_age(self):
        """计算图书年龄"""
        from datetime import datetime
        current_year = datetime.now().year
        return current_year - self.year
    
    def __str__(self):
        """返回字符串表示"""
        return self.get_info()
    
    def __repr__(self):
        """返回调试表示"""
        return f"Book('{self.title}', '{self.author}', {self.year})"

# 创建图书实例
book1 = Book("Python编程", "张三", 2023, 350)
book2 = Book("数据分析实战", "李四", 2024, 280)

# 使用类的方法
print(book1.get_info())
print(f"《{book1.title}》已有 {book1.get_age()} 年历史")

# 使用__str__方法
print(book1)

# 打印所有图书信息
books = [book1, book2]
for book in books:
    print(f"- {book}")'''
    }
]

# 为每个练习添加答案功能
for exercise in exercises:
    # 查找练习部分
    pattern = rf"(>开始练习</button>\s*</div>\s*<div className=\"mt-4\">\s*<button\s+onClick=\{{\(\)\s*=>\s*runExercise\('{exercise['id']}'\)\}}[^>]*>开始练习</button>)"
    
    # 替换为包含答案按钮的新代码
    old_button = f'''<button 
                        onClick={{() => runExercise('{exercise['id']}')}}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium mb-4"
                      >
                        开始练习
                      </button>'''
    
    new_button = f'''<button 
                        onClick={{() => runExercise('{exercise['id']}')}}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium"
                      >
                        开始练习
                      </button>
                      <button 
                        onClick={{() => setShowAnswer(!showAnswer)}}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        {{showAnswer ? '隐藏答案' : '显示答案'}}
                      </button>'''
    
    content = content.replace(old_button, new_button)

# 保存文件
with open('src/pages/PythonBasic.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("答案功能添加完成！")
