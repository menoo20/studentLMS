#!/usr/bin/env python3
"""
Find ALL missing marks by comparing current marks.json with all backup files
Identify patterns of data loss and restore everything that's missing
"""

import json
import glob
from datetime import datetime
from collections import defaultdict

def load_json_file(filepath):
    """Safely load a JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        return None

def find_all_missing_marks():
    """Compare current marks with all backups to find missing data"""
    print("🔍 COMPREHENSIVE SEARCH FOR ALL MISSING MARKS")
    print("="*70)
    
    # Load current marks
    current_marks = load_json_file('public/data/marks.json')
    if not current_marks:
        print("❌ Could not load current marks.json")
        return
    
    print(f"📊 Current marks.json has {len(current_marks)} entries")
    
    # Get current mark IDs for quick lookup
    current_mark_ids = set()
    current_student_exam_pairs = set()
    
    for mark in current_marks:
        mark_id = mark.get('id')
        student_id = mark.get('studentId')
        exam_id = mark.get('examId')
        
        if mark_id:
            current_mark_ids.add(mark_id)
        if student_id and exam_id:
            current_student_exam_pairs.add((student_id, exam_id))
    
    print(f"📋 Current unique student-exam pairs: {len(current_student_exam_pairs)}")
    
    # Find all backup files
    backup_files = glob.glob('public/data/marks_backup*.json')
    backup_files.sort(reverse=True)  # Most recent first
    
    print(f"\n💾 Found {len(backup_files)} backup files:")
    for bf in backup_files[:10]:  # Show first 10
        print(f"   - {bf}")
    if len(backup_files) > 10:
        print(f"   ... and {len(backup_files) - 10} more")
    
    # Analyze each backup to find missing marks
    all_missing_marks = []
    backup_analysis = {}
    
    print(f"\n🔍 ANALYZING BACKUP FILES:")
    print("-" * 50)
    
    for backup_file in backup_files:
        backup_data = load_json_file(backup_file)
        if not backup_data:
            continue
            
        backup_mark_ids = set()
        backup_student_exam_pairs = set()
        backup_missing = []
        
        for mark in backup_data:
            mark_id = mark.get('id')
            student_id = mark.get('studentId')
            exam_id = mark.get('examId')
            
            if mark_id:
                backup_mark_ids.add(mark_id)
            if student_id and exam_id:
                backup_student_exam_pairs.add((student_id, exam_id))
            
            # Check if this mark is missing from current
            if mark_id and mark_id not in current_mark_ids:
                backup_missing.append(mark)
            elif student_id and exam_id and (student_id, exam_id) not in current_student_exam_pairs:
                # Even if ID is different, same student-exam pair is missing
                backup_missing.append(mark)
        
        backup_analysis[backup_file] = {
            'total_marks': len(backup_data),
            'missing_from_current': len(backup_missing),
            'missing_marks': backup_missing
        }
        
        if backup_missing:
            print(f"📁 {backup_file.split('/')[-1]}")
            print(f"   Total marks: {len(backup_data)} | Missing from current: {len(backup_missing)}")
            
            # Show details of missing marks
            for mark in backup_missing[:5]:  # Show first 5
                student_id = mark.get('studentId', 'N/A')
                exam_id = mark.get('examId', 'N/A')
                score = mark.get('score', 'N/A')
                date = mark.get('createdAt', mark.get('date', 'N/A'))
                print(f"     • Student {student_id} | Exam: {exam_id.split('_')[-1] if '_' in str(exam_id) else exam_id} | Score: {score} | {date}")
            
            if len(backup_missing) > 5:
                print(f"     ... and {len(backup_missing) - 5} more missing marks")
            print()
            
            all_missing_marks.extend(backup_missing)
    
    # Remove duplicates from all_missing_marks
    unique_missing = []
    seen_pairs = set()
    
    for mark in all_missing_marks:
        student_id = mark.get('studentId')
        exam_id = mark.get('examId')
        score = mark.get('score')
        
        # Use student_id, exam_id, and score as unique identifier
        key = (student_id, exam_id, score)
        if key not in seen_pairs:
            seen_pairs.add(key)
            unique_missing.append(mark)
    
    print(f"📊 SUMMARY OF ANALYSIS:")
    print("-" * 30)
    print(f"Total backup files analyzed: {len(backup_files)}")
    print(f"Total missing mark entries found: {len(all_missing_marks)}")
    print(f"Unique missing marks (deduplicated): {len(unique_missing)}")
    
    return unique_missing, backup_analysis

def show_missing_marks_by_student(missing_marks):
    """Group missing marks by student and show details"""
    if not missing_marks:
        print("✅ No missing marks found!")
        return
    
    print(f"\n🎯 DETAILED BREAKDOWN OF {len(missing_marks)} MISSING MARKS:")
    print("="*70)
    
    # Load student names
    students_data = load_json_file('public/data/students.json')
    student_names = {}
    if students_data:
        student_names = {s.get('id'): s.get('name', 'Unknown') for s in students_data}
    
    # Group by student
    by_student = defaultdict(list)
    for mark in missing_marks:
        student_id = mark.get('studentId', 'Unknown')
        by_student[student_id].append(mark)
    
    for i, (student_id, marks) in enumerate(by_student.items(), 1):
        student_name = student_names.get(student_id, f'Student {student_id}')
        print(f"{i:2}. 👤 {student_name} (ID: {student_id})")
        print(f"    Missing {len(marks)} mark(s):")
        
        for j, mark in enumerate(marks, 1):
            exam_id = mark.get('examId', 'N/A')
            score = mark.get('score', 'N/A')
            max_score = mark.get('maxScore', 'N/A')
            date = mark.get('createdAt', mark.get('date', 'N/A'))
            
            # Simplify exam name
            exam_name = exam_id
            if 'exam_20250905' in str(exam_id):
                if 'nesma' in str(exam_id):
                    exam_name = "Nesma Exam (Today)"
                elif '162701' in str(exam_id):
                    exam_name = "Jolly Phonics (Today)"
                else:
                    exam_name = "Today's Exam"
            elif 'jp_groups123' in str(exam_id):
                exam_name = "Jolly Phonics (Old Format)"
            
            print(f"    {j}. 📝 {exam_name}")
            print(f"       Score: {score}/{max_score}")
            print(f"       Date: {date}")
        print()

def restore_missing_marks(missing_marks):
    """Restore the missing marks to current marks.json"""
    if not missing_marks:
        print("ℹ️  No marks to restore.")
        return 0
    
    print(f"\n🔧 RESTORING {len(missing_marks)} MISSING MARKS:")
    print("-" * 50)
    
    # Load current marks
    current_marks = load_json_file('public/data/marks.json')
    if not current_marks:
        print("❌ Could not load current marks.json")
        return 0
    
    # Create backup before restoring
    backup_timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f'public/data/marks_backup_before_mass_restore_{backup_timestamp}.json'
    
    try:
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(current_marks, f, ensure_ascii=False, indent=2)
        print(f"💾 Created backup: {backup_file}")
    except Exception as e:
        print(f"❌ Could not create backup: {e}")
        return 0
    
    # Add missing marks
    restored_marks = current_marks + missing_marks
    
    # Ensure proper formatting for new marks
    for mark in missing_marks:
        if 'percentage' not in mark and mark.get('score') and mark.get('maxScore'):
            mark['percentage'] = round((mark['score'] / mark['maxScore'] * 100), 1)
        if 'createdAt' not in mark:
            mark['createdAt'] = mark.get('date', '2025-09-05T18:00:00.000000')
    
    # Save restored marks
    try:
        with open('public/data/marks.json', 'w', encoding='utf-8') as f:
            json.dump(restored_marks, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Successfully restored {len(missing_marks)} marks!")
        print(f"📊 marks.json: {len(current_marks)} → {len(restored_marks)} entries")
        return len(missing_marks)
        
    except Exception as e:
        print(f"❌ Error saving restored marks: {e}")
        return 0

def main():
    # Find all missing marks
    missing_marks, backup_analysis = find_all_missing_marks()
    
    # Show detailed breakdown
    show_missing_marks_by_student(missing_marks)
    
    # Ask user if they want to restore
    if missing_marks:
        print("="*70)
        print("🤔 WOULD YOU LIKE TO RESTORE ALL MISSING MARKS?")
        print(f"This will add {len(missing_marks)} missing marks back to marks.json")
        print("(A backup will be created before restoration)")
        
        # For automation, let's just restore them
        print("\n🔧 Proceeding with automatic restoration...")
        restored_count = restore_missing_marks(missing_marks)
        
        if restored_count > 0:
            print(f"\n🎉 SUCCESS! Restored {restored_count} missing marks!")
            print("Check your web interface - all missing students should now appear!")
        else:
            print("\n❌ Restoration failed.")
    
    else:
        print("✅ Great! No missing marks found. All data is intact.")

if __name__ == "__main__":
    main()
