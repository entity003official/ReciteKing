import random
import csv
import os
import configparser

def load_config(config_file="config.txt"):
    """加载配置文件"""
    config = {
        'enabled_types': ['hiragana', 'katakana', 'dakuten', 'handakuten', 'youon', 'youon_dakuten', 'youon_handakuten', 'chouon'],
        'target_score': 2,
        'option_count': 4
    }
    
    if not os.path.exists(config_file):
        print(f"配置文件 {config_file} 不存在，使用默认设置")
        return config
    
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 简单解析配置文件
        enabled_types = []
        for line in content.split('\n'):
            line = line.strip()
            if '=' in line and not line.startswith('#') and not line.startswith('['):
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip().split('#')[0].strip()  # 去掉注释
                
                if key in ['hiragana', 'katakana', 'dakuten', 'handakuten', 'youon', 'youon_dakuten', 'youon_handakuten', 'chouon']:
                    if value.lower() == 'true':
                        enabled_types.append(key)
                elif key == 'target_score':
                    config['target_score'] = int(value)
                elif key == 'option_count':
                    config['option_count'] = int(value)
        
        if enabled_types:
            config['enabled_types'] = enabled_types
            
        print(f"配置加载成功，启用类型：{', '.join(config['enabled_types'])}")
    except Exception as e:
        print(f"配置文件读取错误：{e}，使用默认设置")
    
    return config

def load_kana_data(csv_file="kana_data.csv", enabled_types=None):
    """从CSV文件加载假名数据"""
    kana_map = {}
    
    # 检查文件是否存在
    if not os.path.exists(csv_file):
        print(f"错误：找不到文件 {csv_file}")
        return kana_map
    
    if enabled_types is None:
        enabled_types = ['hiragana', 'katakana', 'dakuten', 'handakuten', 'youon', 'youon_dakuten', 'youon_handakuten', 'chouon']
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['type'] in enabled_types:
                    kana_map[row['kana']] = row['romaji']
        print(f"成功加载 {len(kana_map)} 个假名数据")
    except Exception as e:
        print(f"读取CSV文件时出错：{e}")
    
    return kana_map

# 加载配置
config = load_config()

# 加载假名数据
kana_map = load_kana_data(enabled_types=config['enabled_types'])

# 存储假名对应的分数
score_map = {}

def get_options(correct_romaji, option_count=4):
    """生成随机选项"""
    options = [correct_romaji]
    
    # 获取所有不同的罗马音
    all_romaji = [romaji for romaji in kana_map.values() if romaji != correct_romaji]
    
    # 随机选择干扰项
    random.shuffle(all_romaji)
    for i in range(min(option_count - 1, len(all_romaji))):
        options.append(all_romaji[i])
    
    # 打乱选项顺序
    random.shuffle(options)
    return options

def display_options(options):
    """显示选项"""
    for i, option in enumerate(options, 1):
        print(f"{i}. {option}")

def start_game():
    """主要游戏逻辑"""
    # 检查数据是否加载成功
    if not kana_map:
        print("❌ 无法加载假名数据，程序退出")
        return
    
    # 初始化分数
    for kana in kana_map.keys():
        score_map[kana] = 0
    
    while score_map:
        # 随机选择一个假名
        kana = random.choice(list(score_map.keys()))
        correct_romaji = kana_map[kana]
        
        # 显示题目
        print(f"请为 [{kana}] 选择正确的罗马音：")
        options = get_options(correct_romaji, config['option_count'])
        display_options(options)
        
        # 获取用户输入
        try:
            choice = int(input("请输入选项编号："))
        except ValueError:
            print("无效输入，请输入数字。")
            continue
        
        # 检查输入是否合法
        if choice < 1 or choice > len(options):
            print("无效选择，请重新输入。")
            continue
        
        # 判断正确与否
        if options[choice - 1] == correct_romaji:
            print("✅ 正确！")
            score_map[kana] += 1
        else:
            print(f"❌ 错误！正确答案是：{correct_romaji}")
            score_map[kana] = max(0, score_map[kana] - 1)
        
        # 如果分数达到目标分数，移除
        if score_map[kana] >= config['target_score']:
            print(f"🎉 [{kana}] 达标，不再出现！")
            del score_map[kana]
        
        print()  # 空行分隔
    
    print("🎊 恭喜你，全部音都达标了！")

if __name__ == "__main__":
    start_game()
