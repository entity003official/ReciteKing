// 游戏状态
let gameState = {
    kanaMap: {},
    scoreMap: {},
    currentKana: null,
    currentOptions: [],
    targetScore: 2,
    totalKanas: 0,
    completedKanas: 0,
    isAnswered: false
};

// DOM元素
const settingsPanel = document.getElementById('settingsPanel');
const gamePanel = document.getElementById('gamePanel');
const completePanel = document.getElementById('completePanel');
const kanaDisplay = document.getElementById('kanaDisplay');
const optionsContainer = document.getElementById('optionsContainer');
const resultMessage = document.getElementById('resultMessage');
const nextBtn = document.getElementById('nextBtn');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');
const progressFill = document.getElementById('progressFill');

// 显示设置面板
function showSettings() {
    settingsPanel.classList.remove('hidden');
    gamePanel.classList.add('hidden');
    completePanel.classList.add('hidden');
}

// 开始游戏
function startGame() {
    // 获取选中的类型
    const enabledTypes = [];
    const checkboxes = settingsPanel.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            enabledTypes.push(checkbox.id);
        }
    });

    if (enabledTypes.length === 0) {
        alert('请至少选择一种练习类型');
        return;
    }

    // 构建假名映射
    gameState.kanaMap = {};
    enabledTypes.forEach(type => {
        if (kanaData[type]) {
            Object.assign(gameState.kanaMap, kanaData[type]);
        }
    });

    // 初始化游戏状态
    gameState.scoreMap = {};
    Object.keys(gameState.kanaMap).forEach(kana => {
        gameState.scoreMap[kana] = 0;
    });

    gameState.totalKanas = Object.keys(gameState.kanaMap).length;
    gameState.completedKanas = 0;
    
    // 显示游戏面板
    settingsPanel.classList.add('hidden');
    gamePanel.classList.remove('hidden');
    completePanel.classList.add('hidden');

    // 开始第一题
    nextQuestion();
}

// 下一题
function nextQuestion() {
    // 检查是否完成所有假名
    const remainingKanas = Object.keys(gameState.scoreMap);
    if (remainingKanas.length === 0) {
        showComplete();
        return;
    }

    // 随机选择一个假名
    const randomIndex = Math.floor(Math.random() * remainingKanas.length);
    gameState.currentKana = remainingKanas[randomIndex];
    const correctRomaji = gameState.kanaMap[gameState.currentKana];

    // 生成选项
    gameState.currentOptions = generateOptions(correctRomaji);
    
    // 显示题目
    kanaDisplay.textContent = gameState.currentKana;
    displayOptions(gameState.currentOptions);
    
    // 隐藏结果信息和下一题按钮
    resultMessage.classList.add('hidden');
    nextBtn.classList.add('hidden');
    gameState.isAnswered = false;

    // 更新进度
    updateProgress();
}

// 生成选项
function generateOptions(correctRomaji) {
    const options = [correctRomaji];
    const allRomaji = Object.values(gameState.kanaMap).filter(romaji => romaji !== correctRomaji);
    
    // 随机选择3个干扰项
    const shuffled = allRomaji.sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
        options.push(shuffled[i]);
    }
    
    // 打乱选项
    return options.sort(() => 0.5 - Math.random());
}

// 显示选项
function displayOptions(options) {
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectOption(option, button);
        optionsContainer.appendChild(button);
    });
}

// 选择选项
function selectOption(selectedOption, buttonElement) {
    if (gameState.isAnswered) return;
    
    const correctRomaji = gameState.kanaMap[gameState.currentKana];
    const isCorrect = selectedOption === correctRomaji;
    
    // 标记所有按钮
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctRomaji) {
            btn.classList.add('correct');
        } else if (btn === buttonElement && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // 更新分数
    if (isCorrect) {
        gameState.scoreMap[gameState.currentKana]++;
        showResult('正确！', 'success');
    } else {
        gameState.scoreMap[gameState.currentKana] = Math.max(0, gameState.scoreMap[gameState.currentKana] - 1);
        showResult(`错误！正确答案是：${correctRomaji}`, 'error');
    }
    
    // 检查是否达标
    if (gameState.scoreMap[gameState.currentKana] >= gameState.targetScore) {
        delete gameState.scoreMap[gameState.currentKana];
        gameState.completedKanas++;
        setTimeout(() => {
            showResult(`🎉 [${gameState.currentKana}] 达标，不再出现！`, 'success');
        }, 1000);
    }
    
    gameState.isAnswered = true;
    nextBtn.classList.remove('hidden');
}

// 显示结果
function showResult(message, type) {
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${type}`;
    resultMessage.classList.remove('hidden');
}

// 更新进度
function updateProgress() {
    completedCount.textContent = gameState.completedKanas;
    totalCount.textContent = gameState.totalKanas;
    
    const progress = (gameState.completedKanas / gameState.totalKanas) * 100;
    progressFill.style.width = progress + '%';
}

// 显示完成页面
function showComplete() {
    gamePanel.classList.add('hidden');
    completePanel.classList.remove('hidden');
}

// 触摸设备优化
if ('ontouchstart' in window) {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';
}

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// PWA支持检测
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // 这里可以注册Service Worker来支持离线使用
        console.log('PWA支持已启用');
    });
}
