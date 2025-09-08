#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import csv
import os
import re

def categorize_word_type(kanji, kana, meaning):
    """根据单词内容判断词性"""
    kanji_str = str(kanji) if pd.notna(kanji) else ""
    kana_str = str(kana) if pd.notna(kana) else ""
    meaning_str = str(meaning) if pd.notna(meaning) else ""
    
    # 动词类型判断
    if kana_str.endswith('る'):
        # 检查是否为二型动词（一段动词）
        if len(kana_str) >= 2:
            pre_char = kana_str[-2]
            # い段和え段 + る 通常是二型动词
            if pre_char in 'いえきけしせちてにねひへみめりれびべぎげじぜぢでびべぴぺ':
                return "动词(2型)"
        return "动词(1型)"
    elif (kana_str.endswith('う') or kana_str.endswith('く') or 
          kana_str.endswith('ぐ') or kana_str.endswith('す') or 
          kana_str.endswith('つ') or kana_str.endswith('ぬ') or 
          kana_str.endswith('ぶ') or kana_str.endswith('む')):
        return "动词(1型)"
    
    # 三型动词（不规则动词）
    if (kana_str == 'する' or kana_str == 'くる' or 
        kana_str.endswith('する') or '来' in kanji_str):
        return "动词(3型)"
    
    # 形容词判断
    if kana_str.endswith('い') and not kana_str.endswith('る'):
        # 排除一些特殊情况
        if not any(word in meaning_str for word in ['的', '...的', '某种']):
            return "い形容词"
    
    # な形容词（通常在意思中有"的"或者是形容状态的词）
    if (meaning_str and ('的' in meaning_str or '...的' in meaning_str) and 
        not kana_str.endswith('い')):
        return "な形容词"
    
    # 片假名外来词
    katakana_chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポャュョッー'
    if any(char in katakana_chars for char in kana_str):
        return "外来词"
    
    # 寒暄语
    greetings = ['早上好', '您好', '再见', '谢谢', '对不起', '请', '欢迎', '打扰', '失礼', 
                '初次见面', '请多关照', '不客气', 'excuse me', '冒昧', '问候']
    if any(greet in meaning_str for greet in greetings):
        return "寒暄语"
    
    # 数词
    numbers = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう']
    if any(num in kana_str for num in numbers) or any(c.isdigit() for c in kanji_str):
        return "数词"
    
    # 时间词
    time_words = ['时', '分', '点', '年', '月', '日', '星期', '今天', '明天', '昨天', '现在', '上午', '下午']
    if any(time in meaning_str for time in time_words):
        return "时间词"
    
    # 方位词
    direction_words = ['上', '下', '左', '右', '前', '后', '里', '外', '东', '西', '南', '北', '中', '旁边']
    if any(dir_word in meaning_str for dir_word in direction_words):
        return "方位词"
    
    # 专有名词（国家、地名、人名等）
    proper_nouns = ['国', '市', '县', '省', '京', '州', '大学', '银行', '医院', '公司', '车站']
    if any(place in meaning_str for place in proper_nouns):
        return "专有名词"
    
    # 代词
    if any(pronoun in meaning_str for pronoun in ['我', '你', '他', '她', '这', '那', '哪', '什么', '谁']):
        return "代词"
    
    # 连体词
    if kana_str in ['この', 'その', 'あの', 'どの']:
        return "连体词"
    
    # 副词
    if any(adv in meaning_str for adv in ['很', '非常', '特别', '稍微', '一点', '完全', '绝对']):
        return "副词"
    
    return "名词"

def read_existing_vocabulary(lesson_num):
    """读取现有的词汇文件"""
    filename = f"data/vocabulary/lesson_{lesson_num.zfill(2)}_vocabulary.csv"
    existing_words = {}
    
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    kana = row.get('假名', '')
                    existing_words[kana] = row
        except Exception as e:
            print(f"读取文件 {filename} 时出错: {e}")
    
    return existing_words

