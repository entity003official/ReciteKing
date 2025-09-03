# 🔄 Git工作流程文档

## 📋 日常开发流程

### 1. 开始新功能开发
```bash
# 创建新分支
git checkout -b feature/new-feature-name

# 开发代码...

# 提交代码
git add .
git commit -m "feat: 添加新功能描述"
```

### 2. 功能完成后合并
```bash
# 切换到主分支
git checkout main

# 拉取最新代码
git pull origin main

# 合并功能分支
git merge feature/new-feature-name

# 推送到远程
git push origin main

# 删除功能分支
git branch -d feature/new-feature-name
```

### 3. 修复紧急问题
```bash
# 创建hotfix分支
git checkout -b hotfix/fix-critical-bug

# 修复问题...

# 提交修复
git add .
git commit -m "fix: 修复关键问题描述"

# 合并到主分支
git checkout main
git merge hotfix/fix-critical-bug
git push origin main

# 删除hotfix分支
git branch -d hotfix/fix-critical-bug
```

## 🏷️ 版本管理策略

### 语义化版本控制 (SemVer)

格式: `MAJOR.MINOR.PATCH`

- **MAJOR**: 不兼容的API修改
- **MINOR**: 向后兼容的功能性新增
- **PATCH**: 向后兼容的问题修正

### 版本示例
- `v2.0.0` - 重大更新（课程化系统）
- `v2.1.0` - 新功能添加（新学习模式）
- `v2.1.1` - Bug修复（导航栏问题修复）

## 🌿 分支管理策略

### 主分支
- `main` - 主分支，始终保持稳定状态

### 功能分支
- `feature/功能名称` - 新功能开发
- `enhancement/改进名称` - 功能改进
- `refactor/重构名称` - 代码重构

### 修复分支
- `fix/问题描述` - 一般问题修复
- `hotfix/紧急修复` - 紧急问题修复

### 文档分支
- `docs/文档名称` - 文档更新

## 🔍 代码审查流程

### Pull Request检查清单
- [ ] 代码功能正常
- [ ] 代码风格一致
- [ ] 测试通过
- [ ] 文档已更新
- [ ] 提交信息符合规范

### 合并要求
- 至少1人代码审查
- 所有检查项目通过
- 无冲突文件

## 📝 提交信息最佳实践

### 好的提交信息示例
```
feat: 添加课程选择界面

- 实现6个级别的课程体系
- 支持按课次选择学习内容
- 添加课程进度显示
- 优化移动端体验

Closes #12
```

### 避免的提交信息
```
❌ "修改文件"
❌ "更新"
❌ "fix bug"
❌ "WIP"
```

## 🚀 自动化工具使用

### 快速提交
```batch
# 使用快速提交工具
.\git-tools\scripts\quick-commit.bat "feat: 添加新功能"
```

### 版本发布
```batch
# 创建新版本
.\git-tools\scripts\create-release.bat v2.1.0 "重要功能更新"
```

### 项目统计
```batch
# 查看项目统计
.\git-tools\scripts\git-stats.bat
```
