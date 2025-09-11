/**
 * 错题统计管理器
 * 记录单词错误次数、生成CSV文件、管理错题重做
 */

class MistakeTracker {
    constructor() {
        this.mistakes = new Map(); // wordId -> {count, dates: []}
        this.todaysMistakes = new Set(); // 今天的错题
        this.init();
    }

    init() {
        this.loadMistakeData();
        this.createMistakeCSV();
    }

    /**
     * 记录单词错误
     * @param {Object} word - 单词对象
     * @param {string} type - 错误类型 ('wrong', 'dont_know')
     */
    recordMistake(word, type = 'wrong') {
        const wordId = this.getWordId(word);
        const today = this.getTodayString();
        
        // 更新错误记录
        if (!this.mistakes.has(wordId)) {
            this.mistakes.set(wordId, {
                word: word,
                count: 0,
                dates: [],
                types: [] // 错误类型记录
            });
        }
        
        const mistakeData = this.mistakes.get(wordId);
        mistakeData.count++;
        mistakeData.types.push({
            type: type,
            date: today,
            timestamp: new Date().toISOString()
        });
        
        // 如果是今天的新错误，添加到今天的错题集合
        if (!mistakeData.dates.includes(today)) {
            mistakeData.dates.push(today);
        }
        
        this.todaysMistakes.add(wordId);
        
        // 保存数据
        this.saveMistakeData();
        this.updateMistakeCSV();
        
        console.log(`记录错误: ${word.kana || word.meaning} (${type}), 总错误次数: ${mistakeData.count}`);
    }

    /**
     * 获取单词ID
     */
    getWordId(word) {
        return `${word.lesson || '未知'}_${word.kana || word.meaning}_${word.meaning || ''}`;
    }

    /**
     * 获取今天的日期字符串
     */
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * 获取昨天的日期字符串
     */
    getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    /**
     * 加载错误数据
     */
    loadMistakeData() {
        try {
            const data = localStorage.getItem('wordMistakes');
            if (data) {
                const parsed = JSON.parse(data);
                this.mistakes = new Map(Object.entries(parsed));
            }
            
            // 加载今天的错题
            const todayData = localStorage.getItem('todaysMistakes');
            if (todayData) {
                this.todaysMistakes = new Set(JSON.parse(todayData));
            }
        } catch (error) {
            console.error('加载错误数据失败:', error);
            this.mistakes = new Map();
            this.todaysMistakes = new Set();
        }
    }

    /**
     * 保存错误数据
     */
    saveMistakeData() {
        try {
            // 转换Map为对象进行存储
            const mistakeObj = {};
            for (let [key, value] of this.mistakes) {
                mistakeObj[key] = value;
            }
            localStorage.setItem('wordMistakes', JSON.stringify(mistakeObj));
            
            // 保存今天的错题
            localStorage.setItem('todaysMistakes', JSON.stringify([...this.todaysMistakes]));
        } catch (error) {
            console.error('保存错误数据失败:', error);
        }
    }

    /**
     * 创建CSV文件
     */
    createMistakeCSV() {
        const csvHeaders = [
            '单词ID',
            '课程',
            '假名',
            '汉字',
            '释义',
            '词性',
            '错误次数',
            '最近错误日期',
            '错误类型记录'
        ];
        
        this.csvContent = csvHeaders.join(',') + '\n';
        this.updateMistakeCSV();
    }

    /**
     * 更新CSV文件内容
     */
    updateMistakeCSV() {
        const csvHeaders = [
            '单词ID',
            '课程',
            '假名',
            '汉字',
            '释义',
            '词性',
            '错误次数',
            '最近错误日期',
            '错误类型记录'
        ];
        
        let csvContent = csvHeaders.join(',') + '\n';
        
        // 按错误次数降序排序
        const sortedMistakes = Array.from(this.mistakes.entries()).sort((a, b) => b[1].count - a[1].count);
        
        for (let [wordId, data] of sortedMistakes) {
            const word = data.word;
            const typeRecord = data.types.map(t => `${t.type}:${t.date}`).join(';');
            const latestDate = data.dates[data.dates.length - 1] || '';
            
            const row = [
                this.escapeCSV(wordId),
                this.escapeCSV(word.lesson || ''),
                this.escapeCSV(word.kana || ''),
                this.escapeCSV(word.kanji || ''),
                this.escapeCSV(word.meaning || ''),
                this.escapeCSV(word.type || ''),
                data.count,
                latestDate,
                this.escapeCSV(typeRecord)
            ];
            
            csvContent += row.join(',') + '\n';
        }
        
        this.csvContent = csvContent;
    }

