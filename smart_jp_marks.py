#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from difflib import SequenceMatcher

def similarity(a, b):
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def load_json(filename):
    """Load JSON file"""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filename, data):
    """Save JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def find_student_by_name(students, search_name):
    """Find student by name with fuzzy matching"""
    matches = []
    for student in students:
        similarity_score = similarity(student['name'], search_name)
        if similarity_score > 0.6:  # 60% similarity threshold
            matches.append((student, similarity_score))
    
    # Sort by similarity score (highest first)
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches

def get_next_mark_id(marks):
    """Get next available mark ID"""
    if not marks:
        return "jp_m1"
    
    # Find highest jp_m number
    jp_marks = [m for m in marks if m['id'].startswith('jp_m')]
    if not jp_marks:
        return "jp_m1"
    
    max_num = 0
    for mark in jp_marks:
        try:
            num = int(mark['id'].replace('jp_m', ''))
            max_num = max(max_num, num)
        except:
            pass
    
    return f"jp_m{max_num + 1}"

def main():
    try:
        # Load data files
        print("Loading student and exam data...")
        students = load_json('public/data/students.json')
        exams = load_json('public/data/exams.json')
        marks = load_json('public/data/marks.json')
        
        print("\n🎓 JP Groups 1,2,3 Mark Entry System")
        print("=" * 50)
        print("Enter student names to add their JP exam marks.")
        print("Type 'quit' to exit, 'list [group]' to see group students")
        
        while True:
            print("\n" + "─" * 50)
            student_name = input("\nEnter student name (or 'quit' to exit): ").strip()
            
            if student_name.lower() == 'quit':
                print("Goodbye! 👋")
                break
            
            if student_name.lower().startswith('list'):
                # List students in a group
                parts = student_name.split()
                if len(parts) > 1:
                    group_id = parts[1].lower()
                    group_students = [s for s in students if s.get('groupId', '').lower() == group_id]
                    if group_students:
                        print(f"\n📋 Students in {group_id.upper()}:")
                        for i, student in enumerate(group_students, 1):
                            print(f"{i:2d}. {student['name']} (ID: {student.get('studentId', 'N/A')})")
                    else:
                        print(f"❌ No students found in group '{group_id}'")
                else:
                    print("Usage: list [groupname] - e.g., 'list saipem6'")
                continue
            
            # Find matching students
            matches = find_student_by_name(students, student_name)
            
            if not matches:
                print(f"❌ No student found matching '{student_name}'")
                continue
            
            # Show matches
            print(f"\n🔍 Found {len(matches)} potential match(es):")
            for i, (student, score) in enumerate(matches[:5], 1):  # Show top 5 matches
                print(f"{i}. {student['name']} - Group: {student.get('groupId', 'N/A')} (Match: {score*100:.1f}%)")
            
            # Let user choose
            try:
                choice = input(f"\nSelect student (1-{min(5, len(matches))}) or 0 to skip: ").strip()
                if choice == '0':
                    continue
                
                choice_num = int(choice) - 1
                if choice_num < 0 or choice_num >= len(matches):
                    print("❌ Invalid choice")
                    continue
                
                selected_student = matches[choice_num][0]
                print(f"\n✅ Selected: {selected_student['name']}")
                print(f"   Group: {selected_student.get('groupId', 'N/A')}")
                print(f"   Student ID: {selected_student.get('studentId', 'N/A')}")
                
                # Find the JP exam for this student's group
                group_id = selected_student.get('groupId')
                jp_exam_id = f"jp_groups123_{group_id}"
                
                jp_exam = None
                for exam in exams:
                    if exam['id'] == jp_exam_id:
                        jp_exam = exam
                        break
                
                if not jp_exam:
                    print(f"❌ No JP Groups 1,2,3 exam found for group '{group_id}'")
                    continue
                
                # Check if student already has a mark for this exam
                existing_mark = None
                for mark in marks:
                    if mark.get('studentId') == selected_student['id'] and mark.get('examId') == jp_exam_id:
                        existing_mark = mark
                        break
                
                if existing_mark:
                    print(f"⚠️  Student already has a mark: {existing_mark['score']}/{jp_exam['maxScore']}")
                    update = input("Update existing mark? (y/n): ").strip().lower()
                    if update != 'y':
                        continue
                
                # Get mark
                while True:
                    mark_input = input(f"\nEnter mark (0-{jp_exam['maxScore']}) or 'N/A' if not taken: ").strip()
                    
                    if mark_input.upper() == 'N/A':
                        mark_value = "N/A"
                        break
                    
                    try:
                        mark_value = int(mark_input)
                        if 0 <= mark_value <= jp_exam['maxScore']:
                            break
                        else:
                            print(f"❌ Mark must be between 0 and {jp_exam['maxScore']}")
                    except ValueError:
                        print("❌ Invalid input. Enter a number or 'N/A'")
                
                # Save the mark
                if existing_mark:
                    # Update existing mark
                    existing_mark['score'] = mark_value
                    existing_mark['date'] = "2025-09-04"
                    print(f"✅ Updated mark for {selected_student['name']}: {mark_value}/{jp_exam['maxScore']}")
                else:
                    # Add new mark
                    new_mark = {
                        "id": get_next_mark_id(marks),
                        "studentId": selected_student['id'],
                        "examId": jp_exam_id,
                        "score": mark_value,
                        "date": "2025-09-04"
                    }
                    marks.append(new_mark)
                    print(f"✅ Added mark for {selected_student['name']}: {mark_value}/{jp_exam['maxScore']}")
                
                # Save marks file
                save_json('public/data/marks.json', marks)
                print("💾 Marks saved successfully!")
                
            except ValueError:
                print("❌ Invalid input. Please enter a number.")
            except KeyboardInterrupt:
                print("\n\n👋 Exiting...")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
