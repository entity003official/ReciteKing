#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os
from collections import defaultdict

def analyze_vocabulary():
    """分析词汇分布"""
    print("《大家的日语》词汇分析报告")
    print("=" * 50)
    
    # 统计各种类型
    type_stats = defaultdict(int)
    lesson_stats = defaultdict(int)
    lesson_type_stats = defaultdict(lambda: defaultdict(int))
    
    total_words = 0
    
    # 遍历所有课程文件
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                lesson_count = 0
                
                for row in reader:
                    word_type = row.get('词性', '未分类')
                    type_stats[word_type] += 1
                    lesson_type_stats[lesson_num][word_type] += 1
                    lesson_count += 1
                    total_words += 1
                
                lesson_stats[lesson_num] = lesson_count
    
    # 输出总体统计
    print(f"\n总词汇量: {total_words} 个单词")
    print(f"课程数量: {len(lesson_stats)} 课")
    
    # 词性分布
    print(f"\n词性分布:")
    for word_type, count in sorted(type_stats.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_words) * 100
        print(f"  {word_type}: {count} 个 ({percentage:.1f}%)")
    
    # 各课程词汇量
    print(f"\n各课程词汇量:")
    for lesson_num, count in sorted(lesson_stats.items()):
        print(f"  第 {lesson_num:2d} 课: {count:2d} 个单词")
    
    # 外来词分析
    print(f"\n外来词详细统计:")
    foreign_words = []
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                for row in reader:
                    if row.get('词性') == '外来词':
                        foreign_words.append({
                            'lesson': lesson_num,
                            'kana': row.get('假名', ''),
                            'kanji': row.get('汉字', ''),
                            'meaning': row.get('释义', '')
                        })
    
    print(f"  总共找到 {len(foreign_words)} 个外来词")
    for word in foreign_words[:20]:  # 只显示前20个
        print(f"    第{word['lesson']:2d}课: {word['kana']} ({word['meaning']})")
    
    if len(foreign_words) > 20:
        print(f"    ... 还有 {len(foreign_words) - 20} 个外来词")
    
    # 动词统计
    print(f"\n动词统计:")
    verb_types = ['动词(1型)', '动词(2型)', '动词(3型)']
    for verb_type in verb_types:
        count = type_stats.get(verb_type, 0)
        print(f"  {verb_type}: {count} 个")
    
    # 寒暄语统计
    print(f"\n寒暄语统计:")
    greetings = []
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                for row in reader:
                    if row.get('词性') == '寒暄语':
                        greetings.append({
                            'lesson': lesson_num,
                            'kana': row.get('假名', ''),
                            'meaning': row.get('释义', '')
                        })
    
    print(f"  总共找到 {len(greetings)} 个寒暄语")
    for greeting in greetings:
        print(f"    第{greeting['lesson']:2d}课: {greeting['kana']} ({greeting['meaning']})")

if __name__ == "__main__":
    analyze_vocabulary()