    /**
     * 转义CSV字段
     */
    escapeCSV(field) {
        if (typeof field !== 'string') {
            field = String(field);
        }
        if (field.includes(',') || field.includes('\n') || field.includes('"')) {
            return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
    }

    /**
     * 下载CSV文件
     */
    downloadMistakeCSV() {
        const blob = new Blob([this.csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const today = this.getTodayString();
        
        link.href = URL.createObjectURL(blob);
        link.download = `错题统计_${today}.csv`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('错题CSV文件下载完成');
    }

    /**
     * 获取错误次数最多的单词列表
     */
    getMostMistakenWords(limit = 50) {
        const sortedMistakes = Array.from(this.mistakes.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit);
        
        return sortedMistakes.map(([wordId, data]) => ({
            ...data.word,
            mistakeCount: data.count,
            mistakeDates: data.dates,
            wordId: wordId
        }));
    }

    /**
     * 获取指定日期的错题
     */
    getMistakesByDate(date) {
        const mistakes = [];
        
        for (let [wordId, data] of this.mistakes) {
            if (data.dates.includes(date)) {
                mistakes.push({
                    ...data.word,
                    mistakeCount: data.count,
                    mistakeDates: data.dates,
                    wordId: wordId
                });
            }
        }
        
        return mistakes.sort((a, b) => b.mistakeCount - a.mistakeCount);
    }

    /**
     * 获取昨天的错题
     */
    getYesterdaysMistakes() {
        return this.getMistakesByDate(this.getYesterdayString());
    }

    /**
     * 获取今天的错题
     */
    getTodaysMistakes() {
        return this.getMistakesByDate(this.getTodayString());
    }

    /**
     * 获取单词的错误次数
     */
    getMistakeCount(word) {
        const wordId = this.getWordId(word);
        const mistakeData = this.mistakes.get(wordId);
        return mistakeData ? mistakeData.count : 0;
    }

    /**
     * 清除指定日期之前的错题记录（数据清理）
     */
    clearOldMistakes(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const cutoffString = cutoffDate.toISOString().split('T')[0];
        
        let removedCount = 0;
        
        for (let [wordId, data] of this.mistakes) {
            // 过滤掉过老的日期
            data.dates = data.dates.filter(date => date >= cutoffString);
            data.types = data.types.filter(t => t.date >= cutoffString);
            
            // 如果没有近期错误记录，删除该单词
            if (data.dates.length === 0) {
                this.mistakes.delete(wordId);
                removedCount++;
            } else {
                // 重新计算错误次数
                data.count = data.types.length;
            }
        }
        
        this.saveMistakeData();
        this.updateMistakeCSV();
        
        console.log(`清理了 ${removedCount} 个过期错题记录`);
        return removedCount;
    }

    /**
     * 获取错题统计信息
     */
    getStatistics() {
        const totalMistakes = this.mistakes.size;
        const totalErrors = Array.from(this.mistakes.values()).reduce((sum, data) => sum + data.count, 0);
        const todayErrors = this.todaysMistakes.size;
        const yesterdayErrors = this.getYesterdaysMistakes().length;
        
        return {
            totalMistakes,
            totalErrors,
            todayErrors,
            yesterdayErrors,
            avgErrorsPerWord: totalMistakes > 0 ? (totalErrors / totalMistakes).toFixed(2) : 0
        };
    }
}

// 全局错题跟踪器实例
window.mistakeTracker = new MistakeTracker();

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MistakeTracker;
}
