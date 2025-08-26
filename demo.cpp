#include <iostream>
#include <map>
#include <vector>
#include <algorithm>
#include <ctime>
#include <cstdlib>

using namespace std;

// 假名与罗马音映射
map<string, string> kanaMap = {
    // 平假名
    {"あ", "a"}, {"い", "i"}, {"う", "u"}, {"え", "e"}, {"お", "o"},
    {"か", "ka"}, {"き", "ki"}, {"く", "ku"}, {"け", "ke"}, {"こ", "ko"},
    {"さ", "sa"}, {"し", "shi"}, {"す", "su"}, {"せ", "se"}, {"そ", "so"},
    {"た", "ta"}, {"ち", "chi"}, {"つ", "tsu"}, {"て", "te"}, {"と", "to"},
    {"な", "na"}, {"に", "ni"}, {"ぬ", "nu"}, {"ね", "ne"}, {"の", "no"},
    {"は", "ha"}, {"ひ", "hi"}, {"ふ", "fu"}, {"へ", "he"}, {"ほ", "ho"},
    {"ま", "ma"}, {"み", "mi"}, {"む", "mu"}, {"め", "me"}, {"も", "mo"},
    {"や", "ya"}, {"ゆ", "yu"}, {"よ", "yo"},
    {"ら", "ra"}, {"り", "ri"}, {"る", "ru"}, {"れ", "re"}, {"ろ", "ro"},
    {"わ", "wa"}, {"を", "wo"}, {"ん", "n"},

    // 片假名
    {"ア", "a"}, {"イ", "i"}, {"ウ", "u"}, {"エ", "e"}, {"オ", "o"},
    {"カ", "ka"}, {"キ", "ki"}, {"ク", "ku"}, {"ケ", "ke"}, {"コ", "ko"},
    {"サ", "sa"}, {"シ", "shi"}, {"ス", "su"}, {"セ", "se"}, {"ソ", "so"},
    {"タ", "ta"}, {"チ", "chi"}, {"ツ", "tsu"}, {"テ", "te"}, {"ト", "to"},
    {"ナ", "na"}, {"ニ", "ni"}, {"ヌ", "nu"}, {"ネ", "ne"}, {"ノ", "no"},
    {"ハ", "ha"}, {"ヒ", "hi"}, {"フ", "fu"}, {"ヘ", "he"}, {"ホ", "ho"},
    {"マ", "ma"}, {"ミ", "mi"}, {"ム", "mu"}, {"メ", "me"}, {"モ", "mo"},
    {"ヤ", "ya"}, {"ユ", "yu"}, {"ヨ", "yo"},
    {"ラ", "ra"}, {"リ", "ri"}, {"ル", "ru"}, {"レ", "re"}, {"ロ", "ro"},
    {"ワ", "wa"}, {"ヲ", "wo"}, {"ン", "n"},

    // 浊音
    {"が", "ga"}, {"ぎ", "gi"}, {"ぐ", "gu"}, {"げ", "ge"}, {"ご", "go"},
    {"ざ", "za"}, {"じ", "ji"}, {"ず", "zu"}, {"ぜ", "ze"}, {"ぞ", "zo"},
    {"だ", "da"}, {"ぢ", "ji"}, {"づ", "zu"}, {"で", "de"}, {"ど", "do"},
    {"ば", "ba"}, {"び", "bi"}, {"ぶ", "bu"}, {"べ", "be"}, {"ぼ", "bo"},

    // 片假名浊音
    {"ガ", "ga"}, {"ギ", "gi"}, {"グ", "gu"}, {"ゲ", "ge"}, {"ゴ", "go"},
    {"ザ", "za"}, {"ジ", "ji"}, {"ズ", "zu"}, {"ゼ", "ze"}, {"ゾ", "zo"},
    {"ダ", "da"}, {"ヂ", "ji"}, {"ヅ", "zu"}, {"デ", "de"}, {"ド", "do"},
    {"バ", "ba"}, {"ビ", "bi"}, {"ブ", "bu"}, {"ベ", "be"}, {"ボ", "bo"},

    // 半浊音
    {"ぱ", "pa"}, {"ぴ", "pi"}, {"ぷ", "pu"}, {"ぺ", "pe"}, {"ぽ", "po"},

    // 片假名半浊音
    {"パ", "pa"}, {"ピ", "pi"}, {"プ", "pu"}, {"ペ", "pe"}, {"ポ", "po"},

    // 拗音
    {"きゃ", "kya"}, {"きゅ", "kyu"}, {"きょ", "kyo"},
    {"しゃ", "sha"}, {"しゅ", "shu"}, {"しょ", "sho"},
    {"ちゃ", "cha"}, {"ちゅ", "chu"}, {"ちょ", "cho"},
    {"にゃ", "nya"}, {"にゅ", "nyu"}, {"にょ", "nyo"},
    {"ひゃ", "hya"}, {"ひゅ", "hyu"}, {"ひょ", "hyo"},
    {"みゃ", "mya"}, {"みゅ", "myu"}, {"みょ", "myo"},
    {"りゃ", "rya"}, {"りゅ", "ryu"}, {"りょ", "ryo"},

    // 片假名拗音
    {"キャ", "kya"}, {"キュ", "kyu"}, {"キョ", "kyo"},
    {"シャ", "sha"}, {"シュ", "shu"}, {"ショ", "sho"},
    {"チャ", "cha"}, {"チュ", "chu"}, {"チョ", "cho"},
    {"ニャ", "nya"}, {"ニュ", "nyu"}, {"ニョ", "nyo"},
    {"ヒャ", "hya"}, {"ヒュ", "hyu"}, {"ヒョ", "hyo"},
    {"ミャ", "mya"}, {"ミュ", "myu"}, {"ミョ", "myo"},
    {"リャ", "rya"}, {"リュ", "ryu"}, {"リョ", "ryo"},

    // 浊音拗音
    {"ぎゃ", "gya"}, {"ぎゅ", "gyu"}, {"ぎょ", "gyo"},
    {"じゃ", "ja"}, {"じゅ", "ju"}, {"じょ", "jo"},
    {"びゃ", "bya"}, {"びゅ", "byu"}, {"びょ", "byo"},

    // 片假名浊音拗音
    {"ギャ", "gya"}, {"ギュ", "gyu"}, {"ギョ", "gyo"},
    {"ジャ", "ja"}, {"ジュ", "ju"}, {"ジョ", "jo"},
    {"ビャ", "bya"}, {"ビュ", "byu"}, {"ビョ", "byo"},

    // 半浊音拗音
    {"ぴゃ", "pya"}, {"ぴゅ", "pyu"}, {"ぴょ", "pyo"},

    // 片假名半浊音拗音
    {"ピャ", "pya"}, {"ピュ", "pyu"}, {"ピョ", "pyo"},

    // ✅ 长音（平假名）
    {"あー", "aa"}, {"いー", "ii"}, {"うー", "uu"}, {"えー", "ee"}, {"おー", "oo"},
    {"かー", "kaa"}, {"きー", "kii"}, {"くー", "kuu"}, {"けー", "kee"}, {"こー", "koo"},
    {"さー", "saa"}, {"しー", "shii"}, {"すー", "suu"}, {"せー", "see"}, {"そー", "soo"},
    {"たー", "taa"}, {"ちー", "chii"}, {"つー", "tsuu"}, {"てー", "tee"}, {"とー", "too"},
    {"なー", "naa"}, {"にー", "nii"}, {"ぬー", "nuu"}, {"ねー", "nee"}, {"のー", "noo"},
    {"はー", "haa"}, {"ひー", "hii"}, {"ふー", "fuu"}, {"へー", "hee"}, {"ほー", "hoo"},
    {"まー", "maa"}, {"みー", "mii"}, {"むー", "muu"}, {"めー", "mee"}, {"もー", "moo"},
    {"やー", "yaa"}, {"ゆー", "yuu"}, {"よー", "yoo"},
    {"らー", "raa"}, {"りー", "rii"}, {"るー", "ruu"}, {"れー", "ree"}, {"ろー", "roo"},
    {"わー", "waa"}, {"をー", "woo"},

    // ✅ 长音（片假名）
    {"アー", "aa"}, {"イー", "ii"}, {"ウー", "uu"}, {"エー", "ee"}, {"オー", "oo"},
    {"カー", "kaa"}, {"キー", "kii"}, {"クー", "kuu"}, {"ケー", "kee"}, {"コー", "koo"},
    {"サー", "saa"}, {"シー", "shii"}, {"スー", "suu"}, {"セー", "see"}, {"ソー", "soo"},
    {"ター", "taa"}, {"チー", "chii"}, {"ツー", "tsuu"}, {"テー", "tee"}, {"トー", "too"},
    {"ナー", "naa"}, {"ニー", "nii"},

};

