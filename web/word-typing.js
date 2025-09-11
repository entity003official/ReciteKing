
    // 验证用户输入的答案
    function validateAnswer(userInput, correctAnswer) {
        // 清理用户输入
        const cleanInput = userInput.trim().toLowerCase();
        
        // 处理多个可能的答案（用|分隔）
        const possibleAnswers = correctAnswer.split('|').map(answer => answer.trim().toLowerCase());
        
        // 检查用户输入是否匹配任何一个可能的答案
        return possibleAnswers.includes(cleanInput);
    }
    

// 单词个性化背诵管理器
class WordTypingSelector {
    constructor() {
        this.vocabData = {};
        this.selectedWords = new Map(); // key: wordId, value: { ...word, repeatCount }
        this.init();
    }

    async init() {
        console.log('WordTypingSelector 开始初始化...');
        try {
            await this.loadAllVocabulary();
            console.log('词汇数据加载完成，开始渲染');
            this.renderCourseList();
            this.updateSelectedCount();
            console.log('WordTypingSelector 初始化完成');
        } catch (error) {
            console.error('WordTypingSelector 初始化失败:', error);
            // 显示错误信息到页面
            const container = document.getElementById('wordCourseList');
            if (container) {
                container.innerHTML = `
                    <div style="color: red; padding: 20px; border: 2px solid red; border-radius: 8px; background: #fff5f5;">
                        <h4>❌ 数据加载失败</h4>
                        <p><strong>错误信息:</strong> ${error.message}</p>
                        <p><strong>建议:</strong></p>
                        <ul>
                            <li>检查是否已启动本地服务器</li>
                            <li>确认 data/vocabulary/ 目录下的CSV文件存在</li>
                            <li>按F12查看控制台更多错误信息</li>
                        </ul>
                    </div>
                `;
            }
        }
    }

    // 加载所有课程的单词，按课程/栏目/单词三级分组
    async loadAllVocabulary() {
        console.log('开始加载词汇数据...');
        
        if (window.performanceMonitor) {
            return window.performanceMonitor.measureOperation('loadAllVocabulary', async () => {
                return this._loadAllVocabularyInternal();
            });
        } else {
            return this._loadAllVocabularyInternal();
        }
    }
    
