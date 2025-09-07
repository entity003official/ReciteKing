// 单词个性化背诵管理器
class WordTypingSelector {
    constructor() {
        this.vocabData = {};
        this.selectedWords = new Map(); // key: wordId, value: { ...word, repeatCount }
        this.init();
    }

    async init() {
        await this.loadAllVocabulary();
        this.renderCourseList();
        this.updateSelectedCount();
    }

    // 加载所有课程的单词，按课程/栏目/单词三级分组
    async loadAllVocabulary() {
        if (!window.vocabularyManager) {
            await new Promise(resolve => {
                const check = () => {
                    if (window.vocabularyManager) resolve();
                    else setTimeout(check, 100);
                };
                check();
            });
        }
        // 获取所有课程名
        let lessons = [];
        try {
            lessons = await window.vocabularyManager.getAllLessonNames();
        } catch (e) {
            lessons = [];
        }
        this.vocabData = {};
        let hasData = false;
        for (const lesson of lessons) {
            let words = [];
            try {
                words = await window.vocabularyManager.loadLessonVocabulary(lesson);
            } catch (e) {
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
                    wordItem.innerHTML = `
                        <input type="checkbox" class="word-checkbox" data-word-id="${wordId}">
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
        document.getElementById('selectedWordCount').textContent = count;
    }
}

// 全选/全不选按钮绑定
window.selectAllWords = function() {
    if (window.wordTypingSelector) window.wordTypingSelector.selectAllWords();
};
window.deselectAllWords = function() {
    if (window.wordTypingSelector) window.wordTypingSelector.deselectAllWords();
};

document.addEventListener('DOMContentLoaded', () => {
    window.wordTypingSelector = new WordTypingSelector();
});
