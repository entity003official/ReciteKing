# ReciteKing - 日语单词背诵王 项目结构

## 📁 项目目录结构

```
ReciteKing/
├── web/                          # 前端页面文件
│   ├── index.html               # 主页
│   ├── word-typing.html         # 单词输入练习页面
│   ├── curriculum-selection.html # 课程选择页面
│   ├── curriculum-stats.html    # 课程统计页面
│   └── data-manager.html        # 数据管理页面
│
├── data/                        # 数据文件目录
│   ├── vocabulary/              # 词汇数据
│   │   ├── lesson_01_vocabulary.csv  # 第一课词汇
│   │   ├── lesson_02_vocabulary.csv  # 第二课词汇
│   │   ├── lesson_03_vocabulary.csv  # 第三课词汇
│   │   ├── lesson_04_vocabulary.csv  # 第四课词汇
│   │   ├── lesson_05_vocabulary.csv  # 第五课词汇
│   │   └── lesson_06_vocabulary.csv  # 第六课词汇
│   └── statistics/              # 统计数据
│
├── assets/                      # 静态资源文件
│   ├── css/                    # 样式文件
│   ├── js/                     # JavaScript文件
│   └── images/                 # 图片资源
│
├── git-tools/                   # Git工具
│   └── scripts/                # 批处理脚本
│       ├── data-manager-git.bat     # Git分支管理
│       ├── csv-data-manager.bat     # CSV数据管理
│       └── git-manager.bat          # Git管理工具
│
├── docs/                        # 文档目录
│   └── project-structure.md    # 项目结构说明(本文件)
│
├── README.md                    # 项目说明文档
└── demo.cpp                     # 演示代码
```

## 📚 词汇数据文件格式

所有词汇CSV文件采用统一格式：
```csv
课程,栏目,假名,汉字,释义,词性
```

### 课程内容分布

- **第一课**: 人称代词、国籍职业、基本动词、疑问词、问候语
- **第二课**: 指示代词、物品名称、所属关系、疑问应答  
- **第三课**: 场所指示、场所名称、方位词、价格询问、数字
- **第四课**: 星期、时间概念、日常动作、移动动作、场所物品
- **第五课**: 移动动词、交通工具、场所名称、国家城市、疑问词
- **第六课**: 日常动作、食物饮料、娱乐活动、助词

## 🛠️ 功能模块

1. **数据管理** (`data-manager.html`)
   - 课程栏目创建
   - 单词批量导入
   - CSV文件导出
   - 数据结构管理

2. **练习系统** (`word-typing.html`, `curriculum-selection.html`)
   - 单词输入练习
   - 课程选择功能
   - 学习进度跟踪

3. **统计分析** (`curriculum-stats.html`)
   - 词汇量统计
   - 学习进度分析
   - 词性分布统计

## 🔧 开发工具

- **Git管理**: `git-tools/scripts/` 中的批处理脚本
- **数据处理**: CSV格式统一管理
- **前端框架**: 原生HTML/CSS/JavaScript

## 📝 使用说明

1. 使用 `data-manager.html` 管理词汇数据
2. 词汇文件统一存放在 `data/vocabulary/` 目录
3. 支持课程栏目化管理和CSV导出
4. 所有数据文件采用UTF-8编码
