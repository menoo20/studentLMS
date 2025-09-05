#!/usr/bin/env python3
"""
Search for محمد ناصر marks in all data files
Check students.json and marks.json for any reference to this student
"""

import json
from datetime import datetime

def search_student_data():
    """Search for محمد ناصر in students and marks data"""
    print("🔍 SEARCHING FOR محمد ناصر")
    print("="*60)
    
    # Search in students.json
    print("📚 SEARCHING IN STUDENTS.JSON:")
    print("-" * 40)
    try:
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            students = json.load(f)
        
        found_students = []
        for student in students:
            name = student.get('name', '').strip()
            student_id = student.get('id', '').strip()
            
            # Search for محمد ناصر or variations
            if 'محمد' in name and 'ناصر' in name:
                found_students.append({
                    'id': student_id,
                    'name': name,
                    'group': student.get('group', 'N/A'),
                    'student': student
                })
                print(f"✅ FOUND: {name}")
                print(f"   ID: {student_id}")
                print(f"   Group: {student.get('group', 'N/A')}")
                print()
        
        if not found_students:
            print("❌ No student found with name containing 'محمد' and 'ناصر'")
            
            # Let's search for just محمد or just ناصر
            print("\n🔍 Searching for students with 'محمد' OR 'ناصر':")
            for student in students:
                name = student.get('name', '').strip()
                if 'محمد' in name or 'ناصر' in name:
                    print(f"   - {name} (ID: {student.get('id', 'N/A')})")
        
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error reading students.json: {e}")
        return []
    
    # Search in marks.json
    print("\n📊 SEARCHING IN MARKS.JSON:")
    print("-" * 40)
    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            marks = json.load(f)
        
        found_marks = []
        
        # If we found students, search for their marks
        if found_students:
            for found_student in found_students:
                student_id = found_student['id']
                student_marks = [mark for mark in marks if mark.get('studentId') == student_id]
                
                if student_marks:
                    print(f"✅ FOUND MARKS for {found_student['name']} (ID: {student_id}):")
                    for mark in student_marks:
                        exam_id = mark.get('examId', 'N/A')
                        score = mark.get('score', 'N/A')
                        max_score = mark.get('maxScore', 'N/A')
                        percentage = mark.get('percentage', 'N/A')
                        date = mark.get('createdAt', mark.get('date', 'N/A'))
                        
                        print(f"   📝 Exam: {exam_id}")
                        print(f"      Score: {score}/{max_score} ({percentage}%)")
                        print(f"      Date: {date}")
                        print()
                    found_marks.extend(student_marks)
                else:
                    print(f"❌ NO MARKS FOUND for {found_student['name']} (ID: {student_id})")
        else:
            print("❌ No student found to search marks for")
            
        # Also search marks by student name in case it's stored there
        print("\n🔍 Searching marks by student name (in case name is stored in marks):")
        for mark in marks:
            student_name = mark.get('studentName', '')
            student_id = mark.get('studentId', '')
            if 'محمد' in student_name and 'ناصر' in student_name:
                print(f"✅ Found mark with student name: {student_name}")
                print(f"   Student ID: {student_id}")
                print(f"   Exam: {mark.get('examId', 'N/A')}")
                print(f"   Score: {mark.get('score', 'N/A')}")
                
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error reading marks.json: {e}")
    
    # Search in backup files
    print("\n💾 SEARCHING IN BACKUP FILES:")
    print("-" * 40)
    
    import glob
    backup_files = glob.glob('public/data/*backup*.json') + glob.glob('backup_*/*.json')
    
    for backup_file in backup_files:
        print(f"🔍 Checking {backup_file}...")
        try:
            with open(backup_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            # Check if it's marks data
            if isinstance(backup_data, list) and backup_data and 'studentId' in str(backup_data[0]):
                for mark in backup_data:
                    student_id = mark.get('studentId', '')
                    student_name = mark.get('studentName', '')
                    if ('محمد' in student_name and 'ناصر' in student_name) or any(
                        student_id == fs['id'] for fs in found_students
                    ):
                        print(f"✅ Found in backup: {backup_file}")
                        print(f"   Student: {student_name or student_id}")
                        print(f"   Exam: {mark.get('examId', 'N/A')}")
                        print(f"   Score: {mark.get('score', 'N/A')}")
                        
        except (FileNotFoundError, json.JSONDecodeError) as e:
            continue
    
    return found_students, found_marks

def main():
    found_students, found_marks = search_student_data()
    
    print("\n" + "="*60)
    print("📋 SUMMARY:")
    print(f"   Students found: {len(found_students)}")
    print(f"   Mark entries found: {len(found_marks)}")
    
    if not found_students:
        print("\n🤔 POSSIBLE REASONS:")
        print("   1. Student name might be spelled differently")
        print("   2. Student might not be in the database yet")
        print("   3. Student might be in a different group file")
        print("   4. Name might have extra spaces or characters")
        print("\n💡 SUGGESTION:")
        print("   Let me show you recent students from today's evaluations...")
        
        # Show recent marks from today
        try:
            with open('public/data/marks.json', 'r', encoding='utf-8') as f:
                marks = json.load(f)
            
            today_marks = [mark for mark in marks if '2025-09-05' in mark.get('createdAt', '')]
            if today_marks:
                print(f"\n📅 TODAY'S EVALUATIONS ({len(today_marks)} entries):")
                student_ids = list(set(mark.get('studentId') for mark in today_marks))
                
                # Get student names for these IDs
                with open('public/data/students.json', 'r', encoding='utf-8') as f:
                    students = json.load(f)
                
                student_lookup = {s.get('id'): s.get('name', 'Unknown') for s in students}
                
                for sid in student_ids:
                    student_name = student_lookup.get(sid, f"Student ID: {sid}")
                    print(f"   - {student_name}")
                
        except Exception as e:
            print(f"   Error checking today's marks: {e}")

if __name__ == "__main__":
    main()
