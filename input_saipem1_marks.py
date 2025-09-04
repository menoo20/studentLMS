#!/usr/bin/env python3
"""
SAIPEM1 JP Groups 1,2,3 Exam Marks Input Script
This script will prompt you to enter marks for each SAIPEM1 student
for the JP group1,2,3 exam (out of 16 marks)
"""

import json
import os
from datetime import datetime

def load_json_file(filepath):
    """Load JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filepath} not found!")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {filepath}")
        return None

def save_json_file(filepath, data):
    """Save JSON file with proper formatting"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def get_student_mark(student_name, student_id):
    """Get mark for a specific student"""
    while True:
        print(f"\n📝 Student: {student_name}")
        print(f"   ID: {student_id}")
        mark_input = input("   Enter mark (0-16) or 'N/A' if not taken: ").strip()
        
        if mark_input.upper() == 'N/A':
            return 'N/A'
        
        try:
            mark = float(mark_input)
            if 0 <= mark <= 16:
                return mark
            else:
                print("   ❌ Mark must be between 0 and 16!")
        except ValueError:
            print("   ❌ Please enter a valid number or 'N/A'!")

def main():
    # Setup paths
    base_path = "public/data"
    students_path = os.path.join(base_path, "students.json")
    marks_path = os.path.join(base_path, "marks.json")
    
    print("🎓 SAIPEM1 - JP Groups 1,2,3 Exam Marks Input")
    print("=" * 50)
    
    # Load students data
    students_data = load_json_file(students_path)
    if not students_data:
        return
    
    # Load existing marks data
    marks_data = load_json_file(marks_path)
    if not marks_data:
        return
    
    # Filter SAIPEM1 students
    saipem1_students = [s for s in students_data if s.get('groupId') == 'saipem1']
    
    if not saipem1_students:
        print("❌ No SAIPEM1 students found!")
        return
    
    print(f"📊 Found {len(saipem1_students)} SAIPEM1 students")
    print("📝 Exam: JP group1,2,3 (Max: 16 marks)")
    print("💡 Enter 'N/A' for students who haven't taken the exam yet")
    print("\n" + "=" * 50)
    
    # Get confirmation
    confirm = input("Ready to start? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Cancelled!")
        return
    
    # Collect marks
    new_marks = []
    exam_id = "jp_groups123_saipem1"
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Get next mark ID
    existing_mark_ids = [int(m['id'].replace('m', '')) for m in marks_data if m['id'].startswith('m')]
    next_mark_id = max(existing_mark_ids) + 1 if existing_mark_ids else 1
    
    for i, student in enumerate(saipem1_students, 1):
        print(f"\n[{i}/{len(saipem1_students)}]", end="")
        mark = get_student_mark(student['name'], student.get('studentId', student['id']))
        
        new_mark = {
            "id": f"m{next_mark_id}",
            "studentId": student['id'],
            "examId": exam_id,
            "score": mark,
            "date": today
        }
        
        new_marks.append(new_mark)
        next_mark_id += 1
    
    # Add new marks to existing data
    marks_data.extend(new_marks)
    
    # Save updated marks
    if save_json_file(marks_path, marks_data):
        print(f"\n✅ Successfully saved {len(new_marks)} marks!")
        
        # Show summary
        scored_students = [m for m in new_marks if m['score'] != 'N/A']
        na_students = [m for m in new_marks if m['score'] == 'N/A']
        
        print(f"\n📈 Summary:")
        print(f"   • Students with scores: {len(scored_students)}")
        print(f"   • Students with N/A: {len(na_students)}")
        
        if scored_students:
            avg_score = sum(m['score'] for m in scored_students) / len(scored_students)
            print(f"   • Average score: {avg_score:.1f}/16")
        
    else:
        print("\n❌ Failed to save marks!")

if __name__ == "__main__":
    main()
