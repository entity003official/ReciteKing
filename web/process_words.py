#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import csv
import re
import os

def load_and_clean_excel():
    """加载并清理 Excel 数据"""
    df = pd.read_excel('minanonihongo_words.xls')
    
    # 重命名列
    df.columns = ['kanji', 'kana', 'meaning', 'romaji', 'accent']
    
    # 清理数据
    df = df.dropna(subset=['kanji', 'kana'])  # 移除空行
    
    # 找到课程分割线
    lesson_markers = []
    for i, row in df.iterrows():
        if pd.notna(row['kanji']) and str(row['kanji']).startswith('大家日语_'):
            lesson_markers.append((i, row['kanji']))
    
    print("找到的课程分割线:")
    for i, marker in lesson_markers:
        print(f"  行 {i}: {marker}")
    
    return df, lesson_markers

def categorize_word_type(kanji, kana, meaning):
    """根据单词内容判断词性"""
    kanji_str = str(kanji) if pd.notna(kanji) else ""
    kana_str = str(kana) if pd.notna(kana) else ""
    meaning_str = str(meaning) if pd.notna(meaning) else ""
    
    # 动词类型判断
    if (kana_str.endswith('う') or kana_str.endswith('く') or 
        kana_str.endswith('ぐ') or kana_str.endswith('す') or 
        kana_str.endswith('つ') or kana_str.endswith('ぬ') or 
        kana_str.endswith('ぶ') or kana_str.endswith('む') or 
        kana_str.endswith('る')):
        
        # 一型动词（五段动词）
        if (kana_str.endswith('う') or kana_str.endswith('く') or 
            kana_str.endswith('ぐ') or kana_str.endswith('す') or 
            kana_str.endswith('つ') or kana_str.endswith('ぬ') or 
            kana_str.endswith('ぶ') or kana_str.endswith('む')):
            return "动词(1型)"
        
        # 二型动词（一段动词）
        elif kana_str.endswith('る'):
            # 检查る前面是否是い或え
            if len(kana_str) >= 2:
                pre_char = kana_str[-2]
                if pre_char in 'いえきけしせちてにねひへみめりれ':
                    return "动词(2型)"
            return "动词(1型)"
    
    # 三型动词（不规则动词）
    if kana_str in ['する', 'くる', 'こくる'] or kana_str.endswith('する'):
        return "动词(3型)"
    
    # 形容词判断
    if kana_str.endswith('い') and not kana_str.endswith('る'):
        return "い形容词"
    
    if meaning_str and ('的' in meaning_str or '...的' in meaning_str):
        return "な形容词"
    
    # 片假名外来词
    katakana_chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポャュョッ'
    if any(char in katakana_chars for char in kana_str):
        return "外来词"
    
    # 寒暄语
    if any(greet in meaning_str.lower() for greet in ['早上好', '您好', '再见', '谢谢', '对不起', '请', '欢迎', '打扰', '失礼']):
        return "寒暄语"
    
    # 数词
    if any(num in kana_str for num in ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう']):
        return "数词"
    
    # 时间词
    if any(time in meaning_str for time in ['时', '分', '点', '年', '月', '日', '星期', '今天', '明天', '昨天']):
        return "时间词"
    
    # 方位词
    if any(dir in meaning_str for dir in ['上', '下', '左', '右', '前', '后', '里', '外', '东', '西', '南', '北']):
        return "方位词"
    
    # 专有名词（国家、地名等）
    if any(place in meaning_str for place in ['国', '市', '县', '省', '京', '州']):
        return "专有名词"
    
    return "名词"

def extract_lessons_data(df, lesson_markers):
    """提取各课程的单词数据"""
    lessons_data = {}
    
    for i, (start_idx, lesson_name) in enumerate(lesson_markers):
        # 获取课程编号
        lesson_num = lesson_name.replace('大家日语_', '')
        
        # 确定结束位置
        if i < len(lesson_markers) - 1:
            end_idx = lesson_markers[i + 1][0]
        else:
            end_idx = len(df)
        
        # 提取该课程的单词
        lesson_words = []
        for j in range(start_idx + 1, end_idx):
            if j < len(df):
                row = df.iloc[j]
                if pd.notna(row['kanji']) and pd.notna(row['kana']):
                    # 跳过课程标题行
                    if str(row['kanji']).startswith('大家日语_'):
                        continue
                    
                    word_type = categorize_word_type(row['kanji'], row['kana'], row['meaning'])
                    
                    word_data = {
                        'kanji': str(row['kanji']).strip(),
                        'kana': str(row['kana']).strip(),
                        'meaning': str(row['meaning']).strip() if pd.notna(row['meaning']) else '',
                        'romaji': str(row['romaji']).strip() if pd.notna(row['romaji']) else '',
                        'accent': str(row['accent']).strip() if pd.notna(row['accent']) else '',
                        'type': word_type
                    }
                    lesson_words.append(word_data)
        
        if lesson_words:
            lessons_data[lesson_num] = lesson_words
            print(f"课程 {lesson_num}: {len(lesson_words)} 个单词")
    
    return lessons_data

def read_existing_csv(filename):
    """读取现有的 CSV 文件"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            return list(reader)
    except FileNotFoundError:
        return []

def save_to_csv(lesson_num, words_data):
    """保存单词数据到 CSV 文件"""
    filename = f"data/vocabulary/lesson_{lesson_num.zfill(2)}_vocabulary.csv"
    
    # 确保目录存在
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # 读取现有数据
    existing_words = read_existing_csv(filename)
    existing_kana = {word['kana'] for word in existing_words}
    
    # 合并新单词
    all_words = existing_words.copy()
    new_count = 0
    
    for word in words_data:
        if word['kana'] not in existing_kana:
            all_words.append(word)
            new_count += 1
    
    # 保存到文件
    fieldnames = ['kana', 'kanji', 'meaning', 'type', 'romaji', 'accent']
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for word in all_words:
            writer.writerow({
                'kana': word['kana'],
                'kanji': word['kanji'],
                'meaning': word['meaning'],
                'type': word['type'],
                'romaji': word.get('romaji', ''),
                'accent': word.get('accent', '')
            })
    
    print(f"保存课程 {lesson_num}: 总计 {len(all_words)} 个单词 (新增 {new_count} 个)")
    return filename

def main():
    print("开始处理《大家的日语》单词数据...")
    
    # 加载和清理数据
    df, lesson_markers = load_and_clean_excel()
    
    # 提取各课程数据
    lessons_data = extract_lessons_data(df, lesson_markers)
    
    # 保存到 CSV 文件
    for lesson_num, words in lessons_data.items():
        save_to_csv(lesson_num, words)
    
    # 生成统计信息
    print("\n统计信息:")
    total_words = sum(len(words) for words in lessons_data.values())
    print(f"总共处理了 {len(lessons_data)} 个课程，{total_words} 个单词")
    
    # 按词性统计
    type_count = {}
    for words in lessons_data.values():
        for word in words:
            word_type = word['type']
            type_count[word_type] = type_count.get(word_type, 0) + 1
    
    print("\n词性分布:")
    for word_type, count in sorted(type_count.items()):
        print(f"  {word_type}: {count} 个")

if __name__ == "__main__":
    main()
