/**
 * 性能监控模块
 * 用于监控内存使用、性能指标和复杂度分析
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            memory: {
                initial: 0,
                current: 0,
                peak: 0,
                history: []
            },
            performance: {
                loadTime: 0,
                renderTime: 0,
                operationTimes: new Map(),
                frameRates: []
            },
            complexity: {
                domNodes: 0,
                eventListeners: 0,
                dataSize: 0,
                algorithmComplexity: new Map()
            }
        };
        
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.startTime = performance.now();
        
        this.init();
    }
    
    init() {
        // 记录初始内存使用
        this.recordInitialMemory();
        
        // 开始监控
        this.startMonitoring();
        
        // 添加页面卸载时的清理
        window.addEventListener('beforeunload', () => {
            this.stopMonitoring();
        });
        
        // 监控DOM变化
        this.observeDOM();
        
        console.log('🔍 性能监控模块已启动');
    }
    
    recordInitialMemory() {
        if (performance.memory) {
            this.metrics.memory.initial = performance.memory.usedJSHeapSize;
            this.metrics.memory.current = performance.memory.usedJSHeapSize;
            this.metrics.memory.peak = performance.memory.usedJSHeapSize;
        }
    }
    
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
        }, 1000); // 每秒收集一次数据
        
        // 监控帧率
        this.monitorFrameRate();
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
    
    collectMetrics() {
        // 内存监控
        if (performance.memory) {
            const current = performance.memory.usedJSHeapSize;
            this.metrics.memory.current = current;
            this.metrics.memory.peak = Math.max(this.metrics.memory.peak, current);
            
            // 保留最近30个数据点
            this.metrics.memory.history.push({
                timestamp: Date.now(),
                used: current,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            });
            
            if (this.metrics.memory.history.length > 30) {
                this.metrics.memory.history.shift();
            }
        }
        
        // DOM复杂度
        this.metrics.complexity.domNodes = document.querySelectorAll('*').length;
        
        // 数据大小评估
        this.estimateDataSize();
        
        // 检查内存泄漏风险
        this.checkMemoryLeakRisk();
    }
    
    estimateDataSize() {
        let totalSize = 0;
        
        // 估算sessionStorage大小
        try {
            const sessionData = sessionStorage.getItem('selectedWords');
            if (sessionData) {
                totalSize += new Blob([sessionData]).size;
            }
        } catch (e) {
            console.warn('无法估算sessionStorage大小:', e);
        }
        
        // 估算全局变量大小
        if (window.practice && window.practice.words) {
            totalSize += JSON.stringify(window.practice.words).length;
        }
        
        this.metrics.complexity.dataSize = totalSize;
    }
    
    checkMemoryLeakRisk() {
        const history = this.metrics.memory.history;
        if (history.length < 10) return;
        
        // 检查内存是否持续增长
        const recent = history.slice(-5);
        const older = history.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, item) => sum + item.used, 0) / recent.length;
        const olderAvg = older.reduce((sum, item) => sum + item.used, 0) / older.length;
        
        const growthRate = (recentAvg - olderAvg) / olderAvg;
        
        if (growthRate > 0.1) { // 10%以上增长
            console.warn('⚠️ 检测到可能的内存泄漏，增长率:', (growthRate * 100).toFixed(2) + '%');
        }
    }
    
    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFrame = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.metrics.performance.frameRates.push(fps);
                
                // 保留最近30秒的帧率数据
                if (this.metrics.performance.frameRates.length > 30) {
                    this.metrics.performance.frameRates.shift();
                }
                
                if (fps < 30) {
                    console.warn('⚠️ 帧率过低:', fps + 'fps');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(measureFrame);
            }
        };
        
        requestAnimationFrame(measureFrame);
    }
    
    observeDOM() {
        if (!window.MutationObserver) return;
        
        const observer = new MutationObserver((mutations) => {
            let complexityScore = 0;
            
            mutations.forEach((mutation) => {
                // 计算DOM变化的复杂度
                if (mutation.type === 'childList') {
                    complexityScore += mutation.addedNodes.length * 2;
                    complexityScore += mutation.removedNodes.length;
                } else if (mutation.type === 'attributes') {
                    complexityScore += 1;
                }
            });
            
            if (complexityScore > 50) {
                console.warn('⚠️ 检测到大量DOM变化，复杂度分数:', complexityScore);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });
    }
    
    // 测量函数执行时间
    measureOperation(name, operation) {
        const startTime = performance.now();
        
        try {
            const result = operation();
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // 记录操作时间
            if (!this.metrics.performance.operationTimes.has(name)) {
                this.metrics.performance.operationTimes.set(name, []);
            }
            
            const times = this.metrics.performance.operationTimes.get(name);
            times.push(duration);
            
            // 保留最近20次记录
            if (times.length > 20) {
                times.shift();
            }
            
            // 警告慢操作
            if (duration > 100) {
                console.warn(`⚠️ 操作 "${name}" 耗时过长:`, duration.toFixed(2) + 'ms');
            }
            
            return result;
        } catch (error) {
            console.error(`操作 "${name}" 执行失败:`, error);
            throw error;
        }
    }
    
    // 分析算法复杂度
    analyzeComplexity(name, inputSize, operation) {
        const times = [];
        const sizes = [];
        
        // 测试不同输入大小
        for (let size = 1; size <= inputSize; size *= 2) {
            const startTime = performance.now();
            operation(size);
            const endTime = performance.now();
            
            times.push(endTime - startTime);
            sizes.push(size);
        }
        
        // 简单的复杂度分析
        let complexity = 'O(1)';
        if (times.length >= 3) {
            const ratio1 = times[1] / times[0];
            const ratio2 = times[2] / times[1];
            
            if (ratio2 > ratio1 * 1.5) {
                complexity = 'O(n²) 或更高';
            } else if (ratio1 > 1.5) {
                complexity = 'O(n) 或 O(n log n)';
            }
        }
        
        this.metrics.complexity.algorithmComplexity.set(name, {
            complexity,
            times,
            sizes,
            averageTime: times.reduce((a, b) => a + b, 0) / times.length
        });
        
        console.log(`算法复杂度分析 "${name}":`, complexity);
    }
    
    // 生成性能报告
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            runtime: (performance.now() - this.startTime) / 1000,
            memory: this.getMemoryReport(),
            performance: this.getPerformanceReport(),
            complexity: this.getComplexityReport(),
            recommendations: this.getRecommendations()
        };
        
        return report;
    }
    
    getMemoryReport() {
        const memory = this.metrics.memory;
        return {
            current: this.formatBytes(memory.current),
            peak: this.formatBytes(memory.peak),
            growth: this.formatBytes(memory.current - memory.initial),
            efficiency: memory.current > 0 ? (memory.initial / memory.current * 100).toFixed(1) + '%' : '100%'
        };
    }
    
    getPerformanceReport() {
        const fps = this.metrics.performance.frameRates;
        const operations = this.metrics.performance.operationTimes;
        
        return {
            averageFPS: fps.length > 0 ? Math.round(fps.reduce((a, b) => a + b, 0) / fps.length) : 0,
            minFPS: fps.length > 0 ? Math.min(...fps) : 0,
            slowOperations: this.getSlowOperations(operations),
            operationCount: operations.size
        };
    }
    
    getComplexityReport() {
        return {
            domNodes: this.metrics.complexity.domNodes,
            dataSize: this.formatBytes(this.metrics.complexity.dataSize),
            algorithms: Object.fromEntries(this.metrics.complexity.algorithmComplexity),
            complexityScore: this.calculateComplexityScore()
        };
    }
    
    getSlowOperations(operations) {
        const slow = [];
        operations.forEach((times, name) => {
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            if (avgTime > 50) {
                slow.push({ name, avgTime: avgTime.toFixed(2) + 'ms' });
            }
        });
        return slow;
    }
    
    calculateComplexityScore() {
        let score = 0;
        
        // DOM节点数影响
        score += Math.min(this.metrics.complexity.domNodes / 10, 50);
        
        // 数据大小影响
        score += Math.min(this.metrics.complexity.dataSize / 1024, 30);
        
        // 算法复杂度影响
        this.metrics.complexity.algorithmComplexity.forEach((analysis) => {
            if (analysis.complexity.includes('O(n²)')) {
                score += 20;
            } else if (analysis.complexity.includes('O(n)')) {
                score += 10;
            }
        });
        
        return Math.min(score, 100);
    }
    
    getRecommendations() {
        const recommendations = [];
        
        // 内存建议
        if (this.metrics.memory.current > this.metrics.memory.initial * 2) {
            recommendations.push({
                type: 'memory',
                level: 'warning',
                message: '内存使用量是初始值的2倍以上',
                suggestion: '考虑清理不必要的数据结构，或实现数据的懒加载'
            });
        }
        
        // 性能建议
        const avgFPS = this.metrics.performance.frameRates.reduce((a, b) => a + b, 0) / this.metrics.performance.frameRates.length;
        if (avgFPS < 30 && avgFPS > 0) {
            recommendations.push({
                type: 'performance',
                level: 'critical',
                message: `帧率过低 (${avgFPS.toFixed(1)}fps)`,
                suggestion: '减少DOM操作频率，使用requestAnimationFrame优化动画'
            });
        }
        
        // DOM建议
        if (this.metrics.complexity.domNodes > 1000) {
            recommendations.push({
                type: 'dom',
                level: 'warning',
                message: `DOM节点过多 (${this.metrics.complexity.domNodes}个)`,
                suggestion: '考虑使用虚拟滚动、分页或懒加载减少DOM节点数量'
            });
        }
        
        // 数据大小建议
        if (this.metrics.complexity.dataSize > 1024 * 1024) { // 1MB
            recommendations.push({
                type: 'data',
                level: 'warning',
                message: `数据量较大 (${this.formatBytes(this.metrics.complexity.dataSize)})`,
                suggestion: '考虑数据分页、压缩或使用IndexedDB存储大量数据'
            });
        }
        
        // 算法建议
        this.metrics.complexity.algorithmComplexity.forEach((analysis, name) => {
            if (analysis.complexity.includes('O(n²)')) {
                recommendations.push({
                    type: 'algorithm',
                    level: 'critical',
                    message: `算法 "${name}" 复杂度过高 (${analysis.complexity})`,
                    suggestion: '优化算法逻辑，考虑使用更高效的数据结构或算法'
                });
            } else if (analysis.averageTime > 100) {
                recommendations.push({
                    type: 'algorithm',
                    level: 'warning',
                    message: `算法 "${name}" 执行时间过长 (${analysis.averageTime.toFixed(2)}ms)`,
                    suggestion: '优化算法实现，减少不必要的计算'
                });
            }
        });
        
        // 慢操作建议
        this.metrics.performance.operationTimes.forEach((times, name) => {
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            if (avgTime > 100) {
                recommendations.push({
                    type: 'operation',
                    level: 'warning',
                    message: `操作 "${name}" 平均耗时 ${avgTime.toFixed(2)}ms`,
                    suggestion: '分析操作流程，考虑异步处理或缓存机制'
                });
            }
        });
        
        // 内存泄漏建议
        const history = this.metrics.memory.history;
        if (history.length >= 10) {
            const recent = history.slice(-5);
            const older = history.slice(-10, -5);
            const recentAvg = recent.reduce((sum, item) => sum + item.used, 0) / recent.length;
            const olderAvg = older.reduce((sum, item) => sum + item.used, 0) / older.length;
            const growthRate = (recentAvg - olderAvg) / olderAvg;
            
            if (growthRate > 0.1) {
                recommendations.push({
                    type: 'memory-leak',
                    level: 'critical',
                    message: `可能存在内存泄漏，增长率 ${(growthRate * 100).toFixed(1)}%`,
                    suggestion: '检查事件监听器是否正确移除，避免闭包引用，清理不再使用的对象'
                });
            }
        }
        
        return recommendations;
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 显示实时监控面板
    showMonitorPanel() {
        this.createMonitorPanel();
        this.updateMonitorPanel();
        
        // 每2秒更新一次面板
        setInterval(() => {
            if (document.getElementById('performance-monitor-panel')) {
                this.updateMonitorPanel();
            }
        }, 2000);
    }
    
    createMonitorPanel() {
        if (document.getElementById('performance-monitor-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'performance-monitor-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>🔍 性能监控</strong>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">✕</button>
            </div>
            <div id="monitor-content"></div>
        `;
        
        document.body.appendChild(panel);
    }
    
    updateMonitorPanel() {
        const content = document.getElementById('monitor-content');
        if (!content) return;
        
        const memory = this.metrics.memory;
        const fps = this.metrics.performance.frameRates;
        const avgFPS = fps.length > 0 ? Math.round(fps.reduce((a, b) => a + b, 0) / fps.length) : 0;
        const complexityScore = this.calculateComplexityScore();
        const recommendations = this.getRecommendations();
        
        // 获取最慢的操作
        const slowOps = this.getSlowOperations(this.metrics.performance.operationTimes);
        
        content.innerHTML = `
            <div><strong>📊 内存使用:</strong></div>
            <div style="margin-left: 10px;">
                <div>当前: ${this.formatBytes(memory.current)}</div>
                <div>峰值: ${this.formatBytes(memory.peak)}</div>
                <div>增长: ${this.formatBytes(memory.current - memory.initial)}</div>
            </div>
            <br>
            <div><strong>🎮 性能指标:</strong></div>
            <div style="margin-left: 10px;">
                <div>平均FPS: ${avgFPS} ${avgFPS < 30 ? '⚠️' : '✅'}</div>
                <div>DOM节点: ${this.metrics.complexity.domNodes}</div>
                <div>数据大小: ${this.formatBytes(this.metrics.complexity.dataSize)}</div>
            </div>
            <br>
            <div><strong>🔍 复杂度分析:</strong></div>
            <div style="margin-left: 10px;">
                <div>总分: ${complexityScore.toFixed(1)}/100 ${this.getComplexityLevel(complexityScore)}</div>
                <div>算法: ${this.metrics.complexity.algorithmComplexity.size}个</div>
                <div>慢操作: ${slowOps.length}个</div>
            </div>
            ${recommendations.length > 0 ? `
            <br>
            <div><strong>💡 优化建议:</strong></div>
            <div style="margin-left: 10px; font-size: 10px;">
                ${recommendations.slice(0, 3).map(rec => 
                    `<div style="color: ${rec.level === 'critical' ? '#ff4444' : '#ffaa00'};">
                        ${rec.level === 'critical' ? '🔴' : '🟡'} ${rec.message}
                    </div>`
                ).join('')}
                ${recommendations.length > 3 ? `<div style="color: #888;">...还有${recommendations.length - 3}条建议</div>` : ''}
            </div>
            ` : ''}
            <br>
            <div style="text-align: center;">
                <button onclick="getPerformanceReport()" style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 10px;">详细报告</button>
                <button onclick="exportPerformanceData()" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 10px; margin-left: 5px;">导出数据</button>
            </div>
        `;
    }
    
    getComplexityLevel(score) {
        if (score < 30) return '🟢 良好';
        if (score < 60) return '🟡 一般';
        if (score < 80) return '🟠 需优化';
        return '🔴 严重';
    }
    
    // 导出性能数据
    exportData() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('性能报告已导出');
    }
}

// 全局监控实例
window.performanceMonitor = new PerformanceMonitor();

// 控制台命令
window.showPerformancePanel = () => window.performanceMonitor.showMonitorPanel();
window.getPerformanceReport = () => {
    console.log('📊 性能报告:', window.performanceMonitor.generateReport());
};
window.exportPerformanceData = () => window.performanceMonitor.exportData();

console.log(`
🔍 性能监控模块加载完成！

可用命令：
- showPerformancePanel() - 显示实时监控面板
- getPerformanceReport() - 获取性能报告
- exportPerformanceData() - 导出性能数据

监控功能：
✓ 内存使用监控
✓ 帧率监控
✓ DOM复杂度分析
✓ 算法复杂度分析
✓ 内存泄漏检测
✓ 性能建议
`);
