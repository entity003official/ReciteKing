# 📦 Git版本管理模块

## 🎯 功能概述

Git模块为ReciteKing项目提供完整的版本控制管理功能，包括：
- 🔄 版本发布管理
- 📝 提交信息规范
- 🌿 分支管理策略
- 📊 代码统计分析
- 🚀 自动化部署脚本

## 📁 模块结构

```
git-tools/
├── scripts/
│   ├── quick-commit.bat         ← 快速提交脚本
│   ├── push-to-github.bat       ← 推送到GitHub
│   ├── create-release.bat       ← 创建版本发布
│   └── git-stats.bat           ← Git统计信息
├── templates/
│   ├── commit-template.txt      ← 提交信息模板
│   └── release-template.md      ← 发布说明模板
└── docs/
    ├── git-workflow.md          ← Git工作流程文档
    └── commit-conventions.md    ← 提交规范文档
```

## 🚀 快速使用

### 1. 快速提交和推送
```batch
.\git-tools\scripts\quick-commit.bat "你的提交信息"
```

### 2. 创建新版本
```batch
.\git-tools\scripts\create-release.bat v2.1.0
```

### 3. 查看项目统计
```batch
.\git-tools\scripts\git-stats.bat
```

## 📋 提交信息规范

采用约定式提交（Conventional Commits）格式：

```
<类型>[可选范围]: <描述>

[可选正文]

[可选脚注]
```

### 类型说明
- `feat:` - 新功能
- `fix:` - 修复bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建过程或辅助工具变动
