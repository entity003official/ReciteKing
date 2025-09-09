#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os
import re

def precise_reclassify():
    """精确重新分类所有词汇"""
    print("开始精确重新分类词汇...")
    
    # 定义每课程的详细分类规则
    lesson_rules = {
        1: {
            "寒暄语": ["しつれいですが", "はじめまして", "よろしく", "失礼", "初次见面", "请多关照"],
            "人称代词": ["わたし", "あなた", "あの人", "我", "你", "那个人"],
            "人物称谓": ["がくせい", "せんせい", "学生", "老师", "教师"],
            "国籍职业": ["ちゅうごくじん", "にほんじん", "かんこくじん", "アメリカじん", "エンジニア", "中国人", "日本人", "韩国人", "美国人", "工程师"],
            "基本表达": ["です", "ではありません", "は", "も", "～さん", "～ちゃん", "～くん"],
            "疑问词": ["だれ", "なん", "谁", "什么"]
        },
        2: {
            "寒暄语": ["どうぞ", "ありがとう", "请", "谢谢"],
            "指示代词": ["これ", "それ", "あれ", "この", "その", "あの", "这", "那"],
            "学习用品": ["ほん", "じしょ", "ざっし", "しんぶん", "ノート", "てちょう", "めいし", "カード", "えんぴつ", "ボールペン", "シャープペンシル", "かばん", "书", "词典", "杂志", "报纸", "笔记本", "名片", "铅笔", "圆珠笔", "自动铅笔", "书包"],
            "电子产品": ["テープ", "テープレコーダー", "テレビ", "ラジオ", "カメラ", "コンピューター", "录音带", "录音机", "电视", "收音机", "照相机", "电脑"],
            "日用品": ["かぎ", "とけい", "かさ", "钥匙", "钟表", "雨伞"],
            "食物饮品": ["チョコレート", "コーヒー", "巧克力", "咖啡"]
        },
        3: {
            "场所地点": ["ロビー", "トイレ", "エレベーター", "かいだん", "大厅", "厕所", "电梯", "楼梯"],
            "方位词": ["こちら", "そちら", "あちら", "どちら", "这边", "那边", "哪边"]
        },
        5: {
            "移动动词": ["いきます", "きます", "かえります", "去", "来", "回家"],
            "交通工具": ["でんしゃ", "バス", "タクシー", "じてんしゃ", "ひこうき", "ふね", "ちかてつ", "电车", "公车", "出租车", "自行车", "飞机", "船", "地下铁"],
            "场所地点": ["がっこう", "かいしゃ", "うち", "えき", "ひこうじょう", "デパート", "スーパー", "レストラン", "学校", "公司", "家", "车站", "机场", "百货", "超市", "餐厅"],
            "国家城市": ["にほん", "ちゅうごく", "かんこく", "アメリカ", "とうきょう", "おおさか", "きょうと", "日本", "中国", "韩国", "美国", "东京", "大阪", "京都"],
            "时间日期": ["らいしゅう", "らいげつ", "らいねん", "きょう", "あした", "きのう", "下周", "下月", "明年", "今天", "明天", "昨天", "月", "日", "年"]
        }
    }
    
    # 全局分类规则
    global_rules = {
        "寒暄语": ["失礼", "请", "谢谢", "对不起", "欢迎", "光临", "不好意思", "打扰", "初次见面", "请多关照", "早上好", "您好", "再见", "晚上好", "どうぞ", "ありがとう", "すみません", "いらっしゃい", "はじめまして", "よろしく"],
        "数量词": ["ひとつ", "ふたつ", "みっつ", "よっつ", "いつつ", "むっつ", "ななつ", "やっつ", "ここのつ", "とお", "ひとり", "ふたり", "一个", "两个", "三个", "四个", "五个", "六个", "七个", "八个", "九个", "十个", "一人", "二人", "岁"],
        "时间日期": ["時", "分", "年", "月", "日", "今", "昨", "明", "星期", "时间", "现在", "上午", "下午", "晚上", "～時", "～分", "いちがつ", "にがつ", "さんがつ", "しがつ", "ごがつ", "ろくがつ", "しちがつ", "はちがつ", "くがつ", "じゅうがつ", "じゅういちがつ", "じゅうにがつ"]
    }
    
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
                
                new_category = current_category  # 默认保持原分类
                
                # 首先检查该课程的特定规则
                if lesson_num in lesson_rules:
                    for category, keywords in lesson_rules[lesson_num].items():
                        if any(keyword in kana or keyword in kanji or keyword in meaning for keyword in keywords):
                            new_category = category
                            break
                
                # 然后检查全局规则
                if new_category == current_category:  # 如果没有找到特定分类
                    for category, keywords in global_rules.items():
                        if any(keyword in kana or keyword in kanji or keyword in meaning for keyword in keywords):
                            new_category = category
                            break
                
                # 特殊处理：确保寒暄语被正确分类
                if word_type == "寒暄语" or any(keyword in meaning for keyword in ["失礼", "请", "谢谢", "欢迎", "光临", "初次见面", "请多关照"]):
                    new_category = "寒暄语"
                
                # 更新栏目
                updated_row = row.copy()
                updated_row['栏目'] = new_category
                
                if new_category != current_category:
                    updated_count += 1
                
                updated_words.append(updated_row)
        
        # 写回文件
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['课程', '栏目', '假名', '汉字', '释义', '词性']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_words)
        
        print(f"第 {lesson_num} 课: {len(updated_words)} 个单词")
    
    print(f"\n精确重新分类完成！共更新了 {updated_count} 个词汇的分类")

def show_sample_results():
    """显示重新分类的示例结果"""
    print("\n显示重新分类示例...")
    
    sample_lessons = [1, 2, 5]
    
    for lesson_num in sample_lessons:
        filename = f"data/vocabulary/lesson_{lesson_num:02d}_vocabulary.csv"
        print(f"\n第 {lesson_num} 课分类示例:")
        
        categories = {}
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                category = row.get('栏目', '未分类')
                if category not in categories:
                    categories[category] = []
                categories[category].append(f"{row['假名']}({row['释义']})")
        
        for category, words in categories.items():
            print(f"  {category}: {len(words)} 个 - {', '.join(words[:3])}{'...' if len(words) > 3 else ''}")

if __name__ == "__main__":
    precise_reclassify()
    show_sample_results()
