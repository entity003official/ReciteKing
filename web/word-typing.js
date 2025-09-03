// 单词练习应用类
class WordTypingApp {
    constructor() {
        this.converter = new RomajiConverter();
        this.words = [];
        this.currentWords = [];
        this.currentWordIndex = 0;
        this.currentWord = null;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.errors = [];
        this.settings = {
            difficulty: 'all',
            category: 'all',
            mode: 'practice',
            count: 10
        };
        this.hintShown = false;
        this.keyboardVisible = false;
        this.conversionHintTimeout = null;

        this.initializeApp();
    }

    async initializeApp() {
        await this.loadWords();
        this.setupEventListeners();
        this.updateKeyboardToggle();
    }

    // 加载单词数据
    async loadWords() {
        // 检查是否有来自课程选择的单词数据
        const practiceWords = localStorage.getItem('practiceWords');
        const practiceType = localStorage.getItem('practiceType');
        
        if (practiceWords && practiceType === 'curriculum') {
            try {
                const selectedWords = JSON.parse(practiceWords);
                this.words = this.convertCurriculumWords(selectedWords);
                console.log(`已加载课程选择的 ${this.words.length} 个单词`);
                // 清除已使用的数据
                localStorage.removeItem('practiceWords');
                localStorage.removeItem('practiceType');
                return;
            } catch (error) {
                console.error('解析课程单词数据失败:', error);
            }
        }
        
        // 默认加载 CSV 文件
        try {
            const response = await fetch('japanese_words.csv');
            const text = await response.text();
            this.words = this.parseCSV(text);
            console.log(`已加载 ${this.words.length} 个单词`);
        } catch (error) {
            console.error('加载单词数据失败:', error);
            // 使用默认单词数据
            this.words = this.getDefaultWords();
        }
    }

    // 转换课程单词格式
    convertCurriculumWords(curriculumWords) {
        return curriculumWords.map(word => ({
            kana: word['假名'] || word.kana || '',
            kanji: word['汉字'] || word.kanji || '',
            meaning: word['释义'] || word.meaning || '',
            category: `${word['课程']}-${word['课次']}` || word.category || '未分类',
            difficulty: this.getDifficultyFromLesson(word['课次']) || word.difficulty || 1,
            wordType: word['词性'] || word.wordType || '名词',
            romaji: word['罗马字'] || word.romaji || '',
            example: word['例句假名'] || word.example || '',
            exampleKanji: word['例句汉字'] || word.exampleKanji || '',
            exampleMeaning: word['例句释义'] || word.exampleMeaning || ''
        }));
    }

    // 根据课次推断难度
    getDifficultyFromLesson(lessonName) {
        if (!lessonName) return 1;
        const lessonNum = parseInt(lessonName.replace(/[^0-9]/g, ''));
        if (lessonNum <= 5) return 1;
        if (lessonNum <= 15) return 2;
        if (lessonNum <= 25) return 3;
        return 4;
    }

