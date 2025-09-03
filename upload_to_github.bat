@echo off
chcp 65001 >nul
echo ======================================
echo 🚀 日语单词背诵王 - GitHub 上传脚本
echo ======================================
echo.

echo 📝 添加所有文件到Git...
git add .

echo.
echo 📊 检查Git状态...
git status

echo.
echo 💾 提交更新到本地仓库...
git commit -m "🎉 v2.1 导航栏优化更新

✨ 新增功能：
- 导航栏置顶显示，滚动时始终可见
- 当前页面高亮显示（橙红渐变色）
- 保留返回首页选项
- 响应式设计支持移动端
- 毛玻璃效果和流畅动画

🔧 技术改进：
- 统一所有页面的导航栏样式
- 优化移动端显示效果
- 增强视觉层次感和用户体验

📁 更新文件：
- web/index.html - 导航栏样式优化
- web/word-typing.html - 添加内联导航样式
- web/curriculum-selection.html - 固定导航栏
- web/curriculum-stats.html - 导航栏集成
- web/navigation-demo.html - 🆕 导航栏展示页面"

echo.
echo 🌐 推送到GitHub远程仓库...
git push origin main

echo.
echo ✅ 上传完成！
echo 🔗 访问GitHub查看: https://github.com/entity003official/ReciteKing
echo.
pause
