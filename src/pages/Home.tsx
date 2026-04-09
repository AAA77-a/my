import React from 'react';

// 课程数据
const courses = [
  {
    id: 1,
    name: 'Python基础',
    description: '学习Python编程语言的基础语法、数据类型、控制结构和函数等核心概念。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20code%20on%20screen%2C%20clean%20modern%20design&image_size=square'
  },
  {
    id: 2,
    name: '数据分析技术',
    description: '掌握数据清洗、转换、分析和可视化的基本技术和工具。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20analysis%20dashboard%2C%20charts%20and%20graphs%2C%20modern%20design&image_size=square'
  },
  {
    id: 3,
    name: '数据采集与处理',
    description: '学习网络爬虫、数据采集工具和数据预处理技术。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20collection%20process%2C%20web%20scraping%2C%20modern%20design&image_size=square'
  },
  {
    id: 4,
    name: '供应链数据分析',
    description: '应用数据分析技术解决供应链管理中的实际问题。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=supply%20chain%20data%20analysis%2C%20logistics%20network%2C%20modern%20design&image_size=square'
  },
  {
    id: 5,
    name: '数据库原理与应用',
    description: '了解数据库设计原理，掌握SQL语言和数据库管理技术。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=database%20schema%20design%2C%20SQL%20queries%2C%20modern%20design&image_size=square'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold">黄安德的个人页面</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-200 transition-colors">首页</a>
            <a href="#courses" className="hover:text-blue-200 transition-colors">课程</a>
            <a href="#about" className="hover:text-blue-200 transition-colors">关于我</a>
          </div>
        </div>
      </nav>

      {/* 个人信息 */}
      <section id="about" className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">黄安德</h1>
          <p className="text-xl md:text-2xl mb-6">广东科学技术职业学院</p>
          <p className="text-lg md:text-xl mb-8">商学院 · 商务数据分析与应用专业</p>
          <p className="max-w-2xl mx-auto text-blue-100">
            我是一名商务数据分析与应用专业的学生，热衷于学习数据分析技术和工具，
            希望通过这个页面展示我的课程学习情况和专业能力。
          </p>
        </div>
      </section>

      {/* 课程列表 */}
      <section id="courses" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">我的课程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{course.name}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 黄安德的个人页面 | 部署于 Cloudflare Pages</p>
        </div>
      </footer>
    </div>
  );
}