# 假名背诵王 - 移动端版本

## 📱 版本说明

### 移动端版本 (Android APK) v1.0
- **目录**: `mobile-app/`
- **平台**: Android 手机/平板
- **技术栈**: Cordova + HTML5 + CSS3 + JavaScript
- **特性**: 
  - 触摸优化界面
  - 离线可用
  - 原生Android体验
  - 竖屏优化
  - 启动画面和图标

### Web桌面版本 v1.0  
- **目录**: `web/`
- **平台**: 桌面浏览器 (Chrome, Firefox, Edge, Safari)
- **技术栈**: HTML5 + CSS3 + JavaScript
- **特性**:
  - 响应式设计
  - PWA支持
  - 本地服务器启动

### Python桌面版本 v1.0
- **文件**: `demo.py`
- **平台**: Windows, Mac, Linux
- **技术栈**: Python 3.x
- **特性**:
  - 命令行界面
  - CSV数据文件
  - 配置文件支持

---

## 🔨 Android APK打包步骤

### 环境准备

1. **安装 Node.js**
   ```bash
   # 下载并安装 Node.js (v14+)
   https://nodejs.org/
   ```

2. **安装 Cordova**
   ```bash
   npm install -g cordova
   ```

3. **安装 Android Studio**
   ```bash
   # 下载并安装 Android Studio
   https://developer.android.com/studio
   
   # 配置环境变量
   ANDROID_HOME=C:\Users\YourUser\AppData\Local\Android\Sdk
   PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
   ```

4. **安装 Java JDK 8 或 11**
   ```bash
   # 下载并安装 OpenJDK
   https://adoptopenjdk.net/
   
   # 配置 JAVA_HOME
   JAVA_HOME=C:\Program Files\AdoptOpenJDK\jdk-11.0.x
   ```

### 打包命令

1. **初始化Cordova项目** (首次)
   ```bash
   cd mobile-app
   cordova platform add android
   ```

2. **构建调试版APK**
   ```bash
   cd mobile-app
   cordova build android
   ```

3. **构建发布版APK**
   ```bash
   cd mobile-app
   cordova build android --release
   ```

4. **签名APK** (发布用)
   ```bash
   # 生成密钥库
   keytool -genkey -v -keystore reciteking.keystore -alias reciteking -keyalg RSA -keysize 2048 -validity 10000
   
   # 签名APK
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore reciteking.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk reciteking
   
   # 对齐APK
   zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ReciteKing-v1.0.apk
   ```

### APK输出位置

- **调试版**: `mobile-app/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- **发布版**: `mobile-app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`
- **签名版**: `ReciteKing-v1.0.apk`

---

## 📋 功能对比

| 功能 | Web版 | 移动版 | Python版 |
|------|-------|--------|----------|
| 平假名学习 | ✅ | ✅ | ✅ |
| 片假名学习 | ✅ | ✅ | ✅ |
| 浊音/半浊音 | ✅ | ✅ | ✅ |
| 拗音学习 | ✅ | ✅ | ✅ |
| 长音学习 | ✅ | ✅ | ✅ |
| 自定义重复次数 | ✅ | ✅ | ✅ |
| 个别假名选择 | ✅ | ✅ | ❌ |
| 触摸优化 | ❌ | ✅ | ❌ |
| 离线使用 | ✅ | ✅ | ✅ |
| 进度显示 | ✅ | ✅ | ✅ |
| 响应式界面 | ✅ | ✅ | ❌ |

---

## 🚀 快速开始

### 移动端 (推荐Android用户)
1. 按照上述步骤打包APK
2. 安装到Android设备
3. 打开应用开始学习

### Web端 (推荐桌面用户)  
1. 进入 `web/` 目录
2. 双击 `start_server.bat` 启动服务器
3. 浏览器访问 `http://localhost:8000`

### Python端 (命令行用户)
1. 确保安装Python 3.x
2. 运行 `python demo.py`
3. 按提示进行学习

---

## 📞 技术支持

- **GitHub项目**: https://github.com/entity003official/ReciteKing
- **在线演示**: https://entity003official.github.io/ReciteKing/
- **问题反馈**: 请在GitHub Issues中提交

---

## 📝 更新日志

### v1.0.0 (2025-08-29)
- ✅ 初始版本发布
- ✅ 支持全部275个假名字符
- ✅ 三种平台版本 (Web/Mobile/Python)
- ✅ 完整的Android APK打包支持
- ✅ 移动端触摸优化
- ✅ 响应式设计
- ✅ 离线功能支持