    async _loadAllVocabularyInternal() {
        if (!window.vocabularyManager) {
            console.log('vocabularyManager 不存在，等待加载...');
            await new Promise(resolve => {
                const check = () => {
                    if (window.vocabularyManager) {
                        console.log('vocabularyManager 已加载');
                        resolve();
                    } else {
                        console.log('继续等待 vocabularyManager...');
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        }
        
        console.log('vocabularyManager 可用，等待初始化完成...');
        
        // 等待vocabulary-manager初始化完成
        try {
            await window.vocabularyManager.waitForInitialization();
            console.log('vocabularyManager 初始化完成，开始获取课程名...');
        } catch (error) {
            console.error('等待vocabularyManager初始化失败:', error);
            throw new Error('vocabularyManager初始化失败');
        }
        
        // 获取所有课程名
        let lessons = [];
        try {
            lessons = await window.vocabularyManager.getAllLessonNames();
            console.log('获取到课程列表:', lessons);
        } catch (e) {
            console.error('获取课程名失败:', e);
            lessons = [];
        }
        
        this.vocabData = {};
        let hasData = false;
        
        // 分析数据加载复杂度
        if (window.performanceMonitor) {
            window.performanceMonitor.analyzeComplexity('dataLoading', lessons.length, async (size) => {
                const testLessons = lessons.slice(0, size);
                for (const lesson of testLessons) {
                    await window.vocabularyManager.loadLessonVocabulary(lesson);
                }
            });
        }
        
        for (const lesson of lessons) {
            console.log(`加载课程: ${lesson}`);
            let words = [];
            try {
                words = await window.vocabularyManager.loadLessonVocabulary(lesson);
                console.log(`课程 ${lesson} 加载了 ${words.length} 个单词`);
            } catch (e) {
                console.error(`课程 ${lesson} 加载失败:`, e);
                words = [];
            }
            
            for (const word of words) {
                hasData = true;
                const section = word.category || '未分类';
                if (!this.vocabData[lesson]) this.vocabData[lesson] = {};
                if (!this.vocabData[lesson][section]) this.vocabData[lesson][section] = [];
                this.vocabData[lesson][section].push(word);
            }
        }
        
        console.log('最终加载的数据结构:', this.vocabData);
        console.log('是否有数据:', hasData);
        
        // fallback: 若无数据，显示夸张报错信息
        if (!hasData) {
            throw new Error('【致命错误】未能加载任何单词数据！请检查词汇文件、数据源或 vocabularyManager 是否正常！\n\n【FATAL ERROR】NO VOCABULARY DATA LOADED!\n请联系开发者或检查数据配置。');
        }
    }

    // 渲染课程/栏目/单词分组
    renderCourseList() {
        const container = document.getElementById('wordCourseList');
        if (!container) return;
        container.innerHTML = '';
        if (Object.keys(this.vocabData).length === 0) {
            container.innerHTML = '<div style="color:#888;padding:2em;text-align:center;">暂无单词数据，请检查词汇文件或数据加载！</div>';
            return;
        }
        let total = 0;
        for (const lesson of Object.keys(this.vocabData)) {
            const lessonId = `lesson-${lesson}`;
            // 课程折叠区
            const lessonSection = document.createElement('div');
            lessonSection.className = 'collapsible-section';
            // 课程头
            const lessonHeader = document.createElement('div');
            lessonHeader.className = 'section-header';
            lessonHeader.innerHTML = `<input type="checkbox" class="lesson-checkbox"> <label>${lesson}</label><span class="collapse-icon">▼</span>`;
            lessonSection.appendChild(lessonHeader);
            // 课程内容
            const lessonContent = document.createElement('div');
            lessonContent.className = 'section-content';
            // 栏目分组
            for (const section of Object.keys(this.vocabData[lesson])) {
                const sectionId = `section-${lesson}-${section}`;
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'collapsible-section';
                // 栏目头
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'section-header';
                sectionHeader.innerHTML = `<input type="checkbox" class="section-checkbox"> <label>${section}</label><span class="collapse-icon">▼</span>`;
                sectionDiv.appendChild(sectionHeader);
                // 单词列表
                const sectionContent = document.createElement('div');
                sectionContent.className = 'section-content';
                sectionContent.innerHTML = '<div class="word-grid"></div>';
                const wordGrid = sectionContent.querySelector('.word-grid');
                for (const word of this.vocabData[lesson][section]) {
                    total++;
                    const wordId = `${lesson}|${section}|${word.kana}|${word.kanji}`;
                    const wordItem = document.createElement('div');
                    wordItem.className = 'word-item';
                    
                    // 获取错误次数
                    const mistakeCount = window.mistakeTracker ? window.mistakeTracker.getMistakeCount(word) : 0;
                    const hasMistakes = mistakeCount > 0;
                    
                    if (hasMistakes) {
                        wordItem.classList.add('has-mistakes');
                    }
                    
                    wordItem.innerHTML = `
                        <input type="checkbox" class="word-checkbox" data-word-id="${wordId}">
                        ${hasMistakes ? `<div class="mistake-indicator">${mistakeCount}</div>` : ''}
                        <div class="word-info">
                            <span class="word-kana">${word.kana || ''}</span>
                            <span class="word-kanji">${word.kanji || ''}</span>
                            <span class="word-meaning">${word.meaning || ''}</span>
                            <span class="word-type">${word.wordType || ''}</span>
                        </div>
                        <div class="repeat-control">
                            <button class="repeat-btn" data-word-id="${wordId}" data-action="dec">-</button>
                            <span class="repeat-count" id="repeat-${wordId}">1</span>
                            <button class="repeat-btn" data-word-id="${wordId}" data-action="inc">+</button>
                        </div>
                    `;
                    wordGrid.appendChild(wordItem);
                }
                sectionDiv.appendChild(sectionContent);
                lessonContent.appendChild(sectionDiv);
            }
            lessonSection.appendChild(lessonContent);
            container.appendChild(lessonSection);
        }
        this.bindEvents();
    }

    // 绑定折叠、勾选、次数设置等事件
    bindEvents() {
        // 折叠/展开
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', function(e) {
                if (e.target.tagName === 'INPUT') return;
                const icon = header.querySelector('.collapse-icon');
                const content = header.nextElementSibling;
                if (content) {
                    content.classList.toggle('collapsed');
                    icon.classList.toggle('collapsed');
                }
            });
        });
        // 勾选事件
        document.querySelectorAll('.word-checkbox').forEach(cb => {
            cb.addEventListener('change', e => {
                const wordId = cb.getAttribute('data-word-id');
                if (cb.checked) {
                    this.selectedWords.set(wordId, { repeatCount: 1 });
                } else {
                    this.selectedWords.delete(wordId);
                }
                this.updateSelectedCount();
            });
        });
        // 次数按钮
        document.querySelectorAll('.repeat-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const wordId = btn.getAttribute('data-word-id');
                const action = btn.getAttribute('data-action');
                let info = this.selectedWords.get(wordId);
                if (!info) {
                    // 自动勾选
                    this.selectedWords.set(wordId, { repeatCount: 1 });
                    document.querySelector(`.word-checkbox[data-word-id="${wordId}"]`).checked = true;
                    info = this.selectedWords.get(wordId);
                }
                let count = info.repeatCount || 1;
                if (action === 'inc') count++;
                if (action === 'dec' && count > 1) count--;
                info.repeatCount = count;
                document.getElementById(`repeat-${wordId}`).textContent = count;
                this.selectedWords.set(wordId, info);
                this.updateSelectedCount();
            });
        });
        // 课程全选
        document.querySelectorAll('.lesson-checkbox').forEach((cb, idx) => {
            cb.addEventListener('change', e => {
                const lessonSection = cb.closest('.collapsible-section');
                lessonSection.querySelectorAll('.section-checkbox').forEach(secCb => {
                    secCb.checked = cb.checked;
                    secCb.dispatchEvent(new Event('change'));
                });
                lessonSection.querySelectorAll('.word-checkbox').forEach(wordCb => {
                    wordCb.checked = cb.checked;
                    wordCb.dispatchEvent(new Event('change'));
                });
            });
        });
        // 栏目全选
        document.querySelectorAll('.section-checkbox').forEach(cb => {
            cb.addEventListener('change', e => {
                const sectionDiv = cb.closest('.collapsible-section');
                sectionDiv.querySelectorAll('.word-checkbox').forEach(wordCb => {
                    wordCb.checked = cb.checked;
                    wordCb.dispatchEvent(new Event('change'));
                });
            });
        });
    }

    // 全选/全不选
    selectAllWords() {
        document.querySelectorAll('.word-checkbox').forEach(cb => {
            cb.checked = true;
            cb.dispatchEvent(new Event('change'));
        });
    }
    deselectAllWords() {
        document.querySelectorAll('.word-checkbox').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change'));
        });
    }
    // 统计已选单词数
    updateSelectedCount() {
        const count = this.selectedWords.size;
        const countElement = document.getElementById('selectedWordCount');
        const guideCountElement = document.getElementById('selectedCountInGuide');
        const startBtn = document.getElementById('startTestBtn');
        const testInfo = document.getElementById('testInfo');
        
        if (countElement) countElement.textContent = count;
        if (guideCountElement) guideCountElement.textContent = count;
        
        // 更新开始测试按钮状态
        if (startBtn && testInfo) {
            if (count > 0) {
                startBtn.disabled = false;
                const totalRepeats = Array.from(this.selectedWords.values()).reduce((sum, word) => sum + (word.repeatCount || 1), 0);
                testInfo.innerHTML = `已选择 <strong>${count}</strong> 个单词，总练习次数 <strong>${totalRepeats}</strong> 次`;
            } else {
                startBtn.disabled = true;
                testInfo.textContent = '请先选择要练习的单词';
            }
        }
    }
    
    // 获取已选择的单词列表（用于测试）
    getSelectedWordsForTest() {
        const selectedList = [];
        for (const [wordId, info] of this.selectedWords) {
            const [lesson, section, kana, kanji] = wordId.split('|');
            const wordData = this.findWordData(lesson, section, kana, kanji);
            if (wordData) {
                // 不再重复添加，而是添加一次带有完整背诵次数的单词
                selectedList.push({
                    ...wordData,
                    lesson,
                    section,
                    repeatCount: info.repeatCount || 1 // 保存背诵次数
                });
            }
        }
        return selectedList; // 不打乱，让练习页面自己处理
    }
    
    // 查找单词数据
    findWordData(lesson, section, kana, kanji) {
        if (this.vocabData[lesson] && this.vocabData[lesson][section]) {
            return this.vocabData[lesson][section].find(word => 
                word.kana === kana && word.kanji === kanji
            );
        }
        return null;
    }
    
    // 打乱数组
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // 按错误次数排序
    sortByMistakes() {
        const allWords = [];
        
        // 收集所有单词和其错误次数
        for (const lesson in this.vocabData) {
            for (const section in this.vocabData[lesson]) {
                for (const word of this.vocabData[lesson][section]) {
                    const mistakeCount = window.mistakeTracker ? window.mistakeTracker.getMistakeCount(word) : 0;
                    allWords.push({
                        lesson,
                        section,
                        word,
                        mistakeCount
                    });
                }
            }
        }
        
        // 按错误次数降序排序
        allWords.sort((a, b) => b.mistakeCount - a.mistakeCount);
        
        // 重新组织数据结构
        this.vocabData = {};
        for (const item of allWords) {
            if (!this.vocabData[item.lesson]) this.vocabData[item.lesson] = {};
            if (!this.vocabData[item.lesson][item.section]) this.vocabData[item.lesson][item.section] = [];
            this.vocabData[item.lesson][item.section].push(item.word);
        }
        
        // 重新渲染
        this.renderCourseList();
        console.log('已按错误次数排序');
    }
    
    // 按课程排序（恢复原始顺序）
    async sortByLesson() {
        console.log('重新按课程顺序加载数据...');
        await this.loadAllVocabulary();
        this.renderCourseList();
        console.log('已恢复课程顺序');
    }
}

