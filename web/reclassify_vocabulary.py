#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os
import re

def get_detailed_category(lesson_num, kana, kanji, meaning, word_type):
    """根据课程和单词内容确定详细分类"""
    
    # 寒暄语专门分类
    if word_type == "寒暄语":
        return "寒暄语"
    
    # 判断是否为寒暄语（更全面的判断）
    greeting_keywords = [
        '失礼', '请', '谢谢', '对不起', '欢迎', '光临', '不好意思', '打扰',
        '初次见面', '请多关照', '早上好', '您好', '再见', '晚上好',
        'どうぞ', 'ありがとう', 'すみません', 'いらっしゃい', 'はじめまして',
        'よろしく', 'おはよう', 'こんにちは', 'こんばんは', 'さようなら'
    ]
    
    if any(keyword in meaning or keyword in kana for keyword in greeting_keywords):
        return "寒暄语"
    
    # 第五课特殊处理：月份和日期
    if lesson_num == 5:
        month_day_keywords = ['月', '日', '年', '今天', '明天', '昨天', '星期']
        if any(keyword in meaning for keyword in month_day_keywords):
            return "时间日期"
    
    # 物品分类（更详细）
    if word_type == "名词" or word_type == "外来词":
        # 学习用品
        study_items = ['本', '辞書', '雑誌', '新聞', 'ノート', '手帳', '名刺', 'カード', 
                      '鉛筆', 'ボールペン', '书', '词典', '杂志', '报纸', '笔记本', 
                      '手册', '名片', '卡片', '铅笔', '圆珠笔', '自动铅笔']
        if any(item in kana or item in kanji or item in meaning for item in study_items):
            return "学习用品"
        
        # 电子产品
        electronics = ['テレビ', 'ラジオ', 'カメラ', 'コンピューター', 'ビデオ', 
                      'テープレコーダー', 'テープ', '电视', '收音机', '照相机', 
                      '电脑', '录影机', '录音机', '录音带']
        if any(item in kana or item in kanji or item in meaning for item in electronics):
            return "电子产品"
        
        # 食物饮品
        food_drinks = ['チョコレート', 'コーヒー', '巧克力', '咖啡', '茶', '水', 
                      '牛奶', '果汁', '啤酒', '酒', '面包', '米饭']
        if any(item in kana or item in kanji or item in meaning for item in food_drinks):
            return "食物饮品"
        
        # 服装
        clothing = ['コート', 'スーツ', 'セーター', '大衣', '外套', '西装', 
                   '毛衣', '衣服', '裤子', '鞋子', '帽子']
        if any(item in kana or item in kanji or item in meaning for item in clothing):
            return "服装用品"
        
        # 交通工具
        transport = ['電車', 'バス', 'タクシー', '自転車', '电车', '公车', '巴士', 
                    '出租车', '自行车', '脚踏车', '飞机', '船']
        if any(item in kana or item in kanji or item in meaning for item in transport):
            return "交通工具"
        
        # 场所地点
        places = ['学校', '会社', '家', '駅', '飛行場', 'デパート', 'スーパー', 
                 '喫茶店', 'レストラン', '公司', '车站', '机场', '百货', '超市', 
                 '咖啡店', '餐厅', '医院', '银行', '邮局']
        if any(place in kana or place in kanji or place in meaning for place in places):
            return "场所地点"
        
        # 国家城市
        countries = ['日本', '中国', '韩国', '美国', '英国', '法国', '德国', 
                    '东京', '大阪', '北京', '上海']
        if any(country in kana or country in kanji or country in meaning for country in countries):
            return "国家城市"
        
        # 人物称谓
        people = ['先生', '教師', '学生', '会社員', '銀行員', '医者', 'エンジニア',
                 '老师', '教师', '学生', '职员', '银行员', '医生', '工程师', '朋友']
        if any(person in kana or person in kanji or person in meaning for person in people):
            return "人物称谓"
    
    # 动词分类
    if "动词" in word_type:
        # 移动动词
        movement_verbs = ['いきます', 'きます', 'かえります', '行きます', '来ます', '帰ります',
                         '去', '来', '回家', '回去', '出发', '到达']
        if any(verb in kana or verb in kanji or verb in meaning for verb in movement_verbs):
            return "移动动词"
        
        # 基本动作
        basic_actions = ['たべます', 'のみます', 'みます', 'ききます', 'よみます',
                        '食べます', '飲みます', '見ます', '聞きます', '読みます',
                        '吃', '喝', '看', '听', '读']
        if any(action in kana or action in kanji or action in meaning for action in basic_actions):
            return "基本动作"
    
    # 时间相关
    time_words = ['時', '分', '年', '月', '日', '今', '昨', '明', '星期', 
                 '时间', '现在', '上午', '下午', '晚上']
    if any(time_word in kana or time_word in kanji or time_word in meaning for time_word in time_words):
        return "时间日期"
    
    # 数量词
    if word_type == "数词" or any(num in meaning for num in ['个', '只', '本', '张', '岁']):
        return "数量词"
    
    # 形容词
    if "形容词" in word_type:
        return "形容词"
    
    # 代词
    if word_type == "代词":
        return "代词"
    
    # 其他保持原有分类或使用词性
    return word_type

def reclassify_vocabulary():
    """重新分类所有词汇"""
    print("开始重新分类词汇...")
    
    updated_count = 0
    
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if not os.path.exists(filename):
            continue
            
        print(f"处理第 {lesson_num} 课...")
        
        # 读取现有数据
        updated_words = []
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                kana = row.get('假名', '')
                kanji = row.get('汉字', '')
                meaning = row.get('释义', '')
                word_type = row.get('词性', '')
                current_category = row.get('栏目', '')
                
                # 获取新的详细分类
                new_category = get_detailed_category(lesson_num, kana, kanji, meaning, word_type)
                
                # 更新栏目
                updated_row = row.copy()
                if new_category != word_type and new_category != current_category:
                    updated_row['栏目'] = new_category
                    updated_count += 1
                
                updated_words.append(updated_row)
        
        # 写回文件
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['课程', '栏目', '假名', '汉字', '释义', '词性']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_words)
        
        print(f"第 {lesson_num} 课: {len(updated_words)} 个单词")
    
    print(f"\n重新分类完成！共更新了 {updated_count} 个词汇的分类")

def generate_category_report():
    """生成分类报告"""
    print("\n生成分类统计报告...")
    
    category_stats = {}
    lesson_categories = {}
    
    for lesson_num in range(1, 26):
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        
        if not os.path.exists(filename):
            continue
        
        lesson_categories[lesson_num] = {}
        
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                category = row.get('栏目', '未分类')
                
                category_stats[category] = category_stats.get(category, 0) + 1
                lesson_categories[lesson_num][category] = lesson_categories[lesson_num].get(category, 0) + 1
    
    # 写入报告
    with open('分类统计报告.txt', 'w', encoding='utf-8') as f:
        f.write("词汇分类统计报告\n")
        f.write("=" * 40 + "\n\n")
        
        f.write("总体分类统计:\n")
        for category, count in sorted(category_stats.items(), key=lambda x: x[1], reverse=True):
            f.write(f"  {category}: {count} 个\n")
        
        f.write(f"\n各课程分类分布:\n")
        for lesson_num, categories in lesson_categories.items():
            f.write(f"\n第 {lesson_num} 课:\n")
            for category, count in sorted(categories.items()):
                f.write(f"  {category}: {count} 个\n")
    
    print("分类报告已生成到 '分类统计报告.txt'")

if __name__ == "__main__":
    reclassify_vocabulary()
    generate_category_report()
