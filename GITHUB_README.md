# 新标准日本语词汇学习系统 (ReciteKing)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey.svg)
![Language](https://img.shields.io/badge/language-HTML/CSS/JS-green.svg)
![Database](https://img.shields.io/badge/database-CSV-orange.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)

## 📚 项目概述

一个专为《新标准日本语初级1》教材设计的智能词汇学习和管理系统，提供完整的课程词汇数据库和互动学习界面。

### ✨ 核心特点

- **📊 完整词汇库**: 覆盖24课全册内容，780个核心单词
- **🗂️ 科学分类**: 152个主题栏目，多维度组织词汇
- **🎮 交互管理**: 直观的词汇添加和编辑界面
- **📤 数据导出**: 支持CSV格式导出，便于个性化学习

## 🖼️ 项目截图

<div align="center">
  <img src="docs/screenshots/dashboard.png" alt="主界面" width="400"/>
  <p><em>主界面</em></p>
  
  <img src="docs/screenshots/data-manager.png" alt="数据管理" width="400"/>
  <p><em>数据管理界面</em></p>
  
  <img src="docs/screenshots/learning.png" alt="学习模式" width="400"/>
  <p><em>学习模式</em></p>
</div>

## 🚀 快速开始

### 在线体验

访问我们的在线演示: [ReciteKing Demo](https://username.github.io/ReciteKing)

### 本地部署

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/ReciteKing.git
   cd ReciteKing
   ```

2. 打开Web界面
   ```
   直接打开 web/index.html 即可开始使用
   ```

## 📊 词汇统计

- **课程总数**: 24课
- **词汇总数**: 780个单词
- **栏目总数**: 152个主题栏目
- **词性分布**: 涵盖12种词性

| 阶段 | 课程范围 | 词汇数量 | 学习重点 |
|------|----------|----------|----------|
| 基础阶段 | 第1-6课 | 160个 | 基本句型、基础词汇 |
| 进阶阶段 | 第7-12课 | 190个 | 形容词、时态变化 |
| 应用阶段 | 第13-18课 | 201个 | 动词活用、复合表达 |
| 综合阶段 | 第19-24课 | 206个 | 敬语、复杂句型 |

## 📝 项目结构

```
ReciteKing/
├── data/                           # 数据目录
│   └── vocabulary/                 # 词汇数据
│       ├── vocabulary_index.csv    # 课程索引
│       ├── lesson_01_vocabulary.csv # 第1课词汇
│       └── ...                     # 第2-24课词汇
├── web/                            # 网页界面
│   ├── index.html                  # 主页面
│   ├── data-manager.html           # 数据管理界面
│   └── style.css                   # 样式文件
├── docs/                           # 文档目录
└── git-tools/                      # 版本控制工具
```

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **数据存储**: CSV, LocalStorage
- **版本控制**: Git

## 📋 功能列表

- ✅ 完整词汇数据库 (24课全册)
- ✅ 词汇可视化管理界面
- ✅ 栏目分类系统
- ✅ CSV数据导出
- ✅ 词性标注
- ⬜ 词汇测试模式
- ⬜ 个人学习进度跟踪
- ⬜ 多语言支持

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

## 👥 贡献指南

欢迎通过Issues或Pull Requests为项目贡献代码或意见。

## 📞 联系方式

- 项目主页: [GitHub](https://github.com/yourusername/ReciteKing)
- 作者邮箱: your-email@example.com

---

<div align="center">
  <strong>让日语学习更高效，让词汇记忆更轻松！</strong>
</div>
