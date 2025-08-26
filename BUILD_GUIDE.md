# 假名背诵王 - 移动端打包指南

我已经为您创建了完整的HTML/CSS/JavaScript版本的假名背诵应用。以下是几种将其转换为Android APK的方法：

## 📱 方案对比

| 方案 | 难度 | 性能 | 体验 | 推荐指数 |
|------|------|------|------|----------|
| **PWA (渐进式Web应用)** | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Cordova/PhoneGap** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Capacitor** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🚀 方案一：PWA (推荐) - 最简单

PWA可以直接在手机浏览器中使用，并支持"添加到桌面"功能。

### 使用步骤：
1. 将`web`文件夹上传到Web服务器（支持HTTPS）
2. 用手机浏览器访问
3. 在浏览器菜单中选择"添加到主屏幕"
4. 应用将像原生应用一样在桌面显示

### 本地测试：
```bash
# 使用Python启动本地服务器
cd web
python -m http.server 8000

# 或使用Node.js
npx http-server
```

然后访问 `http://localhost:8000`

## 📦 方案二：Cordova - 生成真正的APK

### 安装环境：
```bash
# 安装Cordova CLI
npm install -g cordova

# 安装Java JDK 8
# 安装Android Studio和Android SDK
# 配置环境变量 ANDROID_HOME
```

### 打包步骤：
```bash
# 1. 创建Cordova项目
cordova create KanaStudyApp com.example.kanastudy "假名背诵王"
cd KanaStudyApp

# 2. 添加Android平台
cordova platform add android

# 3. 将web文件复制到www目录
# 复制 index.html, app.js, kana-data.js, manifest.json 等文件

# 4. 构建APK
cordova build android

# 5. 生成发布版APK
cordova build android --release
```

### APK文件位置：
- Debug版本：`platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- Release版本：`platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

## ⚡ 方案三：Capacitor - 现代化方案

### 安装环境：
```bash
npm install -g @capacitor/cli
```

### 打包步骤：
```bash
# 1. 在web目录初始化Capacitor
cd web
npm init -y
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# 2. 初始化Capacitor
npx cap init "假名背诵王" "com.example.kanastudy"

# 3. 添加Android平台
npx cap add android

# 4. 同步文件
npx cap sync

# 5. 打开Android Studio构建
npx cap open android
```

## 🔧 完整自动化脚本

我为您创建了自动化脚本：

### Windows批处理文件：
```bat
@echo off
echo 正在创建Cordova项目...
cordova create KanaStudyApp com.example.kanastudy "假名背诵王"
cd KanaStudyApp

echo 添加Android平台...
cordova platform add android

echo 复制Web文件...
xcopy /Y /E "..\web\*" "www\"

echo 构建APK...
cordova build android

echo 完成！APK文件位于：
echo platforms\android\app\build\outputs\apk\debug\app-debug.apk

pause
```

## 📋 文件结构说明

```
2025_8_24ReciteKing/
├── web/                    # Web版本文件
│   ├── index.html         # 主页面
│   ├── app.js             # 应用逻辑
│   ├── kana-data.js       # 假名数据
│   ├── manifest.json      # PWA配置
│   └── sw.js              # Service Worker
├── cordova/               # Cordova配置
│   └── config.xml         # Cordova项目配置
├── demo.py               # 原Python版本
├── kana_data.csv         # 原数据文件
└── BUILD_GUIDE.md        # 本文件
```

## ✨ Web版本特性

- ✅ 完全响应式设计，适配手机和平板
- ✅ 支持触摸操作和手势
- ✅ 现代化Material Design界面
- ✅ PWA支持，可离线使用
- ✅ 保持原有的所有功能和逻辑
- ✅ 支持配置不同类型的假名练习
- ✅ 进度条和统计显示

## 🎯 推荐流程

1. **测试阶段**：先使用PWA方案，直接在手机浏览器中测试
2. **发布阶段**：如需发布到应用商店，使用Cordova或Capacitor生成APK
3. **优化阶段**：根据用户反馈继续优化界面和功能

## 📝 注意事项

1. **图标文件**：需要准备不同尺寸的应用图标（192x192, 512x512等）
2. **权限配置**：根据需要在config.xml中配置应用权限
3. **签名发布**：发布到Google Play需要对APK进行数字签名
4. **测试设备**：建议在多种Android设备上测试兼容性

现在您可以选择任意一种方案来将应用转换为Android APK！推荐先从PWA开始测试，确认功能正常后再进行APK打包。
