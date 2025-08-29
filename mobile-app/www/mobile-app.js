// 移动端假名背诵王 - JavaScript逻辑
class MobileKanaApp {
    constructor() {
        this.selectedKana = new Set();
        this.gameKanaList = [];
        this.currentIndex = 0;
        this.currentRepeat = 1;
        this.maxRepeat = 3;
        this.isGameActive = false;
        
        // 初始化
        this.initializeApp();
    }

    initializeApp() {
        // 初始化假名选择网格
        this.initializeKanaGrids();
        
        // 添加触摸事件监听
        this.addTouchEventListeners();
        
        // 页面加载完成后的设置
        document.addEventListener('DOMContentLoaded', () => {
            this.updateTotalSelected();
            this.checkStartButtonState();
        });
    }

    // 初始化假名网格
    initializeKanaGrids() {
        Object.keys(kanaData).forEach(category => {
            const grid = document.getElementById(`${category}-grid`);
            if (!grid) return;

            const kanaList = kanaData[category];
            grid.innerHTML = '';

            kanaList.forEach((item, index) => {
                const kanaElement = document.createElement('div');
                kanaElement.className = 'kana-item selected';
                kanaElement.dataset.category = category;
                kanaElement.dataset.index = index;
                
                kanaElement.innerHTML = `
                    <div class="kana">${item.kana}</div>
                    <div class="romaji">${item.romaji}</div>
                `;
                
                // 触摸事件
                kanaElement.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.toggleKana(category, index, kanaElement);
                });
                
                // 点击事件（兼容桌面）
                kanaElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleKana(category, index, kanaElement);
                });

                grid.appendChild(kanaElement);
                
                // 默认全部选中
                this.selectedKana.add(`${category}-${index}`);
            });
        });
    }

    // 切换假名选择状态
    toggleKana(category, index, element) {
        const key = `${category}-${index}`;
        
        if (this.selectedKana.has(key)) {
            this.selectedKana.delete(key);
            element.classList.remove('selected');
        } else {
            this.selectedKana.add(key);
            element.classList.add('selected');
        }
        
        this.updateCategoryCount(category);
        this.updateTotalSelected();
        this.checkStartButtonState();
    }

    // 更新类别计数
    updateCategoryCount(category) {
        const totalCount = kanaData[category].length;
        let selectedCount = 0;
        
        for (let i = 0; i < totalCount; i++) {
            if (this.selectedKana.has(`${category}-${i}`)) {
                selectedCount++;
            }
        }
        
        const countElement = document.getElementById(`${category}-count`);
        if (countElement) {
            countElement.textContent = `${selectedCount}/${totalCount}`;
        }
    }

    // 更新总选择数
    updateTotalSelected() {
        const totalElement = document.getElementById('totalSelected');
        if (totalElement) {
            totalElement.textContent = this.selectedKana.size;
        }
    }

    // 检查开始按钮状态
    checkStartButtonState() {
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.disabled = this.selectedKana.size === 0;
        }
    }

    // 添加触摸事件监听
    addTouchEventListeners() {
        // 防止页面滚动时的意外操作
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.kana-item')) {
                e.preventDefault();
            }
        }, { passive: false });

        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // 开始游戏
    startGame() {
        // 获取重复次数
        const repeatSelect = document.getElementById('repeatCount');
        this.maxRepeat = parseInt(repeatSelect.value);
        
        // 构建游戏假名列表
        this.buildGameKanaList();
        
        if (this.gameKanaList.length === 0) {
            alert('请至少选择一个假名！');
            return;
        }
        
        // 重置游戏状态
        this.currentIndex = 0;
        this.currentRepeat = 1;
        this.isGameActive = true;
        
        // 切换到游戏界面
        this.showGameScreen();
        
        // 显示第一个假名
        this.displayCurrentKana();
    }

    // 构建游戏假名列表
    buildGameKanaList() {
        this.gameKanaList = [];
        
        this.selectedKana.forEach(key => {
            const [category, index] = key.split('-');
            const kana = kanaData[category][parseInt(index)];
            this.gameKanaList.push({
                ...kana,
                category: category
            });
        });
        
        // 随机打乱顺序
        this.shuffleArray(this.gameKanaList);
    }

    // 数组随机打乱
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 显示游戏界面
    showGameScreen() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'flex';
        document.getElementById('completeScreen').style.display = 'none';
        
        // 更新进度信息
        document.getElementById('maxRepeat').textContent = this.maxRepeat;
    }

    // 显示完成界面
    showCompleteScreen() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('completeScreen').style.display = 'flex';
        
        // 更新完成统计
        document.getElementById('completedCount').textContent = this.gameKanaList.length;
        document.getElementById('completedRepeats').textContent = this.maxRepeat;
    }

    // 返回主菜单
    backToMenu() {
        this.isGameActive = false;
        document.getElementById('mainMenu').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('completeScreen').style.display = 'none';
    }

    // 显示当前假名
    displayCurrentKana() {
        if (this.currentIndex >= this.gameKanaList.length) {
            if (this.currentRepeat < this.maxRepeat) {
                // 进入下一轮重复
                this.currentRepeat++;
                this.currentIndex = 0;
                this.shuffleArray(this.gameKanaList);
            } else {
                // 完成所有重复
                this.showCompleteScreen();
                return;
            }
        }
        
        const currentKana = this.gameKanaList[this.currentIndex];
        
        // 更新显示
        document.getElementById('currentKana').textContent = currentKana.kana;
        document.getElementById('currentRomaji').textContent = currentKana.romaji;
        
        // 更新进度信息
        document.getElementById('currentProgress').textContent = 
            `${this.currentIndex + 1} / ${this.gameKanaList.length}`;
        document.getElementById('currentRepeat').textContent = this.currentRepeat;
        
        // 更新进度条
        const totalProgress = ((this.currentRepeat - 1) * this.gameKanaList.length + this.currentIndex) / 
                             (this.maxRepeat * this.gameKanaList.length) * 100;
        document.getElementById('progressFill').style.width = `${totalProgress}%`;
    }

    // 下一个假名
    nextKana() {
        if (!this.isGameActive) return;
        
        this.currentIndex++;
        this.displayCurrentKana();
    }
}