    parseCSV(text) {
        const lines = text.trim().split('\n');
        const words = [];
        
        // 跳过标题行
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [kana, kanji, meaning, category, difficulty] = line.split(',');
                words.push({
                    kana: kana?.trim(),
                    kanji: kanji?.trim(),
                    meaning: meaning?.trim(),
                    category: category?.trim(),
                    difficulty: parseInt(difficulty?.trim()) || 1
                });
            }
        }
        
        return words.filter(word => word.kana && word.meaning);
    }

    getDefaultWords() {
        return [
            { kana: 'あい', kanji: '愛', meaning: '爱情', category: '名词', difficulty: 1 },
            { kana: 'みず', kanji: '水', meaning: '水', category: '名词', difficulty: 1 },
            { kana: 'ひ', kanji: '火', meaning: '火', category: '名词', difficulty: 1 },
            { kana: 'つち', kanji: '土', meaning: '土', category: '名词', difficulty: 1 },
            { kana: 'かぜ', kanji: '風', meaning: '风', category: '名词', difficulty: 1 }
        ];
    }

    // 设置事件监听器
    setupEventListeners() {
        // 输入框事件
        const romajiInput = document.getElementById('romajiInput');
        if (romajiInput) {
            romajiInput.addEventListener('input', (e) => this.handleRomajiInput(e));
            romajiInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // 假名类型切换
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchKanaType(e));
        });

        // 设置变化监听
        document.querySelectorAll('.setting-select').forEach(select => {
            select.addEventListener('change', (e) => this.updateSettings(e));
        });
    }

    // 更新设置
    updateSettings(event) {
        const setting = event.target.id;
        const value = event.target.value;
        
        switch (setting) {
            case 'wordDifficulty':
                this.settings.difficulty = value;
                break;
            case 'wordCategory':
                this.settings.category = value;
                break;
            case 'practiceMode':
                this.settings.mode = value;
                break;
            case 'wordCount':
                this.settings.count = value === 'all' ? 'all' : parseInt(value);
                break;
        }
    }

    // 开始单词练习
    startWordPractice() {
        this.filterWords();
        this.shuffleWords();
        this.resetStats();
        this.showPracticeScreen();
        this.loadCurrentWord();
    }

    // 筛选单词
    filterWords() {
        let filtered = [...this.words];

        // 按难度筛选
        if (this.settings.difficulty !== 'all') {
            const targetDifficulty = parseInt(this.settings.difficulty);
            filtered = filtered.filter(word => word.difficulty === targetDifficulty);
        }

        // 按类别筛选
        if (this.settings.category !== 'all') {
            filtered = filtered.filter(word => word.category === this.settings.category);
        }

        // 限制数量
        if (this.settings.count !== 'all') {
            filtered = filtered.slice(0, this.settings.count);
        }

        this.currentWords = filtered;
        this.totalQuestions = this.currentWords.length;
    }

    // 打乱单词顺序
    shuffleWords() {
        for (let i = this.currentWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentWords[i], this.currentWords[j]] = [this.currentWords[j], this.currentWords[i]];
        }
    }

    // 重置统计
    resetStats() {
        this.currentWordIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.errors = [];
        this.hintShown = false;
    }

    // 显示练习界面
    showPracticeScreen() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('practiceScreen').style.display = 'block';
        document.getElementById('resultScreen').style.display = 'none';
    }

    // 显示结果界面
    showResultScreen() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('practiceScreen').style.display = 'none';
        document.getElementById('resultScreen').style.display = 'block';
        this.displayResults();
    }

    // 返回主菜单
    backToMenu() {
        document.getElementById('mainMenu').style.display = 'block';
        document.getElementById('practiceScreen').style.display = 'none';
        document.getElementById('resultScreen').style.display = 'none';
        this.closeKeyboard();
    }

    // 加载当前单词
    loadCurrentWord() {
        if (this.currentWordIndex >= this.currentWords.length) {
            this.showResultScreen();
            return;
        }

        this.currentWord = this.currentWords[this.currentWordIndex];
        this.hintShown = false;

        // 更新界面
        this.updateQuestionDisplay();
        this.resetInput();
        this.clearFeedback();
        this.updateProgress();
    }

    // 更新题目显示
    updateQuestionDisplay() {
        const chineseMeaning = document.getElementById('chineseMeaning');
        const kanjiWord = document.getElementById('kanjiWord');
        const wordCategory = document.getElementById('wordCategory');
        const wordDifficulty = document.getElementById('wordDifficulty');

        if (chineseMeaning) chineseMeaning.textContent = this.currentWord.meaning;
        
        // 根据模式决定是否显示汉字
        if (kanjiWord) {
            if (this.settings.mode === 'practice' || this.hintShown) {
                kanjiWord.textContent = this.currentWord.kanji || '';
                kanjiWord.style.display = this.currentWord.kanji ? 'block' : 'none';
            } else {
                kanjiWord.style.display = 'none';
            }
        }

        if (wordCategory) wordCategory.textContent = this.currentWord.category;
        if (wordDifficulty) {
            const stars = '★'.repeat(this.currentWord.difficulty) + '☆'.repeat(3 - this.currentWord.difficulty);
            wordDifficulty.textContent = `难度: ${stars}`;
        }

        // 更新假名显示 (隐藏，用于答案对比)
        const kanaDisplay = document.getElementById('kanaDisplay');
        if (kanaDisplay) {
            kanaDisplay.textContent = this.currentWord.kana;
            kanaDisplay.style.visibility = 'hidden'; // 隐藏正确答案
        }
    }

    // 重置输入
    resetInput() {
        const romajiInput = document.getElementById('romajiInput');
        const submitBtn = document.getElementById('submitBtn');
        
        if (romajiInput) {
            romajiInput.value = '';
            romajiInput.disabled = false;
            romajiInput.classList.remove('input-error', 'input-success');
        }
        
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        this.clearConversionHint();
    }

    // 处理罗马音输入
    handleRomajiInput(event) {
        const input = event.target.value.toLowerCase();
        const submitBtn = document.getElementById('submitBtn');
        
        // 启用/禁用提交按钮
        if (submitBtn) {
            submitBtn.disabled = input.trim().length === 0;
        }

        // 实时转换预览 (仅在练习模式)
        if (this.settings.mode === 'practice') {
            this.showConversionHint(input);
        }

        // 检查输入是否只包含有效字符
        if (input && !this.isValidRomajiInput(input)) {
            event.target.classList.add('input-error');
        } else {
            event.target.classList.remove('input-error');
        }
    }

    // 检查罗马音输入是否有效
    isValidRomajiInput(input) {
        // 只允许罗马字母、空格和一些特殊字符
        return /^[a-z\s\-]*$/i.test(input);
    }

    // 显示转换提示
    showConversionHint(input) {
        if (!input.trim()) {
            this.clearConversionHint();
            return;
        }

        // 清除之前的超时
        if (this.conversionHintTimeout) {
            clearTimeout(this.conversionHintTimeout);
        }

        // 延迟显示，避免过度更新
        this.conversionHintTimeout = setTimeout(() => {
            const converted = this.converter.convert(input);
            const suggestions = this.converter.getSuggestions(input);
            
            this.displayConversionHint(input, converted, suggestions);
        }, 300);
    }

    // 显示转换提示UI
    displayConversionHint(input, converted, suggestions) {
        let hintElement = document.querySelector('.conversion-hint');
        
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.className = 'conversion-hint';
            const inputContainer = document.querySelector('.romaji-input-container');
            inputContainer.parentNode.insertBefore(hintElement, inputContainer.nextSibling);
        }

        let hintHTML = `
            <div class="conversion-preview">
                "${input}" → ${converted || '(未完成)'}
            </div>
        `;

        if (suggestions.length > 0) {
            hintHTML += `
                <div class="conversion-suggestions">
                    建议: ${suggestions.join(', ')}
                </div>
            `;
        }

        hintElement.innerHTML = hintHTML;
    }

    // 清除转换提示
    clearConversionHint() {
        const hintElement = document.querySelector('.conversion-hint');
        if (hintElement) {
            hintElement.remove();
        }
        
        if (this.conversionHintTimeout) {
            clearTimeout(this.conversionHintTimeout);
            this.conversionHintTimeout = null;
        }
    }

    // 处理键盘按键
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!document.getElementById('submitBtn').disabled) {
                this.submitAnswer();
            }
        } else if (event.key === 'Escape') {
            this.closeKeyboard();
        }
    }

    // 提交答案
    submitAnswer() {
        const romajiInput = document.getElementById('romajiInput');
        const userInput = romajiInput.value.trim().toLowerCase();
        
        if (!userInput) return;

        // 转换用户输入
        const userKana = this.converter.convert(userInput);
        const correctKana = this.currentWord.kana;
        
        // 判断答案正确性
        const isCorrect = userKana === correctKana;
        
        // 计算得分
        let points = 0;
        if (isCorrect) {
            points = this.calculatePoints();
            this.score += points;
            this.correctAnswers++;
        } else {
            // 记录错误
            this.errors.push({
                word: this.currentWord,
                userInput: userInput,
                userKana: userKana,
                correctKana: correctKana
            });
        }

        // 显示反馈
        this.showFeedback(isCorrect, points);
        
        // 禁用输入
        romajiInput.disabled = true;
        document.getElementById('submitBtn').disabled = true;
    }

    // 计算得分
    calculatePoints() {
        let basePoints = 10;
        
        // 难度加成
        basePoints += (this.currentWord.difficulty - 1) * 5;
        
        // 提示扣分
        if (this.hintShown) {
            basePoints = Math.max(basePoints - 5, 1);
        }
        
        return basePoints;
    }

    // 显示反馈
    showFeedback(isCorrect, points) {
        const feedbackArea = document.getElementById('feedbackArea');
        const feedbackResult = document.getElementById('feedbackResult');
        const correctKana = document.getElementById('correctKana');
        const correctKanji = document.getElementById('correctKanji');
        const correctRomaji = document.getElementById('correctRomaji');

        // 显示反馈区域
        feedbackArea.style.display = 'block';
        feedbackArea.scrollIntoView({ behavior: 'smooth' });

        // 设置反馈结果
        if (isCorrect) {
            feedbackResult.className = 'feedback-result correct';
            feedbackResult.innerHTML = `
                <span class="result-icon">✓</span>
                <span class="result-text">正确！+${points}分</span>
            `;
        } else {
            feedbackResult.className = 'feedback-result incorrect';
            feedbackResult.innerHTML = `
                <span class="result-icon">✗</span>
                <span class="result-text">答案错误</span>
            `;
        }

        // 显示正确答案
        if (correctKana) correctKana.textContent = this.currentWord.kana;
        if (correctKanji) correctKanji.textContent = this.currentWord.kanji || '';
        if (correctRomaji) {
            const romaji = this.converter.kanaToRomaji(this.currentWord.kana);
            correctRomaji.textContent = romaji;
        }

        // 更新得分显示
        this.updateScore();
    }

    // 清除反馈
    clearFeedback() {
        const feedbackArea = document.getElementById('feedbackArea');
        if (feedbackArea) {
            feedbackArea.style.display = 'none';
        }
        this.clearConversionHint();
    }

    // 下一个单词
    nextWord() {
        this.currentWordIndex++;
        this.loadCurrentWord();
    }

    // 显示提示
    showHint() {
        if (this.hintShown) return;
        
        this.hintShown = true;
        
        // 显示汉字
        const kanjiWord = document.getElementById('kanjiWord');
        if (kanjiWord && this.currentWord.kanji) {
            kanjiWord.textContent = this.currentWord.kanji;
            kanjiWord.style.display = 'block';
        }

        // 显示提示内容
        this.displayHintContent();
    }

    // 显示提示内容
    displayHintContent() {
        let hintElement = document.querySelector('.hint-display');
        
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.className = 'hint-display';
            const submitSection = document.querySelector('.submit-section');
            submitSection.parentNode.insertBefore(hintElement, submitSection);
        }

        const romaji = this.converter.kanaToRomaji(this.currentWord.kana);
        
        hintElement.innerHTML = `
            <div class="hint-content">
                💡 提示信息
            </div>
            <div class="hint-kana">${this.currentWord.kana}</div>
            <div class="hint-romaji">罗马音: ${romaji}</div>
        `;
    }

    // 更新进度显示
    updateProgress() {
        const progressElement = document.getElementById('currentWordProgress');
        if (progressElement) {
            progressElement.textContent = `${this.currentWordIndex + 1} / ${this.totalQuestions}`;
        }
    }

    // 更新得分显示
    updateScore() {
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    // 显示最终结果
    displayResults() {
        const totalQuestions = document.getElementById('totalQuestions');
        const correctAnswers = document.getElementById('correctAnswers');
        const accuracyRate = document.getElementById('accuracyRate');
        const finalScore = document.getElementById('finalScore');
        const errorReview = document.getElementById('errorReview');
        const errorList = document.getElementById('errorList');
        const reviewBtn = document.getElementById('reviewBtn');

        if (totalQuestions) totalQuestions.textContent = this.totalQuestions;
        if (correctAnswers) correctAnswers.textContent = this.correctAnswers;
        if (accuracyRate) {
            const rate = this.totalQuestions > 0 ? Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;
            accuracyRate.textContent = `${rate}%`;
        }
        if (finalScore) finalScore.textContent = this.score;

        // 显示错误回顾
        if (this.errors.length > 0 && errorReview && errorList) {
            errorReview.style.display = 'block';
            errorList.innerHTML = this.errors.map(error => `
                <div class="error-item">
                    <div class="error-meaning">${error.word.meaning}</div>
                    <div class="error-details">
                        你的输入: <span class="your-answer">${error.userInput}</span> → ${error.userKana || '(无效)'}<br>
                        正确答案: <span class="correct-answer-text">${error.word.kana}</span>
                    </div>
                </div>
            `).join('');
            
            if (reviewBtn) reviewBtn.style.display = 'inline-block';
        } else {
            if (errorReview) errorReview.style.display = 'none';
            if (reviewBtn) reviewBtn.style.display = 'none';
        }
    }

    // 开始复习模式
    startReviewMode() {
        if (this.errors.length === 0) return;
        
        // 使用错误的单词创建复习列表
        this.currentWords = this.errors.map(error => error.word);
        this.totalQuestions = this.currentWords.length;
        this.resetStats();
        this.showPracticeScreen();
        this.loadCurrentWord();
    }

    // 罗马音键盘功能
    toggleKeyboard() {
        const keyboard = document.getElementById('romajiKeyboard');
        const toggle = document.querySelector('.keyboard-toggle');
        
        if (this.keyboardVisible) {
            this.closeKeyboard();
        } else {
            this.openKeyboard();
        }
    }

    openKeyboard() {
        const keyboard = document.getElementById('romajiKeyboard');
        const toggle = document.querySelector('.keyboard-toggle');
        
        if (keyboard) {
            keyboard.style.display = 'block';
            this.keyboardVisible = true;
        }
        
        if (toggle) {
            toggle.textContent = '⌨️';
            toggle.style.bottom = '200px'; // 键盘高度之上
        }
    }

    closeKeyboard() {
        const keyboard = document.getElementById('romajiKeyboard');
        const toggle = document.querySelector('.keyboard-toggle');
        
        if (keyboard) {
            keyboard.style.display = 'none';
            this.keyboardVisible = false;
        }
        
        if (toggle) {
            toggle.textContent = '⌨️';
            toggle.style.bottom = '20px';
        }
    }

    // 更新键盘切换按钮
    updateKeyboardToggle() {
        // 创建键盘切换按钮
        if (!document.querySelector('.keyboard-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'keyboard-toggle';
            toggleBtn.textContent = '⌨️';
            toggleBtn.title = '显示/隐藏罗马音键盘';
            toggleBtn.onclick = () => this.toggleKeyboard();
            document.body.appendChild(toggleBtn);
        }
    }

    // 切换假名类型
    switchKanaType(event) {
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const kanaType = event.target.dataset.type;
        this.updateKanaOptions(kanaType);
    }

    // 更新假名选项
    updateKanaOptions(kanaType) {
        const kanaOptions = document.getElementById('kanaOptions');
        if (!kanaOptions) return;

        const kanaSet = kanaType === 'hiragana' ? this.converter.hiraganaMap : this.converter.katakanaMap;
        const options = Object.keys(kanaSet).slice(0, 20); // 显示前20个常用假名

        kanaOptions.innerHTML = options.map(romaji => `
            <button class="kana-option" onclick="selectKana('${romaji}', '${kanaSet[romaji]}')">
                <div>${kanaSet[romaji]}</div>
                <div style="font-size: 0.7rem; color: #666;">${romaji}</div>
            </button>
        `).join('');
    }

    // 清空输入
    clearInput() {
        const romajiInput = document.getElementById('romajiInput');
        if (romajiInput) {
            romajiInput.value = '';
            romajiInput.disabled = false;
            romajiInput.classList.remove('input-error', 'input-success');
            romajiInput.focus();
        }
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        this.clearConversionHint();
    }
}

// 键盘相关函数
function addRomaji(romaji) {
    const input = document.getElementById('romajiInput');
    if (input && !input.disabled) {
        input.value += romaji;
        input.dispatchEvent(new Event('input')); // 触发input事件
        input.focus();
    }
}

function addSpace() {
    const input = document.getElementById('romajiInput');
    if (input && !input.disabled) {
        input.value += ' ';
        input.dispatchEvent(new Event('input'));
        input.focus();
    }
}

function backspaceRomaji() {
    const input = document.getElementById('romajiInput');
    if (input && !input.disabled && input.value.length > 0) {
        input.value = input.value.slice(0, -1);
        input.dispatchEvent(new Event('input'));
        input.focus();
    }
}

function confirmInput() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && !submitBtn.disabled) {
        submitAnswer();
    }
}

function selectKana(romaji, kana) {
    const input = document.getElementById('romajiInput');
    if (input && !input.disabled) {
        input.value += romaji;
        input.dispatchEvent(new Event('input'));
        input.focus();
    }
}

function closeKeyboard() {
    if (window.wordApp) {
        window.wordApp.closeKeyboard();
    }
}

// 全局函数 (供HTML调用)
function startWordPractice() {
    if (window.wordApp) {
        window.wordApp.startWordPractice();
    }
}

function backToMenu() {
    if (window.wordApp) {
        window.wordApp.backToMenu();
    }
}

function submitAnswer() {
    if (window.wordApp) {
        window.wordApp.submitAnswer();
    }
}

function nextWord() {
    if (window.wordApp) {
        window.wordApp.nextWord();
    }
}

function showHint() {
    if (window.wordApp) {
        window.wordApp.showHint();
    }
}

function clearInput() {
    if (window.wordApp) {
        window.wordApp.clearInput();
    }
}

function startReviewMode() {
    if (window.wordApp) {
        window.wordApp.startReviewMode();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.wordApp = new WordTypingApp();
});
