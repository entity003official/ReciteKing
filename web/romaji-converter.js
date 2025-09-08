// 罗马音转假名转换器
class RomajiConverter {
    constructor() {
        // 转换映射表
        this.hiraganaMap = {
            // 基本假名
            'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
            'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
            'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
            'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
            'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
            'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
            'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
            'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
            'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
            'wa': 'わ', 'wi': 'ゐ', 'we': 'ゑ', 'wo': 'を', 'n': 'ん',
            
            // 浊音
            'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
            'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
            'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
            'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
            
            // 半浊音
            'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
            
            // 拗音
            'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
            'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
            'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
            'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
            'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
            'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
            'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
            'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
            'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
            'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
            'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
            
            // 特殊组合
            'tya': 'ちゃ', 'tyu': 'ちゅ', 'tyo': 'ちょ',
            'dya': 'ぢゃ', 'dyu': 'ぢゅ', 'dyo': 'ぢょ'
        };
        
        this.katakanaMap = {
            // 基本假名
            'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
            'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
            'sa': 'サ', 'shi': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
            'ta': 'タ', 'chi': 'チ', 'tsu': 'ツ', 'te': 'テ', 'to': 'ト',
            'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
            'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
            'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
            'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
            'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
            'wa': 'ワ', 'wi': 'ヰ', 'we': 'ヱ', 'wo': 'ヲ', 'n': 'ン',
            
            // 浊音
            'ga': 'ガ', 'gi': 'ギ', 'gu': 'グ', 'ge': 'ゲ', 'go': 'ゴ',
            'za': 'ザ', 'ji': 'ジ', 'zu': 'ズ', 'ze': 'ゼ', 'zo': 'ゾ',
            'da': 'ダ', 'di': 'ヂ', 'du': 'ヅ', 'de': 'デ', 'do': 'ド',
            'ba': 'バ', 'bi': 'ビ', 'bu': 'ブ', 'be': 'ベ', 'bo': 'ボ',
            
            // 半浊音
            'pa': 'パ', 'pi': 'ピ', 'pu': 'プ', 'pe': 'ペ', 'po': 'ポ',
            
            // 拗音
            'kya': 'キャ', 'kyu': 'キュ', 'kyo': 'キョ',
            'sha': 'シャ', 'shu': 'シュ', 'sho': 'ショ',
            'cha': 'チャ', 'chu': 'チュ', 'cho': 'チョ',
            'nya': 'ニャ', 'nyu': 'ニュ', 'nyo': 'ニョ',
            'hya': 'ヒャ', 'hyu': 'ヒュ', 'hyo': 'ヒョ',
            'mya': 'ミャ', 'myu': 'ミュ', 'myo': 'ミョ',
            'rya': 'リャ', 'ryu': 'リュ', 'ryo': 'リョ',
            'gya': 'ギャ', 'gyu': 'ギュ', 'gyo': 'ギョ',
            'ja': 'ジャ', 'ju': 'ジュ', 'jo': 'ジョ',
            'bya': 'ビャ', 'byu': 'ビュ', 'byo': 'ビョ',
            'pya': 'ピャ', 'pyu': 'ピュ', 'pyo': 'ピョ',
            
            // 特殊组合
            'tya': 'チャ', 'tyu': 'チュ', 'tyo': 'チョ',
            'dya': 'ヂャ', 'dyu': 'ヂュ', 'dyo': 'ヂョ'
        };
        
        // 促音处理规则 - 可以双写形成促音的辅音
        this.sokuonRules = ['k', 't', 's', 'p', 'c', 'g', 'z', 'd', 'b', 'j', 'f', 'h', 'm', 'n', 'r', 'w', 'y'];
        
        this.currentInput = '';
        this.currentKanaType = 'hiragana'; // hiragana 或 katakana
    }
    
    // 转换罗马音为假名
    convert(romaji, kanaType = 'hiragana') {
        const map = kanaType === 'hiragana' ? this.hiraganaMap : this.katakanaMap;
        let result = '';
        let i = 0;
        
        while (i < romaji.length) {
            let found = false;
            
            // 促音处理
            if (i < romaji.length - 1 && 
                this.sokuonRules.includes(romaji[i]) && 
                romaji[i] === romaji[i + 1]) {
                result += kanaType === 'hiragana' ? 'っ' : 'ッ';
                i++;
                continue;
            }
            
            // 尝试匹配长的组合（3字符）
            if (i <= romaji.length - 3) {
                const three = romaji.substr(i, 3);
                if (map[three]) {
                    result += map[three];
                    i += 3;
                    found = true;
                }
            }
            
            // 尝试匹配中等组合（2字符）
            if (!found && i <= romaji.length - 2) {
                const two = romaji.substr(i, 2);
                if (map[two]) {
                    result += map[two];
                    i += 2;
                    found = true;
                }
            }
            
            // 尝试匹配单字符
            if (!found) {
                const one = romaji.substr(i, 1);
                if (map[one]) {
                    result += map[one];
                    i += 1;
                    found = true;
                }
            }
            
            // 如果都没匹配到，跳过这个字符
            if (!found) {
                i++;
            }
        }
        
        return result;
    }
    
