#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
词汇清理脚本 - 处理带括号和省略号的单词
清理诸如 ...ふん（...ぷん）的模式，设置为两种答案都可以接受
"""

import pandas as pd
import os
import re
import shutil
from datetime import datetime

def clean_vocabulary_entry(kana_reading):
    """
    清理带有括号和省略号的假名读音
    例如: ...ふん（...ぷん） -> 创建两个可能的答案: ふん, ぷん
    """
    # 移除开头的省略号
    cleaned = re.sub(r'^…+', '', kana_reading)
    
    # 处理带括号的情况，如: ふん（ぷん）
    if '（' in cleaned and '）' in cleaned:
        # 提取括号外和括号内的内容
        main_part = re.sub(r'（.*?）', '', cleaned)
        bracket_content = re.search(r'（(.*?)）', cleaned)
        
        if bracket_content:
            bracket_part = bracket_content.group(1)
            # 移除括号内容开头的省略号
            bracket_part = re.sub(r'^…+', '', bracket_part)
            
            # 返回两个可能的答案
            return [main_part.strip(), bracket_part.strip()]
    
    # 如果没有括号，只是移除省略号
    return [cleaned.strip()]

def process_vocabulary_file(file_path):
    """处理单个词汇文件"""
    print(f"正在处理文件: {file_path}")
    
    # 备份原文件
    backup_path = file_path + '.backup'
    shutil.copy2(file_path, backup_path)
    print(f"已备份原文件到: {backup_path}")
    
    # 读取CSV文件
    try:
        df = pd.read_csv(file_path, encoding='utf-8')
    except:
        try:
            df = pd.read_csv(file_path, encoding='gbk')
        except:
            print(f"无法读取文件: {file_path}")
            return
    
    changes_made = []
    
    # 检查每一行的假名读音列（通常是第3列，索引为2）
    for index, row in df.iterrows():
        if len(row) >= 3:
            kana_reading = str(row.iloc[2])  # 假名读音列
            
            # 检查是否包含需要清理的模式
            if '…' in kana_reading or '（' in kana_reading:
                original_kana = kana_reading
                cleaned_variants = clean_vocabulary_entry(kana_reading)
                
                if len(cleaned_variants) > 1:
                    # 如果有多个变体，创建一个包含所有可能答案的字符串
                    # 使用特殊分隔符来表示多个可能的答案
                    new_kana = '|'.join(cleaned_variants)
                    df.iloc[index, 2] = new_kana
                    
                    changes_made.append({
                        'row': index + 1,
                        'original': original_kana,
                        'cleaned': new_kana,
                        'variants': cleaned_variants
                    })
                elif len(cleaned_variants) == 1 and cleaned_variants[0] != original_kana:
                    # 单个变体但有变化
                    df.iloc[index, 2] = cleaned_variants[0]
                    changes_made.append({
                        'row': index + 1,
                        'original': original_kana,
                        'cleaned': cleaned_variants[0],
                        'variants': cleaned_variants
                    })
    
    # 保存清理后的文件
    if changes_made:
        df.to_csv(file_path, index=False, encoding='utf-8')
        print(f"文件已更新: {file_path}")
        
        # 打印变更详情
        for change in changes_made:
            print(f"  第{change['row']}行: '{change['original']}' -> '{change['cleaned']}'")
            if len(change['variants']) > 1:
                print(f"    可接受的答案: {', '.join(change['variants'])}")
    else:
        print(f"文件无需修改: {file_path}")
        # 删除不必要的备份
        os.remove(backup_path)
    
    return changes_made

def update_word_typing_js():
    """更新word-typing.js以支持多个可能的答案"""
    js_file_path = r'e:\work\2025_8_24ReciteKing\web\word-typing.js'
    
    if not os.path.exists(js_file_path):
        print(f"未找到word-typing.js文件: {js_file_path}")
        return
    
    print(f"正在更新 {js_file_path} 以支持多答案验证...")
    
    # 读取现有内容
    with open(js_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找验证答案的函数
    # 需要修改答案验证逻辑来支持用"|"分隔的多个答案
    validation_function = '''
    // 验证用户输入的答案
    function validateAnswer(userInput, correctAnswer) {
        // 清理用户输入
        const cleanInput = userInput.trim().toLowerCase();
        
        // 处理多个可能的答案（用|分隔）
        const possibleAnswers = correctAnswer.split('|').map(answer => answer.trim().toLowerCase());
        
        // 检查用户输入是否匹配任何一个可能的答案
        return possibleAnswers.includes(cleanInput);
    }
    '''
    
    # 如果文件中没有这个函数，添加它
    if 'function validateAnswer' not in content:
        # 在文件开头添加验证函数
        content = validation_function + '\n\n' + content
        
        with open(js_file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("已添加多答案验证功能到word-typing.js")
    else:
        print("word-typing.js已包含答案验证功能")

def main():
    """主函数"""
    print("开始清理词汇文件...")
    print("=" * 60)
    
    # 定义词汇文件目录
    vocab_dirs = [
        r'e:\work\2025_8_24ReciteKing\data\vocabulary',
        r'e:\work\2025_8_24ReciteKing\web\data\vocabulary'
    ]
    
    all_changes = {}
    
    for vocab_dir in vocab_dirs:
        if not os.path.exists(vocab_dir):
            print(f"目录不存在: {vocab_dir}")
            continue
            
        print(f"\n处理目录: {vocab_dir}")
        print("-" * 50)
        
        # 处理所有lesson_XX_vocabulary.csv文件
        for i in range(1, 26):  # lesson 1-25
            filename = f"lesson_{i:02d}_vocabulary.csv"
            file_path = os.path.join(vocab_dir, filename)
            
            if os.path.exists(file_path):
                changes = process_vocabulary_file(file_path)
                if changes:
                    all_changes[file_path] = changes
    
    # 更新JavaScript文件以支持多答案
    update_word_typing_js()
    
    # 生成清理报告
    print("\n" + "=" * 60)
    print("清理完成报告")
    print("=" * 60)
    
    if all_changes:
        print(f"共处理了 {len(all_changes)} 个文件，发现需要清理的词汇:")
        total_changes = 0
        
        for file_path, changes in all_changes.items():
            total_changes += len(changes)
            print(f"\n文件: {os.path.basename(file_path)}")
            for change in changes:
                print(f"  第{change['row']}行: {change['original']} -> {change['cleaned']}")
                if len(change['variants']) > 1:
                    print(f"    支持的答案: {', '.join(change['variants'])}")
        
        print(f"\n总共清理了 {total_changes} 个词汇条目")
        
        # 保存清理报告
        report_file = f"词汇清理报告_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("词汇清理报告\n")
            f.write("=" * 50 + "\n")
            f.write(f"清理时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"处理文件数: {len(all_changes)}\n")
            f.write(f"清理词汇数: {total_changes}\n\n")
            
            for file_path, changes in all_changes.items():
                f.write(f"\n文件: {os.path.basename(file_path)}\n")
                f.write("-" * 30 + "\n")
                for change in changes:
                    f.write(f"第{change['row']}行:\n")
                    f.write(f"  原始: {change['original']}\n")
                    f.write(f"  清理: {change['cleaned']}\n")
                    if len(change['variants']) > 1:
                        f.write(f"  可接受答案: {', '.join(change['variants'])}\n")
                    f.write("\n")
        
        print(f"\n详细报告已保存到: {report_file}")
    else:
        print("未发现需要清理的词汇")
    
    print("\n清理完成！")

if __name__ == "__main__":
    main()