def save_vocabulary_to_csv(lesson_num, words_data, existing_words):
    """保存词汇到 CSV 文件"""
    filename = f"data/vocabulary/lesson_{lesson_num.zfill(2)}_vocabulary.csv"
    
    # 确保目录存在
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # 合并现有和新单词
    all_words = existing_words.copy()
    new_count = 0
    
    for word in words_data:
        kana = word['kana']
        if kana not in all_words:
            all_words[kana] = {
                '课程': f"第{lesson_num}课",
                '栏目': "补充词汇",
                '假名': word['kana'],
                '汉字': word['kanji'],
                '释义': word['meaning'],
                '词性': word['type']
            }
            new_count += 1
        else:
            # 更新现有词汇的信息（如果新数据更完整）
            existing = all_words[kana]
            if word['kanji'] and (not existing.get('汉字') or existing.get('汉字') == existing.get('假名')):
                existing['汉字'] = word['kanji']
            if word['meaning'] and len(word['meaning']) > len(existing.get('释义', '')):
                existing['释义'] = word['meaning']
    
    # 写入文件
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        fieldnames = ['课程', '栏目', '假名', '汉字', '释义', '词性']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for word in all_words.values():
            writer.writerow(word)
    
    print(f"课程 {lesson_num}: 总计 {len(all_words)} 个单词 (新增 {new_count} 个)")
    return new_count

def process_excel_data():
    """处理 Excel 数据"""
    print("开始处理《大家的日语》单词数据...")
    
    # 读取 Excel 文件
    df = pd.read_excel('minanonihongo_words.xls')
    
    # 课程分割线位置
    lesson_positions = {
        '01': 2, '02': 36, '03': 82, '04': 119, '05': 171,
        '06': 225, '07': 277, '08': 317, '09': 370, '10': 415,
        '11': 460, '12': 516, '13': 558, '14': 593, '15': 631,
        '16': 655, '17': 695, '18': 731, '19': 753, '20': 777,
        '21': 803, '22': 837, '23': 851, '24': 880, '25': 897
    }
    
    total_new_words = 0
    
    for lesson_num, start_pos in lesson_positions.items():
        print(f"\n处理第 {lesson_num} 课...")
        
        # 确定结束位置
        lesson_nums = list(lesson_positions.keys())
        current_index = lesson_nums.index(lesson_num)
        if current_index < len(lesson_nums) - 1:
            next_lesson = lesson_nums[current_index + 1]
            end_pos = lesson_positions[next_lesson]
        else:
            end_pos = len(df)
        
        # 读取现有词汇
        existing_words = read_existing_vocabulary(lesson_num)
        
        # 提取该课程的单词
        lesson_words = []
        for i in range(start_pos + 1, end_pos):
            if i < len(df):
                row = df.iloc[i]
                kanji = row.iloc[0]
                kana = row.iloc[1]
                meaning = row.iloc[2]
                
                # 检查数据完整性
                if pd.notna(kanji) and pd.notna(kana) and pd.notna(meaning):
                    kanji_str = str(kanji).strip()
                    kana_str = str(kana).strip()
                    meaning_str = str(meaning).strip()
                    
                    # 跳过空数据和课程标记
                    if (kanji_str and kana_str and meaning_str and 
                        not kanji_str.startswith('大家日语') and
                        kanji_str != 'None' and kana_str != 'None'):
                        
                        word_type = categorize_word_type(kanji_str, kana_str, meaning_str)
                        
                        word_data = {
                            'kanji': kanji_str,
                            'kana': kana_str,
                            'meaning': meaning_str,
                            'type': word_type
                        }
                        lesson_words.append(word_data)
        
        # 保存到文件
        if lesson_words:
            new_count = save_vocabulary_to_csv(lesson_num, lesson_words, existing_words)
            total_new_words += new_count
        else:
            print(f"第 {lesson_num} 课没有找到新单词")
    
    print(f"\n处理完成！总共新增 {total_new_words} 个单词")
    
    # 生成统计报告
    print("\n各课程词汇统计:")
    for lesson_num in lesson_positions.keys():
        filename = f"data/vocabulary/lesson_{lesson_num.zfill(2)}_vocabulary.csv"
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                print(f"第 {lesson_num} 课: {len(lines) - 1} 个单词")

if __name__ == "__main__":
    process_excel_data()
