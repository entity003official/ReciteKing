#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import os

def main():
    # 读取 Excel 文件
    df = pd.read_excel('minanonihongo_words.xls')
    
    # 输出到文本文件以便查看
    with open('excel_content.txt', 'w', encoding='utf-8') as f:
        f.write("Excel 文件内容分析\n")
        f.write("=" * 50 + "\n\n")
        
        # 写入前100行数据
        for i in range(min(100, len(df))):
            row = df.iloc[i]
            col1 = str(row.iloc[0]) if pd.notna(row.iloc[0]) else "None"
            col2 = str(row.iloc[1]) if pd.notna(row.iloc[1]) else "None"
            col3 = str(row.iloc[2]) if pd.notna(row.iloc[2]) else "None"
            col4 = str(row.iloc[3]) if pd.notna(row.iloc[3]) else "None"
            col5 = str(row.iloc[4]) if pd.notna(row.iloc[4]) else "None"
            
            f.write(f"行 {i}: [{col1}] [{col2}] [{col3}] [{col4}] [{col5}]\n")
        
        f.write("\n\n课程分割线查找:\n")
        f.write("=" * 30 + "\n")
        
        # 查找可能的课程分割
        for i in range(len(df)):
            row = df.iloc[i]
            col1 = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ""
            
            # 查找包含数字或课程相关的行
            if any(keyword in col1 for keyword in ["大家日语", "第", "课", "01", "02", "03", "04", "05"]):
                f.write(f"行 {i}: {col1}\n")
    
    print("内容已输出到 excel_content.txt 文件")

if __name__ == "__main__":
    main()
