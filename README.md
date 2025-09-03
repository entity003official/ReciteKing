# 日语单词背诵王 (ReciteKing)

🎌 一个优雅的日语学习练习应用，支持假名背诵和单词练习，提供Python桌面版、Web桌面版和Android移动版本。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Python%20%7C%20Web%20%7C%20Android-lightgrey.svg)
![Language](https://img.shields.io/badge/language-Python%20%7C%20JavaScript-green.svg)

## 🎯 多版本说明

### 📱 Android移动版 v1.0 (新增)
- **目录**: `mobile-app/`
- **特性**: 原生Android体验，触摸优化，离线可用
- **适合**: Android手机用户，随时随地学习

### 🌐 Web桌面版 v2.0 (重大更新)
- **目录**: `web/`
- **特性**: 浏览器访问，响应式设计，PWA支持，📚 课程化学习系统
- **适合**: 桌面用户，大屏幕学习，系统化学习

### 🖥️ Python桌面版 v1.0
- **文件**: `demo.py`
- **特性**: 命令行界面，轻量级，跨平台
- **适合**: 开发者，终端用户

## ✨ 功能特点

### 🎯 核心功能
- 🔤 **假名背诵**：支持275个假名字符（平假名、片假名、浊音、半浊音、拗音、长音等）
- 📝 **单词输入**：通过中文释义练习日语单词的假名输入，内嵌罗马音键盘
- 📚 **课程化学习**：� 按教材顺序系统学习，初级上册→初级下册→中级→高级
- 📊 **学习统计**：🆕 详细的学习数据分析，词汇量统计，进度可视化
- �🎮 **智能练习**：随机出题，多种练习模式

### 📚 课程体系 (新功能)
- **初级上册**：第1-10课，基础语法和常用词汇
- **初级下册**：第11-20课，日常生活词汇扩展
- **中级上册**：第21-30课，复杂语法和表达
- **中级下册**：第31-40课，情感表达和高级词汇
- **高级上册**：第41-50课，社会话题和专业词汇
- **高级下册**：第51-60课，文化理解和深度表达

### ⚙️ 个性化设置
- **假名背诵模式**：
  - 自定义重复次数（1-10次）
  - 精确选择学习内容（Web和移动版）
  - 折叠式界面，清晰分类
- **单词输入模式**：
  - 🆕 课程选择（按教材章节系统学习）
  - 难度等级选择（初级/中级/高级）
  - 单词类型筛选（名词/动词/形容词）
  - 练习模式（练习/测试/复习）
  - 智能得分系统

### 🎨 用户体验
- 📱 **移动优化**：触摸友好，竖屏优化，启动画面
- ⌨️ **输入体验**：内嵌罗马音键盘，实时转换提示，智能纠错
- 📊 **数据可视化**：🆕 学习进度图表，词汇掌握度分析
- 🔄 **数据分离**：CSV数据文件，易于修改和扩展
- 🌐 **离线支持**：所有版本均支持离线使用

## 🚀 快速开始

### 🌐 在线体验 (Web版)

直接访问：**[https://entity003official.github.io/ReciteKing/](https://entity003official.github.io/ReciteKing/)**

支持PWA，可添加到手机桌面！

### �️ 本地运行 (推荐开发者)

1. **克隆项目**
   ```bash
   git clone https://github.com/entity003official/ReciteKing.git
   cd ReciteKing
   ```

2. **启动Web版本**
   ```bash
   # Windows用户可直接双击
   start_server.bat
   
   # 或手动启动
   cd web
   python -m http.server 8080
   ```

3. **访问应用**
   - 打开浏览器访问：`http://localhost:8080`
   - 🆕 查看课程统计：`http://localhost:8080/curriculum-stats.html`

### �📱 Android移动版 (推荐手机用户)

1. **下载APK** (需要自己打包)
   ```bash
   cd mobile-app
   # 按照 mobile-app/README.md 中的步骤打包
   ```

2. **或在线使用移动版界面**
   - 访问上述在线地址
   - 在手机浏览器中添加到桌面

### 🌐 Web桌面版 (推荐桌面用户)

```bash
# 方法1: 使用批处理文件
cd web
start_server.bat

# 方法2: 使用Python
cd web  
python -m http.server 8000
```

然后在浏览器访问 `http://localhost:8000`

### �️ Python桌面版 (命令行用户)

```bash
# 运行程序
python demo.py

# 或修改配置后运行
# 编辑 config.txt 选择练习类型
python demo.py
```

### PWA方式（推荐）
1. 用手机浏览器访问应用
2. 选择"添加到主屏幕"
3. 像原生应用一样使用

### APK打包
详细步骤请参考 [BUILD_GUIDE.md](BUILD_GUIDE.md)
- ✅ 达标移除机制：连续答对指定次数后不再出现
- ✅ 随机出题和选项打乱

## 使用方法

1. **运行程序**

   ```bash
   python demo.py
   ```

2. **根据提示选择正确的罗马音选项**
   - 输入选项编号（1-4）
   - 答对会获得1分，答错会减1分
   - 连续答对2次（默认设置）的假名会被标记为"达标"并不再出现

3. **完成所有假名的学习**
   - 当所有假名都达标后，程序会显示恭喜信息并结束

## 配置文件说明

编辑 `config.txt` 可以自定义练习内容：

```ini
[练习类型]
hiragana = True          # 平假名
katakana = True          # 片假名  
dakuten = True           # 浊音
handakuten = True        # 半浊音
youon = True             # 拗音
youon_dakuten = True     # 浊音拗音
youon_handakuten = True  # 半浊音拗音
chouon = True            # 长音

[游戏设置]
target_score = 2         # 达标分数（连续答对几次后移除）
option_count = 4         # 选择题选项数量
```

将对应项目设置为 `False` 可以禁用某个类型的假名练习。

## 数据文件格式

`kana_data.csv` 的格式为：

```csv
kana,romaji,type
あ,a,hiragana
い,i,hiragana
カ,ka,katakana
...
```

- `kana`: 假名字符
- `romaji`: 对应的罗马音
- `type`: 假名类型（hiragana, katakana, dakuten, handakuten, youon, youon_dakuten, youon_handakuten, chouon）

## 假名类型说明

- **hiragana**: 平假名基础音（あいうえお...）
- **katakana**: 片假名基础音（アイウエオ...）
- **dakuten**: 浊音（がざだば...）
- **handakuten**: 半浊音（ぱぴぷぺぽ...）
- **youon**: 拗音（きゃしゅちょ...）
- **youon_dakuten**: 浊音拗音（ぎゃじゅびょ...）
- **youon_handakuten**: 半浊音拗音（ぴゃぴゅぴょ...）
- **chouon**: 长音（あーいーうー...）

## 自定义学习内容

如果你想添加新的假名或修改现有数据：

1. 编辑 `kana_data.csv` 文件
2. 按照格式添加新行或修改现有行
3. 重新运行程序即可

## 系统要求

- Python 3.6+
- 支持UTF-8编码的终端

## 开发说明

程序从原C++版本转换而来，保持了相同的核心逻辑，但增加了以下改进：

- 数据和代码分离，便于维护
- 可配置的学习内容
- 更好的错误处理
- 更灵活的扩展性

## 📄 许可证

此项目仅用于学习目的，欢迎贡献和改进。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📧 联系

如有问题或建议，请联系：entity.003.official@gmail.com