// 存储假名对应的分数
map<string, int> scoreMap;

// 生成随机选项
vector<string> getOptions(string correctRomaji) {
    vector<string> options;
    options.push_back(correctRomaji);

    // 获取所有罗马音
    vector<string> allRomaji;
    for (auto &pair : kanaMap) {
        if (pair.second != correctRomaji) {
            allRomaji.push_back(pair.second);
        }
    }

    // 随机选择 3 个干扰项
    random_shuffle(allRomaji.begin(), allRomaji.end());
    for (int i = 0; i < 3; i++) {
        options.push_back(allRomaji[i]);
    }

    // 打乱选项顺序
    random_shuffle(options.begin(), options.end());
    return options;
}

// 显示选项
void displayOptions(vector<string> &options) {
    for (int i = 0; i < options.size(); i++) {
        cout << i + 1 << ". " << options[i] << endl;
    }
}

// 主要逻辑
void startGame() {
    srand(time(0));

    // 初始化分数
    for (auto &pair : kanaMap) {
        scoreMap[pair.first] = 0;
    }

    while (!scoreMap.empty()) {
        // 随机选择一个假名
        auto it = scoreMap.begin();
        advance(it, rand() % scoreMap.size());
        string kana = it->first;
        string correctRomaji = kanaMap[kana];

        // 显示题目
        cout << "请为 [" << kana << "] 选择正确的罗马音：" << endl;
        vector<string> options = getOptions(correctRomaji);
        displayOptions(options);

        // 获取用户输入
        int choice;
        cout << "请输入选项编号：";
        cin >> choice;

        // 检查输入是否合法
        if (choice < 1 || choice > 4) {
            cout << "无效选择，请重新输入。\n";
            continue;
        }

        // 判断正确与否
        if (options[choice - 1] == correctRomaji) {
            cout << "✅ 正确！" << endl;
            scoreMap[kana]++;
        } else {
            cout << "❌ 错误！正确答案是：" << correctRomaji << endl;
            scoreMap[kana] = max(0, scoreMap[kana] - 1);
        }

        // 如果分数达到5，移除
        if (scoreMap[kana] >= 2) {
            cout << "🎉 [" << kana << "] 达标，不再出现！" << endl;
            scoreMap.erase(kana);
        }
    }

    cout << "🎊 恭喜你，全部音都达标了！" << endl;
}

int main() {
    startGame();
    return 0;
}
