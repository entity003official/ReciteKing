#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json

def analyze_excel_file():
    try:
        # 读取 Excel 文件
        df = pd.read_excel('minanonihongo_words.xls')
        
        print("=" * 50)
        print("Excel 文件分析")
        print("=" * 50)
        
        print(f"文件列名: {df.columns.tolist()}")
        print(f"总行数: {len(df)}")
        print(f"数据形状: {df.shape}")
        
        print("\n前10行数据:")
        print(df.head(10).to_string())
        
        print("\n" + "=" * 50)
        print("数据类型分析")
        print("=" * 50)
        print(df.dtypes)
        
        print("\n" + "=" * 50)
        print("各列的唯一值数量")
        print("=" * 50)
        for col in df.columns:
            print(f"{col}: {df[col].nunique()} 个唯一值")
        
        # 如果有课程列，显示课程分布
        if 'lesson' in df.columns or 'Lesson' in df.columns or '课程' in df.columns:
            lesson_col = None
            for col in df.columns:
                if 'lesson' in col.lower() or '课程' in col:
                    lesson_col = col
                    break
            
            if lesson_col:
                print(f"\n{lesson_col} 分布:")
                print(df[lesson_col].value_counts().sort_index())
        
        # 如果有词性列，显示词性分布
        for col in df.columns:
            if '词性' in col or 'type' in col.lower() or 'pos' in col.lower():
                print(f"\n{col} 分布:")
                print(df[col].value_counts())
                break
        
        print("\n" + "=" * 50)
        print("导出为 JSON 文件以便进一步分析")
        print("=" * 50)
        
        # 导出为 JSON
        df.to_json('minanonihongo_words.json', force_ascii=False, indent=2, orient='records')
        print("已导出为 minanonihongo_words.json")
        
        return df
        
    except Exception as e:
        print(f"读取文件时出错: {e}")
        return None

if __name__ == "__main__":
    df = analyze_excel_file()
