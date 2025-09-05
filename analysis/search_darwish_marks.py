#!/usr/bin/env python3
"""
Search for الدرويش marks in all data files
Check if الدرويش's evaluation is missing
"""

import json
import glob
from datetime import datetime

def search_darwish_marks():
    """Search for الدرويش in students and marks data"""
    print("🔍 SEARCHING FOR الدرويش")
    print("="*50)
    
    # Search in students.json
    print("📚 SEARCHING IN STUDENTS.JSON:")
    print("-" * 30)
    
    try:
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            students = json.load(f)
        
        found_students = []
        for student in students:
            name = student.get('name', '').strip()
            student_id = student.get('id', '').strip()
            
            # Search for الدرويش
            if 'الدرويش' in name:
                found_students.append({
                    'id': student_id,
                    'name': name,
                    'group': student.get('group', student.get('groupId', 'N/A')),
                    'student': student
                })
                print(f"✅ FOUND: {name}")
                print(f"   ID: {student_id}")
                print(f"   Group: {student.get('group', student.get('groupId', 'N/A'))}")
                print()
        
        if not found_students:
            print("❌ No student found with name containing 'الدرويش'")
            
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error reading students.json: {e}")
        return []
    
    # Search in current marks.json
    print("📊 SEARCHING IN CURRENT MARKS.JSON:")
    print("-" * 30)
    
    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            marks = json.load(f)
        
        found_current_marks = []
        
        if found_students:
            for found_student in found_students:
                student_id = found_student['id']
                student_marks = [mark for mark in marks if mark.get('studentId') == student_id]
                
                if student_marks:
                    print(f"✅ FOUND MARKS in CURRENT FILE for {found_student['name']} (ID: {student_id}):")
                    for mark in student_marks:
                        exam_id = mark.get('examId', 'N/A')
                        score = mark.get('score', 'N/A')
                        max_score = mark.get('maxScore', 'N/A')
                        percentage = mark.get('percentage', 'N/A')
                        date = mark.get('createdAt', mark.get('date', 'N/A'))
                        
                        # Simplify exam name for display
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
                        
                        print(f"   📝 {exam_name}")
                        print(f"      Score: {score}/{max_score} ({percentage}%)")
                        print(f"      Date: {date}")
                        print()
                    found_current_marks.extend(student_marks)
                else:
                    print(f"❌ NO CURRENT MARKS for {found_student['name']} (ID: {student_id})")
                    
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error reading current marks.json: {e}")
    
    # Search in backup files
    print("\n💾 SEARCHING IN BACKUP FILES:")
    print("-" * 30)
    
    backup_files = glob.glob('public/data/marks_backup*.json')
    backup_files.sort(reverse=True)  # Most recent first
    
    found_backup_marks = []
    backup_files_with_darwish = []
    
    for backup_file in backup_files[:15]:  # Check last 15 backups
        try:
            with open(backup_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            backup_marks_for_darwish = []
            for mark in backup_data:
                student_id = mark.get('studentId', '')
                # Check if this student ID matches any الدرويش students we found
                if any(student_id == fs['id'] for fs in found_students):
                    backup_marks_for_darwish.append(mark)
            
            if backup_marks_for_darwish:
                backup_files_with_darwish.append(backup_file)
                print(f"📁 Found in {backup_file.split('/')[-1]}:")
                for mark in backup_marks_for_darwish:
                    student_id = mark.get('studentId', '')
                    exam_id = mark.get('examId', 'N/A')
                    score = mark.get('score', 'N/A')
                    max_score = mark.get('maxScore', 'N/A')
                    percentage = mark.get('percentage', 'N/A')
                    date = mark.get('createdAt', mark.get('date', 'N/A'))
                    
                    # Get student name
                    student_name = next((fs['name'] for fs in found_students if fs['id'] == student_id), f'Student {student_id}')
                    
                    # Simplify exam name
                    exam_name = exam_id
                    if 'exam_20250905' in str(exam_id):
                        if 'nesma' in str(exam_id):
                            exam_name = "Nesma Exam"
                        elif '162701' in str(exam_id):
                            exam_name = "Jolly Phonics"
                        else:
                            exam_name = "Today's Exam"
                    
                    print(f"   📝 {student_name}")
                    print(f"      {exam_name}: {score}/{max_score} ({percentage}%)")
                    print(f"      Date: {date}")
                
                found_backup_marks.extend(backup_marks_for_darwish)
                print()
                
        except (FileNotFoundError, json.JSONDecodeError) as e:
            continue
    
    if not backup_files_with_darwish:
        print("❌ No backup files contain marks for الدرويش students")
    
    return found_students, found_current_marks, found_backup_marks

def analyze_missing_darwish_marks(found_students, current_marks, backup_marks):
    """Analyze what marks are missing for الدرويش students"""
    print("\n🎯 ANALYSIS FOR الدرويش STUDENTS:")
    print("="*50)
    
    if not found_students:
        print("❌ No الدرويش students found in database")
        return []
    
    missing_marks = []
    
    for student in found_students:
        student_id = student['id']
        student_name = student['name']
        
        print(f"\n👤 {student_name} (ID: {student_id})")
        print("-" * 50)
        
        # Current marks for this student
        current_student_marks = [mark for mark in current_marks if mark.get('studentId') == student_id]
        current_exam_ids = set(mark.get('examId') for mark in current_student_marks)
        
        print(f"📊 Current marks: {len(current_student_marks)}")
        if current_student_marks:
            for mark in current_student_marks:
                exam_id = mark.get('examId', 'N/A')
                score = mark.get('score', 'N/A')
                max_score = mark.get('maxScore', 'N/A')
                percentage = mark.get('percentage', 'N/A')
                print(f"   ✅ {exam_id}: {score}/{max_score} ({percentage}%)")
        else:
            print("   ❌ No current marks")
        
        # Backup marks for this student
        backup_student_marks = [mark for mark in backup_marks if mark.get('studentId') == student_id]
        
        print(f"\n💾 Backup marks found: {len(backup_student_marks)}")
        if backup_student_marks:
            # Find marks that are in backup but not in current
            for backup_mark in backup_student_marks:
                backup_exam_id = backup_mark.get('examId')
                backup_score = backup_mark.get('score')
                backup_max_score = backup_mark.get('maxScore', 'N/A')
                backup_percentage = backup_mark.get('percentage', 'N/A')
                backup_date = backup_mark.get('createdAt', backup_mark.get('date', 'N/A'))
                
                if backup_exam_id not in current_exam_ids:
                    print(f"   ❌ MISSING: {backup_exam_id}: {backup_score}/{backup_max_score} ({backup_percentage}%)")
                    print(f"      Date: {backup_date}")
                    missing_marks.append({
                        'student_name': student_name,
                        'student_id': student_id,
                        'mark': backup_mark
                    })
                else:
                    print(f"   ✅ EXISTS: {backup_exam_id}: {backup_score}")
        else:
            print("   ❌ No backup marks found either")
    
    return missing_marks

def restore_darwish_marks(missing_marks):
    """Restore missing marks for الدرويش students"""
    if not missing_marks:
        print("\n✅ No missing marks to restore for الدرويش students")
        return 0
    
    print(f"\n🔧 RESTORING {len(missing_marks)} MISSING MARKS FOR الدرويش:")
    print("-" * 60)
    
    try:
        # Load current marks
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            current_marks = json.load(f)
        
        original_count = len(current_marks)
        
        # Create backup before restoring
        backup_timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = f'public/data/marks_backup_before_darwish_restore_{backup_timestamp}.json'
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(current_marks, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Created backup: {backup_file}")
        
        # Add missing marks
        marks_to_add = [item['mark'] for item in missing_marks]
        restored_marks = current_marks + marks_to_add
        
        # Ensure proper formatting
        for mark in marks_to_add:
            if 'percentage' not in mark and mark.get('score') and mark.get('maxScore'):
                mark['percentage'] = round((mark['score'] / mark['maxScore'] * 100), 1)
            if 'createdAt' not in mark:
                mark['createdAt'] = mark.get('date', '2025-09-05T18:00:00.000000')
        
        # Save restored marks
        with open('public/data/marks.json', 'w', encoding='utf-8') as f:
            json.dump(restored_marks, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Successfully restored {len(marks_to_add)} marks for الدرويش students!")
        print(f"📊 Total marks: {original_count} → {len(restored_marks)}")
        
        # Show what was restored
        print(f"\n🎉 RESTORED MARKS:")
        for item in missing_marks:
            mark = item['mark']
            score = mark.get('score', 'N/A')
            max_score = mark.get('maxScore', 'N/A')
            percentage = mark.get('percentage', 'N/A')
            exam_id = mark.get('examId', 'N/A')
            
            # Simplify exam name
            exam_name = exam_id
            if 'exam_20250905' in str(exam_id):
                if 'nesma' in str(exam_id):
                    exam_name = "Nesma Exam"
                elif '162701' in str(exam_id):
                    exam_name = "Jolly Phonics"
                else:
                    exam_name = "Today's Exam"
            
            print(f"   ✅ {item['student_name']}")
            print(f"      {exam_name}: {score}/{max_score} ({percentage}%)")
        
        return len(marks_to_add)
        
    except Exception as e:
        print(f"❌ Error restoring marks: {e}")
        return 0

def main():
    print("🔍 COMPREHENSIVE SEARCH FOR الدرويش MARKS")
    print("="*60)
    
    # Search for الدرويش students and their marks
    found_students, current_marks, backup_marks = search_darwish_marks()
    
    # Analyze missing marks
    missing_marks = analyze_missing_darwish_marks(found_students, current_marks, backup_marks)
    
    # Restore if needed
    if missing_marks:
        print(f"\n🚨 FOUND {len(missing_marks)} MISSING MARKS FOR الدرويش!")
        restored_count = restore_darwish_marks(missing_marks)
        
        if restored_count > 0:
            print(f"\n🎉 SUCCESS! Restored {restored_count} missing marks for الدرويش students!")
            print("Check your web interface - الدرويش should now appear with their marks!")
        else:
            print(f"\n❌ Failed to restore marks for الدرويش students")
    else:
        print(f"\n✅ All marks for الدرويش students are already present!")
    
    print(f"\n📋 SUMMARY:")
    print(f"   الدرويش students found: {len(found_students)}")
    print(f"   Current marks: {len(current_marks)}")
    print(f"   Backup marks: {len(backup_marks)}")
    print(f"   Missing marks: {len(missing_marks)}")

if __name__ == "__main__":
    main()
