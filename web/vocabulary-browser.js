// 词汇浏览器类
class VocabularyBrowser {
    constructor() {
        this.allVocabulary = new Map(); // 存储所有词汇数据，按课程分组
        this.filteredVocabulary = new Map(); // 过滤后的词汇数据
        this.selectedWords = new Set(); // 选中的单词
        this.expandedLessons = new Set(); // 展开的课程
        this.expandedCategories = new Set(); // 展开的栏目
        this.isLoading = false;

        this.initializeBrowser();
    }

    async initializeBrowser() {
        // 等待词汇管理器初始化
        await this.waitForVocabularyManager();
        
        // 加载所有词汇数据
        await this.loadAllVocabulary();
        
        // 设置事件监听
        this.setupEventListeners();
    }

    async waitForVocabularyManager() {
        return new Promise(resolve => {
            const checkManager = () => {
                if (window.vocabularyManager) {
                    resolve();
                } else {
                    setTimeout(checkManager, 100);
                }
            };
            checkManager();
        });
    }

    async loadAllVocabulary() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const displayElement = document.getElementById('vocabularyDisplay');
        
        try {
            displayElement.innerHTML = '<div class="loading">正在加载词汇数据...</div>';
            
            // 获取所有课程列表
            const lessons = Array.from(window.vocabularyManager.categoryData.keys());
            
            // 加载每个课程的词汇
            for (const lesson of lessons) {
                try {
                    const words = await window.vocabularyManager.loadLessonVocabulary(lesson);
                    if (words && words.length > 0) {
                        this.allVocabulary.set(lesson, words);
                    }
                } catch (error) {
                    console.error(`加载课程 ${lesson} 失败:`, error);
                }
            }

            console.log(`加载完成，共 ${this.allVocabulary.size} 个课程`);
            
            // 应用初始过滤
            this.filterVocabulary();
            
        } catch (error) {
            console.error('加载词汇数据失败:', error);
            displayElement.innerHTML = `
                <div class="empty-state">
                    <h3>❌ 加载失败</h3>
                    <p>无法加载词汇数据，请检查文件路径或重试</p>
                    <button class="btn btn-primary" onclick="vocabularyBrowser.loadAllVocabulary()">🔄 重试</button>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    filterVocabulary() {
        const lessonFilter = document.getElementById('lessonFilter').value;
        const wordTypeFilter = document.getElementById('wordTypeFilter').value;
        
        this.filteredVocabulary.clear();
        
        for (const [lesson, words] of this.allVocabulary) {
            // 课程过滤
            if (lessonFilter !== 'all' && lesson !== lessonFilter) {
                continue;
            }
            
            // 词性过滤
            let filteredWords = words;
            if (wordTypeFilter !== 'all') {
                filteredWords = words.filter(word => word.wordType === wordTypeFilter);
            }
            
            if (filteredWords.length > 0) {
                this.filteredVocabulary.set(lesson, filteredWords);
            }
        }
        
        this.renderVocabulary();
    }

    renderVocabulary() {
        const displayElement = document.getElementById('vocabularyDisplay');
        
        if (this.filteredVocabulary.size === 0) {
            displayElement.innerHTML = `
                <div class="empty-state">
                    <h3>📝 没有找到匹配的词汇</h3>
                    <p>请调整筛选条件或检查数据是否正确加载</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        for (const [lesson, words] of this.filteredVocabulary) {
            // 按栏目分组
            const categorizedWords = this.groupWordsByCategory(words);
            const totalWords = words.length;
            const categoryCount = Object.keys(categorizedWords).length;
            
            const isExpanded = this.expandedLessons.has(lesson);
            
            html += `
                <div class="lesson-section">
                    <div class="lesson-header ${isExpanded ? 'expanded' : ''}" onclick="vocabularyBrowser.toggleLesson('${lesson}')">
                        <div class="lesson-title">${lesson}</div>
                        <div class="lesson-stats">
                            <span>${totalWords} 个单词</span>
                            <span>${categoryCount} 个栏目</span>
                        </div>
                        <div class="expand-icon">▶</div>
                    </div>
                    <div class="lesson-content ${isExpanded ? 'expanded' : ''}">
                        ${this.renderCategories(lesson, categorizedWords)}
                    </div>
                </div>
            `;
        }
        
        displayElement.innerHTML = html;
        this.updateSelectionSummary();
    }

    groupWordsByCategory(words) {
        const categorized = {};
        
        for (const word of words) {
            const category = word.category || '其他';
            if (!categorized[category]) {
                categorized[category] = [];
            }
            categorized[category].push(word);
        }
        
        return categorized;
    }

