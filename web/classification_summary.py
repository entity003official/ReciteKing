#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os

def generate_classification_summary():
    """生成分类总结报告"""
    
    print("词汇分类总结报告")
    print("=" * 50)
    
    # 统计各类别数量
    category_stats = {}
    greeting_distribution = {}
    lesson_stats = {}
    
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if not os.path.exists(filename):
            continue
        
        lesson_categories = {}
        
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                category = row.get('栏目', '未分类')
                
                # 全局统计
                category_stats[category] = category_stats.get(category, 0) + 1
                
                # 课程统计
                lesson_categories[category] = lesson_categories.get(category, 0) + 1
                
                # 寒暄语分布
                if category == "寒暄语":
                    if lesson_num not in greeting_distribution:
                        greeting_distribution[lesson_num] = []
                    greeting_distribution[lesson_num].append({
                        'kana': row['假名'],
                        'meaning': row['释义']
                    })
        
        lesson_stats[lesson_num] = lesson_categories
    
    # 输出结果
    print(f"\n1. 总体分类统计 (前20个):")
    for i, (category, count) in enumerate(sorted(category_stats.items(), key=lambda x: x[1], reverse=True)[:20]):
        print(f"   {i+1:2d}. {category}: {count} 个")
    
    print(f"\n2. 寒暄语分布情况:")
    total_greetings = 0
    for lesson_num, greetings in sorted(greeting_distribution.items()):
        print(f"   第 {lesson_num:2d} 课: {len(greetings)} 个寒暄语")
        for greeting in greetings:
            print(f"      - {greeting['kana']} ({greeting['meaning']})")
        total_greetings += len(greetings)
    print(f"   总计: {total_greetings} 个寒暄语")
    
    print(f"\n3. 物品分类统计:")
    item_categories = ['学习用品', '电子产品', '日用品', '食物饮品', '服装用品']
    for category in item_categories:
        count = category_stats.get(category, 0)
        if count > 0:
            print(f"   {category}: {count} 个")
    
    print(f"\n4. 第五课时间日期分类:")
    if 5 in lesson_stats and '时间日期' in lesson_stats[5]:
        print(f"   时间日期词汇: {lesson_stats[5]['时间日期']} 个")
        
        # 显示第五课的时间日期词汇
        filename = "data/vocabulary/lesson_05_vocabulary.csv"
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            time_words = []
            for row in reader:
                if row.get('栏目') == '时间日期':
                    time_words.append(f"{row['假名']}({row['释义']})")
        
        print("   具体词汇:")
        for word in time_words[:10]:  # 显示前10个
            print(f"      - {word}")
    
    print(f"\n5. 重要课程分类概览:")
    important_lessons = [1, 2, 3, 5]
    for lesson_num in important_lessons:
        if lesson_num in lesson_stats:
            print(f"   第 {lesson_num} 课主要分类:")
            top_categories = sorted(lesson_stats[lesson_num].items(), key=lambda x: x[1], reverse=True)[:5]
            for category, count in top_categories:
                print(f"      - {category}: {count} 个")
    
    print(f"\n6. 分类完成情况:")
    total_words = sum(category_stats.values())
    classified_words = sum(count for category, count in category_stats.items() if category != '补充词汇')
    classification_rate = (classified_words / total_words) * 100 if total_words > 0 else 0
    print(f"   总词汇量: {total_words} 个")
    print(f"   已分类词汇: {classified_words} 个")
    print(f"   分类完成率: {classification_rate:.1f}%")

if __name__ == "__main__":
    generate_classification_summary()