// 全选/全不选按钮绑定
window.selectAllWords = function() {
    if (window.wordTypingSelector) window.wordTypingSelector.selectAllWords();
};
window.deselectAllWords = function() {
    if (window.wordTypingSelector) window.wordTypingSelector.deselectAllWords();
};

// 排序功能
window.sortByMistakes = function() {
    if (window.wordTypingSelector) window.wordTypingSelector.sortByMistakes();
};
window.sortByLesson = function() {
    if (window.wordTypingSelector) window.wordTypingSelector.sortByLesson();
};

// 开始单词测试
window.startWordTest = function() {
    if (!window.wordTypingSelector) return;
    
    const selectedWords = window.wordTypingSelector.getSelectedWordsForTest();
    if (selectedWords.length === 0) {
        alert('请先选择要练习的单词！');
        return;
    }
    
    // 将选择的单词保存到sessionStorage
    sessionStorage.setItem('selectedWords', JSON.stringify(selectedWords));
    
    // 跳转到单词练习页面
    window.location.href = 'word-practice.html';
};

// 预览选择的单词
window.previewSelectedWords = function() {
    if (!window.wordTypingSelector) return;
    
    const selectedWords = window.wordTypingSelector.getSelectedWordsForTest();
    if (selectedWords.length === 0) {
        alert('请先选择要练习的单词！');
        return;
    }
    
    let preview = '📝 预览选择的单词：\n\n';
    const wordGroups = {};
    
    selectedWords.forEach(word => {
        const key = `${word.lesson}-${word.section}`;
        if (!wordGroups[key]) wordGroups[key] = [];
        wordGroups[key].push(word);
    });
    
    for (const [group, words] of Object.entries(wordGroups)) {
        preview += `${group}：\n`;
        words.forEach(word => {
            preview += `  • ${word.meaning} (${word.kana})\n`;
        });
        preview += '\n';
    }
    
    preview += `总计：${selectedWords.length} 个练习项目`;
    alert(preview);
};

// 返回顶部功能
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// 监听滚动，控制返回顶部按钮显示
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    window.wordTypingSelector = new WordTypingSelector();
});
