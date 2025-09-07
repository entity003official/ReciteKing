// 词汇数据管理器
class VocabularyDataManager {
    constructor() {
        this.vocabularyData = new Map(); // 存储所有课程的词汇数据
        this.categoryData = new Map(); // 存储每个课程的栏目数据
        this.isLoading = false;
        this.loadedLessons = new Set();
        
        this.initializeManager();
    }

    async initializeManager() {
        await this.loadVocabularyIndex();
        this.setupSelectionHandlers();
    }

    // 加载词汇索引文件
    async loadVocabularyIndex() {
        try {
            const response = await fetch('../data/vocabulary/vocabulary_index.csv');
            const text = await response.text();
            this.parseVocabularyIndex(text);
        } catch (error) {
            console.error('加载词汇索引失败:', error);
            this.createDefaultIndex();
        }
    }

    // 解析词汇索引
    parseVocabularyIndex(text) {
        const lines = text.trim().split('\n');
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const parts = this.parseCSVLine(line);
                if (parts.length >= 4) {
                    const [lesson, filename, wordCount, categories] = parts;
                    this.categoryData.set(lesson, {
                        filename: filename,
                        wordCount: parseInt(wordCount) || 0,
                        categories: categories ? categories.split('|') : []
                    });
                }
            }
        }
        
        console.log('词汇索引加载完成:', this.categoryData.size, '个课程');
    }

    // 创建默认索引（如果加载失败）
    createDefaultIndex() {
        for (let i = 1; i <= 24; i++) {
            const lessonName = `第${this.numberToChinese(i)}课`;
            this.categoryData.set(lessonName, {
                filename: `lesson_${i.toString().padStart(2, '0')}_vocabulary.csv`,
                wordCount: 30,
                categories: ['基础词汇', '语法用词', '常用表达']
            });
        }
    }

    // 数字转中文
    numberToChinese(num) {
        const chars = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '二十一', '二十二', '二十三', '二十四'];
        return chars[num] || num.toString();
    }

    // 解析CSV行（处理引号）
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        
        return result;
    }

    // 加载指定课程的词汇数据
    async loadLessonVocabulary(lessonName) {
        if (this.loadedLessons.has(lessonName)) {
            return this.vocabularyData.get(lessonName) || [];
        }

        const lessonInfo = this.categoryData.get(lessonName);
        if (!lessonInfo) {
            console.error(`未找到课程信息: ${lessonName}`);
            return [];
        }

        try {
            const response = await fetch(`../data/vocabulary/${lessonInfo.filename}`);
            const text = await response.text();
            const words = this.parseVocabularyCSV(text);
            
            this.vocabularyData.set(lessonName, words);
            this.loadedLessons.add(lessonName);
            
            console.log(`加载课程 ${lessonName}: ${words.length} 个单词`);
            return words;
        } catch (error) {
            console.error(`加载课程 ${lessonName} 失败:`, error);
            return [];
        }
    }

    // 解析词汇CSV文件
    parseVocabularyCSV(text) {
        const lines = text.trim().split('\n');
        const words = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const parts = this.parseCSVLine(line);
                if (parts.length >= 6) {
                    const [lesson, category, kana, kanji, meaning, wordType] = parts;
                    words.push({
                        lesson: lesson.replace(/"/g, ''),
                        category: category.replace(/"/g, ''),
                        kana: kana.replace(/"/g, ''),
                        kanji: kanji.replace(/"/g, ''),
                        meaning: meaning.replace(/"/g, ''),
                        wordType: wordType.replace(/"/g, ''),
                        romaji: this.kanaToRomaji(kana.replace(/"/g, ''))
                    });
                }
            }
        }
        
        return words;
    }

    // 简单的假名到罗马音转换
    kanaToRomaji(kana) {
        const kanaMap = {
            'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
            'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
            'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
            'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
            'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
            'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
            'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
            'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
            'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
            'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
            'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
            'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
            'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
            'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
            'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n'
        };
        
        let romaji = '';
        for (let i = 0; i < kana.length; i++) {
            const char = kana[i];
            romaji += kanaMap[char] || char;
        }
        
        return romaji;
    }

    // 获取指定课程的栏目列表
    getLessonCategories(lessonName) {
        if (lessonName === 'all') {
            return ['all'];
        }
        
        const lessonInfo = this.categoryData.get(lessonName);
        return lessonInfo ? ['all', ...lessonInfo.categories] : ['all'];
    }

    // 获取过滤后的词汇
    async getFilteredWords(lessonName, categoryName, wordType) {
        let allWords = [];
        
        if (lessonName === 'all') {
            // 加载所有课程
            for (const lesson of this.categoryData.keys()) {
                const words = await this.loadLessonVocabulary(lesson);
                allWords = allWords.concat(words);
            }
        } else {
            // 加载指定课程
            allWords = await this.loadLessonVocabulary(lessonName);
        }
        
        // 应用过滤条件
        let filteredWords = allWords;
        
        if (categoryName && categoryName !== 'all') {
            filteredWords = filteredWords.filter(word => word.category === categoryName);
        }
        
        if (wordType && wordType !== 'all') {
            filteredWords = filteredWords.filter(word => word.wordType === wordType);
        }
        
        return filteredWords;
    }

    // 设置选择变化处理器
    setupSelectionHandlers() {
        const lessonSelect = document.getElementById('lessonSelect');
        const categorySelect = document.getElementById('categorySelect');
        const wordCategorySelect = document.getElementById('wordCategory');
        
        if (lessonSelect) {
            lessonSelect.addEventListener('change', () => this.updateCategoryOptions());
        }
        
        if (categorySelect || wordCategorySelect) {
            [categorySelect, wordCategorySelect].forEach(select => {
                if (select) {
                    select.addEventListener('change', () => this.updatePracticeStatus());
                }
            });
        }
        
        // 初始更新
        this.updateCategoryOptions();
    }

    // 更新栏目选项
    async updateCategoryOptions() {
        const lessonSelect = document.getElementById('lessonSelect');
        const categorySelect = document.getElementById('categorySelect');
        
        if (!lessonSelect || !categorySelect) return;
        
        const selectedLesson = lessonSelect.value;
        
        // 清空现有选项
        categorySelect.innerHTML = '<option value="all">全部栏目</option>';
        
        if (selectedLesson === 'all') {
            // 如果选择全部课程，显示通用栏目
            const commonCategories = ['基础词汇', '语法用词', '常用表达', '生活用语'];
            commonCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } else {
            // 加载特定课程的词汇以获取实际栏目
            try {
                const words = await this.loadLessonVocabulary(selectedLesson);
                const categories = [...new Set(words.map(word => word.category))];
                
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                });
            } catch (error) {
                console.error('加载栏目失败:', error);
            }
        }
        
        await this.updatePracticeStatus();
    }

    // 更新练习状态显示
    async updatePracticeStatus() {
        const lessonSelect = document.getElementById('lessonSelect');
        const categorySelect = document.getElementById('categorySelect');
        const wordCategorySelect = document.getElementById('wordCategory');
        const selectedInfo = document.getElementById('selectedInfo');
        const wordCountInfo = document.getElementById('wordCountInfo');
        const practiceStatus = document.getElementById('practiceStatus');
        
        if (!lessonSelect || !selectedInfo || !wordCountInfo) return;
        
        const selectedLesson = lessonSelect.value;
        const selectedCategory = categorySelect ? categorySelect.value : 'all';
        const selectedWordType = wordCategorySelect ? wordCategorySelect.value : 'all';
        
        // 更新选择信息显示
        let infoText = '';
        if (selectedLesson === 'all') {
            infoText = '全部课程';
        } else {
            infoText = selectedLesson;
        }
        
        if (selectedCategory && selectedCategory !== 'all') {
            infoText += ` - ${selectedCategory}`;
        }
        
        if (selectedWordType && selectedWordType !== 'all') {
            infoText += ` (${selectedWordType})`;
        }
        
        selectedInfo.textContent = `当前选择：${infoText}`;
        
        // 获取可练习的单词数量
        try {
            const words = await this.getFilteredWords(selectedLesson, selectedCategory, selectedWordType);
            wordCountInfo.textContent = `可练习单词：${words.length}个`;
            
            // 显示状态信息
            if (practiceStatus) {
                practiceStatus.style.display = 'block';
            }
        } catch (error) {
            console.error('获取单词数量失败:', error);
            wordCountInfo.textContent = '获取单词数量失败';
        }
    }

    // 获取练习单词（供外部调用）
    async getPracticeWords(lessonName, categoryName, wordType, count) {
        const words = await this.getFilteredWords(lessonName, categoryName, wordType);
        
        if (count === 'all' || count >= words.length) {
            return this.shuffleArray([...words]);
        } else {
            const shuffled = this.shuffleArray([...words]);
            return shuffled.slice(0, parseInt(count));
        }
    }

    // 打乱数组
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// 全局实例
window.vocabularyManager = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.vocabularyManager = new VocabularyDataManager();
});

// 更新栏目选项的全局函数（供HTML调用）
async function updateCategoryOptions() {
    if (window.vocabularyManager) {
        await window.vocabularyManager.updateCategoryOptions();
    }
}
