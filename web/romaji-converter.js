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
        
        // 促音处理规则
        this.sokuonRules = ['k', 't', 's', 'p', 'c'];
        
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
    
    // 获取可能的假名选择
    getPossibleKana(romaji, kanaType = 'hiragana') {
        const map = kanaType === 'hiragana' ? this.hiraganaMap : this.katakanaMap;
        const possibilities = [];
        
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
        
        // 按长度排序，优先显示完整匹配
        possibilities.sort((a, b) => {
            if (a.romaji === romaji) return -1;
            if (b.romaji === romaji) return 1;
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

    // 假名转罗马音 (反向转换)
    kanaToRomaji(kana) {
        let result = '';
        let i = 0;
        
        while (i < kana.length) {
            let found = false;
            
            // 尝试匹配较长的假名组合 (2-3个字符)
            for (let len = Math.min(3, kana.length - i); len >= 1; len--) {
                const kanaChar = kana.substring(i, i + len);
                
                // 在平假名映射中查找
                for (const [romaji, hiragana] of Object.entries(this.hiraganaMap)) {
                    if (hiragana === kanaChar) {
                        result += romaji;
                        i += len;
                        found = true;
                        break;
                    }
                }
                
                if (found) break;
                
                // 在片假名映射中查找
                for (const [romaji, katakana] of Object.entries(this.katakanaMap)) {
                    if (katakana === kanaChar) {
                        result += romaji;
                        i += len;
                        found = true;
                        break;
                    }
                }
                
                if (found) break;
            }
            
            if (!found) {
                // 如果找不到匹配，保留原字符
                result += kana[i];
                i++;
            }
        }
        
        return result;
    }

    // 获取打字纠错建议
    getTypingCorrections(input) {
        const corrections = [];
        
        // 常见打字错误修正
        const errorMap = {
            'si': 'shi',
            'ti': 'chi',
            'tu': 'tsu',
            'hu': 'fu',
            'zi': 'ji',
            'di': 'ji'
        };
        
        if (errorMap[input]) {
            corrections.push(errorMap[input]);
        }
        
        // 长音处理建议
        if (input.endsWith('u') && input.length > 1) {
            const withoutU = input.slice(0, -1);
            if (this.hiraganaMap[withoutU]) {
                corrections.push(withoutU + 'u'); // 长音标记
            }
        }
        
        return corrections;
    }
}

// 全局转换器实例
const romajiConverter = new RomajiConverter();
