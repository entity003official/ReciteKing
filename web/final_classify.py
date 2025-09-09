#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os

def manual_adjustments():
    """手动调整一些特定的分类错误"""
    print("进行手动分类调整...")
    
    adjustments = {
        "lesson_01_vocabulary.csv": [
            # 修正一些错误的分类
            ("あの人", "代词"),
            ("ちゅうごくじん", "国籍职业"),
            ("にほんじん", "国籍职业"),
            ("かんこくじん", "国籍职业"),
            ("アメリカじん", "国籍职业"),
        ],
        "lesson_02_vocabulary.csv": [
            ("この", "指示代词"),
            ("その", "指示代词"),
            ("あの", "指示代词"),
        ],
        "lesson_05_vocabulary.csv": [
            # 确保日本不在时间日期分类中
            ("にほん", "国家城市"),
        ]
    }
    
    for filename, word_adjustments in adjustments.items():
        filepath = f"data/vocabulary/{filename}"
        if not os.path.exists(filepath):
            continue
            
        print(f"调整 {filename}...")
        
        # 读取数据
        rows = []
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # 检查是否需要调整
                for kana_to_adjust, new_category in word_adjustments:
                    if row['假名'] == kana_to_adjust:
                        row['栏目'] = new_category
                        print(f"  调整 {kana_to_adjust} -> {new_category}")
                rows.append(row)
        
        # 写回文件
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['课程', '栏目', '假名', '汉字', '释义', '词性']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

def generate_final_report():
    """生成最终的分类报告"""
    print("\n生成最终分类报告...")
    
    all_categories = {}
    lesson_summaries = {}
    
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if not os.path.exists(filename):
            continue
        
        lesson_categories = {}
        
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                category = row.get('栏目', '未分类')
                
                # 统计全局
                all_categories[category] = all_categories.get(category, 0) + 1
                
                # 统计该课程
                lesson_categories[category] = lesson_categories.get(category, 0) + 1
        
        lesson_summaries[lesson_num] = lesson_categories
    
    # 生成报告
    with open('最终分类报告.txt', 'w', encoding='utf-8') as f:
        f.write("词汇最终分类报告\n")
        f.write("=" * 50 + "\n\n")
        
        # 总体统计
        f.write("总体分类统计:\n")
        for category, count in sorted(all_categories.items(), key=lambda x: x[1], reverse=True):
            f.write(f"  {category}: {count} 个\n")
        
        # 重点课程分类展示
        important_lessons = [1, 2, 5]
        for lesson_num in important_lessons:
            if lesson_num in lesson_summaries:
                f.write(f"\n第 {lesson_num} 课详细分类:\n")
                for category, count in sorted(lesson_summaries[lesson_num].items()):
                    f.write(f"  {category}: {count} 个\n")
        
        # 寒暄语总结
        f.write(f"\n寒暄语分布:\n")
        for lesson_num, categories in lesson_summaries.items():
            if "寒暄语" in categories:
                f.write(f"  第 {lesson_num} 课: {categories['寒暄语']} 个寒暄语\n")
    
    print("最终分类报告已生成到 '最终分类报告.txt'")

def show_category_examples():
    """显示各类别的示例"""
    print("\n显示分类示例:")
    
    # 重点显示的分类
    key_categories = ["寒暄语", "学习用品", "时间日期", "交通工具", "国籍职业"]
    
    for category in key_categories:
        print(f"\n{category}示例:")
        examples = []
        
        for lesson_num in range(1, 26):
            filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
            
            if not os.path.exists(filename):
                continue
            
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                for row in reader:
                    if row.get('栏目') == category and len(examples) < 5:
                        examples.append(f"第{lesson_num}课: {row['假名']}({row['释义']})")
        
        for example in examples:
            print(f"  {example}")

if __name__ == "__main__":
    manual_adjustments()
    generate_final_report()
    show_category_examples()
