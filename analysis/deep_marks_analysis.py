#!/usr/bin/env python3
"""
Deep Analysis of Marks and Recent Changes
Check what marks should be there vs what actually exists
"""

import json
import os
from datetime import datetime

def load_marks():
    """Load marks from JSON file"""
    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            marks = json.load(f)
        return marks
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error loading marks: {e}")
        return []

def main():
    print("🔍 DEEP MARKS ANALYSIS - FINDING MISSING ENTRIES")
    print("="*60)
    
    marks = load_marks()
    if not marks:
        return
    
    print(f"📁 Current marks.json file:")
    print(f"   File size: {os.path.getsize('public/data/marks.json')} bytes")
    print(f"   Total entries: {len(marks)}")
    
    # Based on the terminal session, these students should have marks
    expected_students_with_marks = [
        "فارس نادر الدوسري",  # s374 - added 4.0/16.0 (25.0%) 
        "مهند احمد موسى النجعي", # s011 - added 5.0/16.0 (31.2%)
        "حسين محمد حسين البيشي", # s112 - added 5.0/16.0 (31.2%)  
        "راشد محمد يحي كليبي",  # s020 - added 8.0/16.0 (50.0%)
        "عبد الرحمن مساعد قصيري", # s019_new - added 11.0/16.0 (68.8%)
        "محمد عبدالعزيز راشد بوشوشه", # s010 - added 12.5/16.0 (78.1%)
        "جواد سعيد مهدي ال ناصر", # s019_new2 - added 14.5/16.0 (90.6%)
    ]
    
    # Look for recent Jolly Phonics marks (exam_20250905_162701_295c91e9)
    jolly_phonics_exam_id = "exam_20250905_162701_295c91e9"
    jolly_marks = [m for m in marks if m.get('examId') == jolly_phonics_exam_id]
    
    print(f"\n📊 JOLLY PHONICS EXAM MARKS ({jolly_phonics_exam_id}):")
    print(f"   Found {len(jolly_marks)} marks for Jolly Phonics exam")
    print("-" * 60)
    
    for i, mark in enumerate(jolly_marks, 1):
        student_id = mark.get('studentId', 'N/A')
        score = mark.get('score', 'N/A')
        max_score = mark.get('maxScore', 16.0)
        percentage = mark.get('percentage', 'N/A')
        created_at = mark.get('createdAt', 'N/A')
        
        print(f"{i:2}. Student: {student_id}")
        print(f"    Score: {score}/{max_score} ({percentage}%)")
        print(f"    Created: {created_at}")
        print()
    
    # Check for student IDs that should have marks based on terminal output
    expected_student_ids = [
        's374', 's011', 's112', 's020', 's019_new', 's010', 's019_new2'
    ]
    
    print(f"🔍 CHECKING EXPECTED STUDENT IDS:")
    print("-" * 40)
    
    for student_id in expected_student_ids:
        student_marks = [m for m in marks if m.get('studentId') == student_id]
        if student_marks:
            print(f"✅ {student_id}: {len(student_marks)} mark(s) found")
            for mark in student_marks:
                exam_id = mark.get('examId', 'N/A')[:30] + "..." if len(mark.get('examId', '')) > 30 else mark.get('examId', 'N/A')
                print(f"    └─ {mark.get('score', 'N/A')}/{mark.get('maxScore', 'N/A')} in {exam_id}")
        else:
            print(f"❌ {student_id}: NO MARKS FOUND!")
    
    # Check if there are any very recent marks (today)
    today = datetime.now().strftime('%Y-%m-%d')
    today_marks = [m for m in marks if m.get('date') == today or (m.get('createdAt', '').startswith('2025-09-05'))]
    
    print(f"\n📅 MARKS CREATED TODAY (2025-09-05):")
    print(f"   Found {len(today_marks)} marks created today")
    
    for mark in today_marks:
        created_time = mark.get('createdAt', 'N/A')
        if len(created_time) > 10:
            created_time = created_time[11:19]  # Extract time part
        
        print(f"   • {mark.get('studentId', 'N/A')} - {mark.get('score', 'N/A')}/{mark.get('maxScore', 'N/A')} at {created_time}")
    
    # Final count
    unique_students = len(set(m.get('studentId') for m in marks if m.get('studentId')))
    print(f"\n🎯 FINAL COUNT:")
    print(f"   Total unique students with marks: {unique_students}")
    
    if unique_students < 15:
        print(f"   ⚠️  This seems low based on the terminal session!")
        print(f"   💡 Possible issues:")
        print(f"      - Script didn't save properly") 
        print(f"      - File was overwritten")
        print(f"      - JSON parsing error occurred")
        print(f"      - Working in wrong directory")

if __name__ == "__main__":
    main()