    renderCategories(lesson, categorizedWords) {
        let html = '';
        
        for (const [category, words] of Object.entries(categorizedWords)) {
            const categoryKey = `${lesson}-${category}`;
            const isExpanded = this.expandedCategories.has(categoryKey);
            
            html += `
                <div class="category-section">
                    <div class="category-header" onclick="vocabularyBrowser.toggleCategory('${categoryKey}')">
                        <div class="category-title">${category}</div>
                        <div class="category-count">${words.length} 个</div>
                    </div>
                    <div class="category-content ${isExpanded ? 'expanded' : ''}">
                        ${this.renderWords(words)}
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    renderWords(words) {
        let html = '<div class="word-list">';
        
        for (const word of words) {
            const wordId = this.generateWordId(word);
            const isSelected = this.selectedWords.has(wordId);
            
            html += `
                <div class="word-item">
                    <input type="checkbox" class="word-checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           onchange="vocabularyBrowser.toggleWordSelection('${wordId}', this.checked)"
                           data-word='${JSON.stringify(word).replace(/'/g, "&#39;")}'>
                    <div class="word-display">
                        <div class="word-japanese">
                            ${this.renderJapanese(word.kana, word.kanji)}
                        </div>
                        <div class="word-meaning">${word.meaning}</div>
                        <div class="word-type">${word.wordType}</div>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    renderJapanese(kana, kanji) {
        if (kanji && kanji.trim() && kanji !== kana) {
            // 有汉字的情况：汉字上方显示假名
            return `
                <div class="word-kanji">
                    <div class="word-kana">${kana}</div>
                    ${kanji}
                </div>
            `;
        } else {
            // 只有假名的情况：直接显示假名
            return `<div class="word-kana-only">${kana}</div>`;
        }
    }

    generateWordId(word) {
        return `${word.lesson}-${word.category}-${word.kana}-${word.meaning}`;
    }

    toggleLesson(lesson) {
        if (this.expandedLessons.has(lesson)) {
            this.expandedLessons.delete(lesson);
        } else {
            this.expandedLessons.add(lesson);
        }
        this.renderVocabulary();
    }

    toggleCategory(categoryKey) {
        if (this.expandedCategories.has(categoryKey)) {
            this.expandedCategories.delete(categoryKey);
        } else {
            this.expandedCategories.add(categoryKey);
        }
        this.renderVocabulary();
    }

    toggleWordSelection(wordId, isSelected) {
        if (isSelected) {
            this.selectedWords.add(wordId);
        } else {
            this.selectedWords.delete(wordId);
        }
        this.updateSelectionSummary();
    }

    updateSelectionSummary() {
        const summaryElement = document.getElementById('selectionSummary');
        const selectedCountElement = document.getElementById('selectedCount');
        const selectedLessonsElement = document.getElementById('selectedLessons');
        const selectedCategoriesElement = document.getElementById('selectedCategories');
        
        if (this.selectedWords.size === 0) {
            summaryElement.style.display = 'none';
            return;
        }
        
        summaryElement.style.display = 'block';
        selectedCountElement.textContent = this.selectedWords.size;
        
        // 统计选中单词的课程和栏目
        const lessons = new Set();
        const categories = new Set();
        
        // 通过遍历DOM中选中的复选框来获取单词信息
        document.querySelectorAll('.word-checkbox:checked').forEach(checkbox => {
            try {
                const wordData = JSON.parse(checkbox.dataset.word.replace(/&#39;/g, "'"));
                lessons.add(wordData.lesson);
                categories.add(wordData.category);
            } catch (error) {
                console.error('解析单词数据失败:', error);
            }
        });
        
        selectedLessonsElement.textContent = lessons.size > 0 ? Array.from(lessons).join(', ') : '无';
        selectedCategoriesElement.textContent = categories.size > 0 ? Array.from(categories).join(', ') : '无';
    }

    expandAll() {
        // 展开所有课程
        for (const lesson of this.filteredVocabulary.keys()) {
            this.expandedLessons.add(lesson);
            
            // 展开该课程的所有栏目
            const words = this.filteredVocabulary.get(lesson);
            const categorizedWords = this.groupWordsByCategory(words);
            for (const category of Object.keys(categorizedWords)) {
                this.expandedCategories.add(`${lesson}-${category}`);
            }
        }
        this.renderVocabulary();
    }

    collapseAll() {
        this.expandedLessons.clear();
        this.expandedCategories.clear();
        this.renderVocabulary();
    }

    startSelectedPractice() {
        if (this.selectedWords.size === 0) {
            alert('请先选择要练习的单词！');
            return;
        }
        
        // 收集选中的单词数据
        const selectedWordsData = [];
        document.querySelectorAll('.word-checkbox:checked').forEach(checkbox => {
            try {
                const wordData = JSON.parse(checkbox.dataset.word.replace(/&#39;/g, "'"));
                selectedWordsData.push(wordData);
            } catch (error) {
                console.error('解析单词数据失败:', error);
            }
        });
        
        if (selectedWordsData.length === 0) {
            alert('选中的单词数据无效！');
            return;
        }
        
        // 将数据存储到localStorage
        localStorage.setItem('practiceWords', JSON.stringify(selectedWordsData));
        localStorage.setItem('practiceType', 'selected');
        
        // 跳转到练习页面
        window.location.href = 'word-typing.html';
    }

    setupEventListeners() {
        // 已在HTML中设置了onchange事件，这里可以添加其他监听器
        console.log('词汇浏览器事件监听器设置完成');
    }
}

// 全局函数，供HTML调用
function filterVocabulary() {
    if (window.vocabularyBrowser) {
        window.vocabularyBrowser.filterVocabulary();
    }
}

function loadAllVocabulary() {
    if (window.vocabularyBrowser) {
        window.vocabularyBrowser.loadAllVocabulary();
    }
}

function expandAll() {
    if (window.vocabularyBrowser) {
        window.vocabularyBrowser.expandAll();
    }
}

function collapseAll() {
    if (window.vocabularyBrowser) {
        window.vocabularyBrowser.collapseAll();
    }
}

function startSelectedPractice() {
    if (window.vocabularyBrowser) {
        window.vocabularyBrowser.startSelectedPractice();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.vocabularyBrowser = new VocabularyBrowser();
});
