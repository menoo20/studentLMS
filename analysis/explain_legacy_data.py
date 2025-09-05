#!/usr/bin/env python3
"""
Explain Legacy Data in Marks.json
Show what data is old/test data vs current real data
"""

import json
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
    print("🔍 EXPLAINING 'LEGACY DATA' IN MARKS.JSON")
    print("="*60)
    
    marks = load_marks()
    if not marks:
        return
    
    # Categorize marks by type
    categories = {
        "current_real_data": [],
        "legacy_test_data": [],
        "old_format_data": []
    }
    
    for mark in marks:
        mark_id = mark.get('id', '')
        student_id = mark.get('studentId', '')
        exam_id = mark.get('examId', '')
        date = mark.get('date', '')
        created_at = mark.get('createdAt', '')
        
        # Current real data - proper format with recent dates
        if created_at.startswith('2025-09-05') and 'exam_20250905' in exam_id:
            categories["current_real_data"].append(mark)
        # Legacy test data - simple IDs like s1, s2, exam1, exam2
        elif student_id in ['s1', 's2', 's3', 's4'] and exam_id in ['exam1', 'exam2']:
            categories["legacy_test_data"].append(mark)
        # Old format data - different naming conventions
        else:
            categories["old_format_data"].append(mark)
    
    print(f"📊 BREAKDOWN OF ALL {len(marks)} MARK ENTRIES:")
    print()
    
    # Show current real data
    print(f"✅ CURRENT REAL DATA ({len(categories['current_real_data'])} entries):")
    print("   These are the actual student evaluations you've done recently")
    print("-" * 50)
    for i, mark in enumerate(categories["current_real_data"], 1):
        print(f"{i:2}. Student: {mark.get('studentId', 'N/A')}")
        print(f"    Exam: {mark.get('examId', 'N/A')}")
        print(f"    Score: {mark.get('score', 'N/A')}/{mark.get('maxScore', 'N/A')} ({mark.get('percentage', 'N/A')}%)")
        print(f"    Date: {mark.get('createdAt', 'N/A')}")
        print()
    
    # Show legacy test data
    print(f"🧪 LEGACY TEST DATA ({len(categories['legacy_test_data'])} entries):")
    print("   These appear to be old test/sample data from system setup")
    print("-" * 50)
    for i, mark in enumerate(categories["legacy_test_data"], 1):
        print(f"{i:2}. Student: {mark.get('studentId', 'N/A')} | Exam: {mark.get('examId', 'N/A')} | Score: {mark.get('score', 'N/A')} | Date: {mark.get('date', 'N/A')}")
    
    print()
    
    # Show old format data
    print(f"📜 OLD FORMAT DATA ({len(categories['old_format_data'])} entries):")
    print("   These are from earlier versions or different naming conventions")
    print("-" * 50)
    for i, mark in enumerate(categories["old_format_data"], 1):
        student_id = mark.get('studentId', 'N/A')
        exam_id = mark.get('examId', 'N/A')
        score = mark.get('score', 'N/A')
        date = mark.get('date', 'N/A')
        created_at = mark.get('createdAt', 'N/A')
        
        # Try to identify what these are
        description = ""
        if student_id.startswith('n00'):
            description = " (Nesma group students)"
        elif exam_id == "placement_test":
            description = " (Old placement test format)"
        elif exam_id.startswith("jp_groups123"):
            description = " (Old Jolly Phonics format)"
        
        print(f"{i:2}. Student: {student_id} | Exam: {exam_id} | Score: {score}{description}")
        if created_at and created_at != 'N/A':
            print(f"    Created: {created_at}")
        elif date and date != 'N/A':
            print(f"    Date: {date}")
        print()
    
    print("="*60)
    print("💡 EXPLANATION OF 'LEGACY DATA':")
    print()
    print("🧪 LEGACY TEST DATA:")
    print("   - Student IDs like 's1', 's2', 's3', 's4'")
    print("   - Exam IDs like 'exam1', 'exam2'") 
    print("   - Dates from 2024 (old)")
    print("   - These look like sample/test data used during system setup")
    print()
    print("📜 OLD FORMAT DATA:")
    print("   - Different naming conventions used before")
    print("   - Examples: 'jp_groups123_saipem6' vs 'exam_20250905_162701_295c91e9'")
    print("   - 'placement_test' vs proper exam IDs")
    print("   - May include earlier student evaluations")
    print()
    print("✅ CURRENT REAL DATA:")
    print("   - Proper exam IDs with timestamps (exam_20250905_...)")
    print("   - Real student IDs from your actual student database")
    print("   - Recent dates (2025-09-05)")
    print("   - Complete metadata (maxScore, percentage, createdAt)")
    print()
    print("🎯 BOTTOM LINE:")
    print(f"   Out of {len(marks)} total marks:")
    print(f"   • {len(categories['current_real_data'])} are your current real student evaluations")
    print(f"   • {len(categories['legacy_test_data'])} are old test/sample data")
    print(f"   • {len(categories['old_format_data'])} are from earlier formats or systems")
    print()
    print("   The 'legacy' data doesn't affect your current work, but explains")
    print("   why the total count is higher than just your recent evaluations.")

if __name__ == "__main__":
    main()