    // 获取可能的假名选择（增强版，支持促音）
    getPossibleKana(romaji, kanaType = 'hiragana') {
        const map = kanaType === 'hiragana' ? this.hiraganaMap : this.katakanaMap;
        const possibilities = [];
        
        console.log('getPossibleKana 被调用，romaji:', romaji, 'kanaType:', kanaType);
        
        // 检查促音的情况
        if (romaji.length >= 2) {
            // 检查是否是双写辅音（促音）
            const lastChar = romaji[romaji.length - 1];
            const secondLastChar = romaji.length > 1 ? romaji[romaji.length - 2] : '';
            
            console.log('检查促音：lastChar=', lastChar, 'secondLastChar=', secondLastChar);
            
            // 如果输入了双辅音，提供促音选项
            if (this.sokuonRules.includes(lastChar) && lastChar === secondLastChar) {
                const sokuon = kanaType === 'hiragana' ? 'っ' : 'ッ';
                console.log('发现促音模式，添加促音:', sokuon);
                possibilities.push({
                    romaji: romaji,
                    kana: sokuon,
                    type: kanaType,
                    isSokuon: true
                });
            }
            
            // 检查以双辅音开头的组合（如 kka, tta, ssa 等）
            if (this.sokuonRules.includes(romaji[0]) && romaji[0] === romaji[1] && romaji.length > 2) {
                const baseRomaji = romaji.substring(1); // 去掉第一个重复字符
                console.log('检查促音组合，baseRomaji:', baseRomaji);
                Object.keys(map).forEach(key => {
                    if (key.startsWith(baseRomaji.toLowerCase())) {
                        const sokuon = kanaType === 'hiragana' ? 'っ' : 'ッ';
                        console.log('找到促音组合:', key, '->', sokuon + map[key]);
                        possibilities.push({
                            romaji: romaji,
                            kana: sokuon + map[key],
                            type: kanaType,
                            displayRomaji: romaji[0] + key, // 显示完整的罗马音组合
                            isSokuonCombo: true
                        });
                    }
                });
            }
        }
        
        // 查找以当前输入开头的所有可能
        Object.keys(map).forEach(key => {
            if (key.startsWith(romaji.toLowerCase())) {
                possibilities.push({
                    romaji: key,
                    kana: map[key],
                    type: kanaType
                });
            }
        });
        
        console.log('总共找到的候选:', possibilities.length, possibilities);
        
        // 按优先级排序
        possibilities.sort((a, b) => {
            // 促音组合优先
            if (a.isSokuonCombo && !b.isSokuonCombo) return -1;
            if (!a.isSokuonCombo && b.isSokuonCombo) return 1;
            
            // 单独促音其次
            if (a.isSokuon && !b.isSokuon) return -1;
            if (!a.isSokuon && b.isSokuon) return 1;
            
            // 完整匹配优先
            if (a.romaji === romaji) return -1;
            if (b.romaji === romaji) return 1;
            
            // 按长度排序
            return a.romaji.length - b.romaji.length;
        });
        
        return possibilities.slice(0, 8); // 最多显示8个选项
    }
    
    // 验证罗马音输入是否有效
    isValidRomaji(romaji) {
        // 只允许英文字母
        return /^[a-zA-Z]*$/.test(romaji);
    }
    
    // 检查是否是完整的假名
    isCompleteKana(romaji, kanaType = 'hiragana') {
        const map = kanaType === 'hiragana' ? this.hiraganaMap : this.katakanaMap;
        return map.hasOwnProperty(romaji.toLowerCase());
    }
    
    // 获取输入建议
    getSuggestions(romaji) {
        const suggestions = [];
        const hiragana = this.getPossibleKana(romaji, 'hiragana');
        const katakana = this.getPossibleKana(romaji, 'katakana');
        
        if (hiragana.length > 0) {
            suggestions.push({
                type: 'hiragana',
                title: '平假名',
                options: hiragana
            });
        }
        
        if (katakana.length > 0) {
            suggestions.push({
                type: 'katakana',
                title: '片假名',
                options: katakana
            });
        }
        
        return suggestions;
    }
    
    // 清空当前输入
    clear() {
        this.currentInput = '';
    }
    
    // 设置假名类型
    setKanaType(type) {
        if (type === 'hiragana' || type === 'katakana') {
            this.currentKanaType = type;
        }
    }
    
    // 获取当前假名类型
    getKanaType() {
        return this.currentKanaType;
    }
}

// 如果在浏览器环境中，将类添加到全局对象
if (typeof window !== 'undefined') {
    window.RomajiConverter = RomajiConverter;
}

// 如果在 Node.js 环境中，导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RomajiConverter;
}