#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
词汇清理验证脚本
验证所有的括号和省略号模式是否已正确清理
"""

import pandas as pd
import os
import re

def verify_vocabulary_cleaning():
    """验证词汇清理结果"""
    print("开始验证词汇清理结果...")
    print("=" * 60)
    
    # 定义需要检查的目录
    vocab_dir = r'e:\work\2025_8_24ReciteKing\web\data\vocabulary'
    
    if not os.path.exists(vocab_dir):
        print(f"目录不存在: {vocab_dir}")
        return
    
    issues_found = []
    cleaned_entries = []
    
    # 检查所有lesson文件
    for i in range(1, 26):  # lesson 1-25
        filename = f"lesson_{i:02d}_vocabulary.csv"
        file_path = os.path.join(vocab_dir, filename)
        
        if not os.path.exists(file_path):
            continue
        
        try:
            df = pd.read_csv(file_path, encoding='utf-8')
        except:
            continue
        
        print(f"\n检查文件: {filename}")
        print("-" * 40)
        
        for index, row in df.iterrows():
            if len(row) >= 3:
                kana_reading = str(row.iloc[2])  # 假名读音列
                kanji_reading = str(row.iloc[3]) if len(row) >= 4 else ""  # 汉字列
                meaning = str(row.iloc[4]) if len(row) >= 5 else ""  # 释义列
                
                # 检查是否还有未清理的模式
                if '…' in kana_reading and '（' in kana_reading:
                    issues_found.append({
                        'file': filename,
                        'row': index + 1,
                        'kana': kana_reading,
                        'kanji': kanji_reading,
                        'meaning': meaning,
                        'issue': '假名中仍有未清理的省略号和括号'
                    })
                
                # 检查是否包含多答案分隔符
                if '|' in kana_reading:
                    variants = kana_reading.split('|')
                    cleaned_entries.append({
                        'file': filename,
                        'row': index + 1,
                        'original_kana': kana_reading,
                        'variants': variants,
                        'kanji': kanji_reading,
                        'meaning': meaning
                    })
                    print(f"  ✅ 第{index+1}行: {kana_reading} -> 支持多答案: {', '.join(variants)}")
                
                # 检查汉字列中的省略号
                if '…' in kanji_reading:
                    print(f"  📝 第{index+1}行: 汉字中包含省略号: {kanji_reading}")
    
    # 输出验证结果
    print("\n" + "=" * 60)
    print("验证结果汇总")
    print("=" * 60)
    
    if issues_found:
        print(f"⚠️ 发现 {len(issues_found)} 个未完全清理的条目:")
        for issue in issues_found:
            print(f"  {issue['file']} 第{issue['row']}行: {issue['kana']} ({issue['meaning']})")
    else:
        print("✅ 所有有问题的假名读音均已清理完毕！")
    
    if cleaned_entries:
        print(f"\n✅ 成功清理并支持多答案的条目: {len(cleaned_entries)} 个")
        unique_patterns = set()
        for entry in cleaned_entries:
            pattern = ' | '.join(entry['variants'])
            unique_patterns.add(pattern)
        
        print("支持的多答案模式:")
        for pattern in sorted(unique_patterns):
            print(f"  • {pattern}")
    
    # 保存验证报告
    with open("词汇清理验证报告.txt", 'w', encoding='utf-8') as f:
        f.write("词汇清理验证报告\n")
        f.write("=" * 50 + "\n\n")
        
        if issues_found:
            f.write(f"未完全清理的条目 ({len(issues_found)} 个):\n")
            f.write("-" * 30 + "\n")
            for issue in issues_found:
                f.write(f"{issue['file']} 第{issue['row']}行:\n")
                f.write(f"  假名: {issue['kana']}\n")
                f.write(f"  汉字: {issue['kanji']}\n")
                f.write(f"  释义: {issue['meaning']}\n")
                f.write(f"  问题: {issue['issue']}\n\n")
        else:
            f.write("✅ 所有有问题的假名读音均已清理完毕！\n\n")
        
        if cleaned_entries:
            f.write(f"支持多答案的条目 ({len(cleaned_entries)} 个):\n")
            f.write("-" * 30 + "\n")
            for entry in cleaned_entries:
                f.write(f"{entry['file']} 第{entry['row']}行:\n")
                f.write(f"  假名变体: {' | '.join(entry['variants'])}\n")
                f.write(f"  汉字: {entry['kanji']}\n")
                f.write(f"  释义: {entry['meaning']}\n\n")
    
    print(f"\n详细验证报告已保存到: 词汇清理验证报告.txt")
    
    return len(issues_found) == 0, len(cleaned_entries)

def main():
    """主函数"""
    success, cleaned_count = verify_vocabulary_cleaning()
    
    print(f"\n{'✅ 验证通过' if success else '❌ 验证失败'}")
    print(f"支持多答案的词汇数量: {cleaned_count}")
    
    if success:
        print("\n🎉 所有需要清理的词汇已正确处理！")
        print("💡 建议:")
        print("  1. 测试word-practice.html中的多答案验证功能")
        print("  2. 验证用户输入'ふん'或'ぷん'都能正确识别")
        print("  3. 检查其他多答案词汇的验证效果")
    else:
        print("\n⚠️ 仍有部分词汇需要手动处理，请查看验证报告")

if __name__ == "__main__":
    main()
