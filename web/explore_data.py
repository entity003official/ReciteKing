#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json

def explore_data():
    """探索数据结构"""
    df = pd.read_excel('minanonihongo_words.xls')
    
    print("前20行原始数据:")
    for i in range(min(20, len(df))):
        row = df.iloc[i]
        col1 = str(row.iloc[0]) if pd.notna(row.iloc[0]) else "None"
        col2 = str(row.iloc[1]) if pd.notna(row.iloc[1]) else "None"
        col3 = str(row.iloc[2]) if pd.notna(row.iloc[2]) else "None"
        print(f"行 {i}: [{col1[:30]}] [{col2[:20]}] [{col3[:20]}]")
    
    print("\n查找课程标记:")
    for i in range(len(df)):
        row = df.iloc[i]
        col1 = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ""
        if "大家日语" in col1 and ("_" in col1 or "第" in col1 or "01" in col1):
            print(f"行 {i}: {col1}")
    
    print("\n查找数字课程:")
    for i in range(len(df)):
        row = df.iloc[i]
        col1 = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ""
        if col1.isdigit() or (len(col1) <= 3 and any(c.isdigit() for c in col1)):
            col2 = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ""
            col3 = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ""
            print(f"行 {i}: [{col1}] [{col2}] [{col3}]")

if __name__ == "__main__":
    explore_data()
