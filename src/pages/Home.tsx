import React from 'react';

// 课程数据
const courses = [
  {
    id: 1,
    name: 'Python基础',
    description: '学习Python编程语言的基础语法、数据类型、控制结构和函数等核心概念。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20code%20on%20screen%2C%20soft%20pastel%20colors%2C%20minimalist%20design&image_size=square'
  },
  {
    id: 2,
    name: '数据分析技术',
    description: '掌握数据清洗、转换、分析和可视化的基本技术和工具。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20analysis%20dashboard%2C%20soft%20colors%2C%20minimalist%20design&image_size=square'
  },
  {
    id: 3,
    name: '数据采集与处理',
    description: '学习网络爬虫、数据采集工具和数据预处理技术。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20collection%20process%2C%20soft%20colors%2C%20minimalist%20design&image_size=square'
  },
  {
    id: 4,
    name: '供应链数据分析',
    description: '应用数据分析技术解决供应链管理中的实际问题。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=supply%20chain%20data%20analysis%2C%20soft%20colors%2C%20minimalist%20design&image_size=square'
  },
  {
    id: 5,
    name: '数据库原理与应用',
    description: '了解数据库设计原理，掌握SQL语言和数据库管理技术。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=database%20schema%20design%2C%20soft%20colors%2C%20minimalist%20design&image_size=square'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 导航栏 */}
      <nav className="bg-white text-emerald-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-light tracking-wide">黄安德</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-emerald-500 transition-colors text-sm font-medium">首页</a>
            <a href="#courses" className="hover:text-emerald-500 transition-colors text-sm font-medium">课程</a>
            <a href="#about" className="hover:text-emerald-500 transition-colors text-sm font-medium">关于我</a>
          </div>
        </div>
      </nav>

      {/* 个人信息 */}
      <section id="about" className="bg-gradient-to-r from-emerald-50 to-teal-50 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <div className="w-24 h-1 bg-emerald-400 mx-auto mb-6"></div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">黄安德</h1>
            <div className="w-24 h-1 bg-emerald-400 mx-auto"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-4">广东科学技术职业学院</p>
          <p className="text-md md:text-lg text-gray-500 mb-10">商学院 · 商务数据分析与应用专业</p>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            我是一名商务数据分析与应用专业的学生，热衷于学习数据分析技术和工具，
            希望通过这个页面展示我的课程学习情况和专业能力。
          </p>
        </div>
      </section>

      {/* 课程列表 */}
      <section id="courses" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800 mb-4">我的课程</h2>
            <div className="w-16 h-1 bg-emerald-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-gray-700">{course.name}</h3>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed">{course.description}</p>
                  <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm font-medium">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
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