#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart Mark Entry System for JP Groups 1,2,3 Exam
This script allows you to add marks by student name with intelligent search.
"""

import json
import os
from difflib import SequenceMatcher

def load_json_file(filename):
    """Load JSON file and return data"""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found!")
        return None
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON in {filename}")
        return None

def save_json_file(filename, data):
    """Save data to JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"❌ Error saving {filename}: {e}")
        return False

def similarity(a, b):
    """Calculate similarity ratio between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def find_student_by_name(students, search_name):
    """Find student by name with fuzzy matching"""
    if not search_name.strip():
        return []
    
    matches = []
    search_name_clean = search_name.strip()
    
    for student in students:
        name = student.get('name', '')
        
        # Calculate similarity
        sim_ratio = similarity(name, search_name_clean)
        
        # Add to matches if similarity is above threshold
        if sim_ratio > 0.6:  # 60% similarity threshold
            matches.append((student, sim_ratio))
    
    # Sort by similarity (highest first)
    matches.sort(key=lambda x: x[1], reverse=True)
    
    return [match[0] for match in matches[:5]]  # Return top 5 matches

def get_exam_id_for_group(group_id):
    """Get the JP exam ID for a specific group"""
    return f"jp_groups123_{group_id}"

def find_student_mark(marks, student_id, exam_id):
    """Find existing mark for student and exam"""
    for mark in marks:
        if mark.get('studentId') == student_id and mark.get('examId') == exam_id:
            return mark
    return None

def add_or_update_mark(marks, student_id, exam_id, score):
    """Add new mark or update existing one"""
    # Find existing mark
    existing_mark = find_student_mark(marks, student_id, exam_id)
    
    if existing_mark:
        # Update existing mark
        existing_mark['score'] = score
        existing_mark['date'] = "2025-09-04"
        return f"✅ Updated existing mark"
    else:
        # Add new mark
        new_mark = {
            "id": f"mark_{len(marks) + 1}",
            "studentId": student_id,
            "examId": exam_id,
            "score": score,
            "date": "2025-09-04"
        }
        marks.append(new_mark)
        return f"✅ Added new mark"

def main():
    print("🎯 JP Groups 1,2,3 Mark Entry System")
    print("=" * 50)
    
    # Load data files
    students_file = "public/data/students.json"
    marks_file = "public/data/marks.json"
    
    students = load_json_file(students_file)
    marks = load_json_file(marks_file)
    
    if not students or not marks:
        return
    
    print(f"📚 Loaded {len(students)} students")
    print(f"📊 Loaded {len(marks)} existing marks")
    print("\n🔍 Instructions:")
    print("- Enter student name (Arabic or English)")
    print("- Enter mark (0-16) or 'N/A' if not taken")
    print("- Type 'quit' to exit")
    print("-" * 50)
    
    while True:
        print("\n" + "="*50)
        student_name = input("👤 Enter student name (or 'quit'): ").strip()
        
        if student_name.lower() == 'quit':
            print("👋 Goodbye!")
            break
            
        if not student_name:
            print("❌ Please enter a student name")
            continue
        
        # Find students
        matches = find_student_by_name(students, student_name)
        
        if not matches:
            print(f"❌ No students found matching '{student_name}'")
            continue
        
        # Show matches
        print(f"\n🔍 Found {len(matches)} student(s):")
        for i, student in enumerate(matches, 1):
            group_name = student.get('groupId', 'Unknown')
            print(f"{i}. {student.get('name', 'Unknown')} (Group: {group_name.upper()})")
        
        # Let user select
        try:
            choice = input(f"\n✅ Select student (1-{len(matches)}) or 'skip': ").strip()
            
            if choice.lower() == 'skip':
                continue
                
            choice_num = int(choice)
            if choice_num < 1 or choice_num > len(matches):
                print("❌ Invalid selection")
                continue
                
            selected_student = matches[choice_num - 1]
            
        except ValueError:
            print("❌ Please enter a valid number")
            continue
        
        # Show selected student details
        print(f"\n👤 Selected Student:")
        print(f"   Name: {selected_student.get('name')}")
        print(f"   Group: {selected_student.get('groupId', 'Unknown').upper()}")
        print(f"   Student ID: {selected_student.get('studentId', 'Unknown')}")
        
        # Get mark
        mark_input = input(f"\n📝 Enter mark (0-16) or 'N/A': ").strip()
        
        if mark_input.upper() == 'N/A':
            score = "N/A"
        else:
            try:
                score = float(mark_input)
                if score < 0 or score > 16:
                    print("❌ Mark must be between 0 and 16")
                    continue
            except ValueError:
                print("❌ Please enter a valid number or 'N/A'")
                continue
        
        # Add mark
        group_id = selected_student.get('groupId')
        exam_id = get_exam_id_for_group(group_id)
        student_internal_id = selected_student.get('id')
        
        result = add_or_update_mark(marks, student_internal_id, exam_id, score)
        print(f"\n{result}")
        print(f"   Student: {selected_student.get('name')}")
        print(f"   Group: {group_id.upper()}")
        print(f"   Exam: JP Groups 1,2,3")
        print(f"   Score: {score}/16")
        
        # Save marks
        if save_json_file(marks_file, marks):
            print("💾 Marks saved successfully!")
        else:
            print("❌ Error saving marks!")

if __name__ == "__main__":
    main()