// 全局函数（供HTML调用）
let app;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new MobileKanaApp();
});

// 折叠/展开类别
function toggleSection(category) {
    const grid = document.getElementById(`${category}-grid`);
    const icon = document.getElementById(`${category}-icon`);
    
    if (grid.style.display === 'none') {
        grid.style.display = 'grid';
        icon.textContent = '▼';
    } else {
        grid.style.display = 'none';
        icon.textContent = '▶';
    }
}

// 开始游戏
function startGame() {
    if (app) {
        app.startGame();
    }
}

// 下一个假名
function nextKana() {
    if (app) {
        app.nextKana();
    }
}

// 返回菜单
function backToMenu() {
    if (app) {
        app.backToMenu();
    }
}

// 处理设备返回按钮（Android）
document.addEventListener('deviceready', () => {
    document.addEventListener('backbutton', (e) => {
        e.preventDefault();
        
        // 如果在游戏界面，返回主菜单
        if (document.getElementById('gameScreen').style.display !== 'none' || 
            document.getElementById('completeScreen').style.display !== 'none') {
            backToMenu();
        } else {
            // 在主菜单，退出应用
            navigator.app.exitApp();
        }
    }, false);
}, false);

// PWA安装提示
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 可以在这里显示安装提示
    console.log('PWA安装提示可用');
});

// 处理键盘事件（测试用）
document.addEventListener('keydown', (e) => {
    if (document.getElementById('gameScreen').style.display !== 'none') {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            nextKana();
        }
    }
});
