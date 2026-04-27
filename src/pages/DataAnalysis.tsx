import React from 'react';
import { Link } from 'react-router-dom';

export default function DataAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 导航栏 */}
      <nav className="bg-white text-emerald-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-light tracking-wide">黄安德</div>
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-emerald-500 transition-colors text-sm font-medium">首页</Link>
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
            <h1 className="text-4xl font-light text-gray-800 mb-4">数据分析技术</h1>
            <div className="w-24 h-1 bg-emerald-400 mx-auto"></div>
          </div>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
            数据分析是从大量数据中提取有价值信息的过程，通过使用各种技术和工具，将原始数据转化为可操作的洞察。
            本模块将介绍数据分析的基本概念、方法和工具，帮助你掌握数据清洗、转换、分析和可视化的核心技能。
          </p>
        </div>
      </section>

      {/* 数据分析工具 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium text-gray-800 mb-10 text-center">数据分析工具</h2>
          
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-10">
            <h3 className="text-xl font-medium text-gray-700 mb-4">在线数据分析平台</h3>
            <p className="text-gray-600 mb-6">
              我们推荐使用以下在线数据分析平台进行实践练习，它提供了丰富的数据可视化和分析功能。
            </p>
            <a 
              href="https://f0ade77c.aaa11-eep.pages.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium inline-block"
            >
              访问数据分析平台
            </a>
          </div>

          {/* 数据分析知识点 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-3">数据清洗</h3>
              <p className="text-gray-600 text-sm">
                数据清洗是数据分析的第一步，包括处理缺失值、异常值、重复数据等，确保数据的质量和可靠性。
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-3">数据转换</h3>
              <p className="text-gray-600 text-sm">
                数据转换包括数据类型转换、标准化、归一化等操作，为后续的分析做准备。
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-3">数据分析</h3>
              <p className="text-gray-600 text-sm">
                使用统计方法和机器学习算法对数据进行分析，发现数据中的模式和趋势。
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-3">数据可视化</h3>
              <p className="text-gray-600 text-sm">
                通过图表、仪表盘等方式将分析结果可视化，使数据更加直观易懂。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 数据分析工具推荐 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium text-gray-800 mb-10 text-center">推荐工具</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Excel</h3>
              <p className="text-gray-600 text-sm mb-4">基础数据分析和可视化工具，适合初学者。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Python</h3>
              <p className="text-gray-600 text-sm mb-4">强大的数据分析库，如pandas、numpy、matplotlib等。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Tableau</h3>
              <p className="text-gray-600 text-sm mb-4">专业的数据可视化工具，拖拽式操作，易于使用。</p>
            </div>
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
