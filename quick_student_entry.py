#!/usr/bin/env python3
"""
Quick Student Mark Entry Script
This script provides quick access to add or edit marks for individual students
"""

import json
import os
from datetime import datetime
import uuid

def load_data():
    """Load existing data from JSON files"""
    try:
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            students = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        students = []

    try:
        with open('public/data/groups.json', 'r', encoding='utf-8') as f:
            groups = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        groups = []

    try:
        with open('public/data/exams.json', 'r', encoding='utf-8') as f:
            exams = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        exams = []

    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            marks = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        marks = []

    return students, groups, exams, marks

def create_backup():
    """Create backup of existing marks.json"""
    if os.path.exists('public/data/marks.json'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f'public/data/marks_backup_{timestamp}.json'
        import shutil
        shutil.copy2('public/data/marks.json', backup_name)
        print(f"📋 Created backup: {backup_name}")

def search_students(students, search_term):
    """Search for students by name or ID"""
    search_term = search_term.lower().strip()
    matching_students = []
    
    for student in students:
        student_name = student.get('name', '').lower()
        student_id = str(student.get('id', '')).lower()
        student_number = str(student.get('studentId', '')).lower()
        
        if (search_term in student_name or 
            search_term in student_id or 
            search_term in student_number):
            matching_students.append(student)
    
    return matching_students

def display_students(students):
    """Display students list"""
    if not students:
        print("❌ No students found.")
        return None
    
    print(f"\n👨‍🎓 FOUND {len(students)} STUDENT(S):")
    print("-" * 100)
    print(f"{'No.':<4} {'Student ID':<12} {'Name':<40} {'Group':<15}")
    print("-" * 100)
    
    for i, student in enumerate(students, 1):
        # Handle Arabic text display issues by ensuring proper encoding
        name = student.get('name', 'N/A')
        student_id = student.get('id', 'N/A')
        group_id = student.get('groupId', 'N/A')
        
        # Try to reverse Arabic text for better display in Windows terminal
        try:
            # Check if name contains Arabic characters
            if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in name):
                # For Arabic text, we'll display it as-is but with better spacing
                print(f"{i:<4} {student_id:<12} {name:<40} {group_id:<15}")
            else:
                print(f"{i:<4} {student_id:<12} {name:<40} {group_id:<15}")
        except:
            # Fallback if there are encoding issues
            print(f"{i:<4} {student_id:<12} {repr(name):<40} {group_id:<15}")
    
    return students

def display_exams_for_student(exams, student_group_id):
    """Display exams available for the student's group"""
    available_exams = []
    for exam in exams:
        # Exam is available if:
        # 1. It has no assignedGroups (available to all), OR
        # 2. It has assignedGroups and includes this group_id, OR  
        # 3. Legacy: it has groupId that matches (backward compatibility)
        if (not exam.get('assignedGroups') and not exam.get('groupId')) or \
           (exam.get('assignedGroups') and student_group_id in exam.get('assignedGroups', [])) or \
           (exam.get('groupId') == student_group_id):
            available_exams.append(exam)
    
    if not available_exams:
        print("❌ No exams found for this student's group.")
        return None
    
    print(f"\n📚 AVAILABLE EXAMS FOR THIS STUDENT:")
    print("-" * 80)
    print(f"{'No.':<4} {'Exam Name':<30} {'Type':<12} {'Max Score':<10} {'Date':<12}")
    print("-" * 80)
    
    for i, exam in enumerate(available_exams, 1):
        print(f"{i:<4} {exam.get('name', 'N/A'):<30} {exam.get('type', 'N/A'):<12} {exam.get('maxScore', 'N/A'):<10} {exam.get('date', 'N/A'):<12}")
    
    return available_exams

def get_student_current_marks(student, marks):
    """Get all current marks for a student"""
    student_marks = [m for m in marks if m.get('studentId') == student.get('id')]
    return student_marks

def display_student_marks(student, exams, marks):
    """Display student's current marks"""
    student_marks = get_student_current_marks(student, marks)
    
    if not student_marks:
        print(f"\n📝 {student['name']} has no marks yet.")
        return
    
    print(f"\n📊 CURRENT MARKS FOR {student['name']}:")
    print("-" * 70)
    print(f"{'Exam Name':<25} {'Score':<15} {'Percentage':<12} {'Date':<12}")
    print("-" * 70)
    
    for mark in student_marks:
        exam = next((e for e in exams if e.get('id') == mark.get('examId')), None)
        exam_name = exam.get('name', 'Unknown Exam') if exam else 'Unknown Exam'
        score_display = f"{mark.get('score', 'N/A')}/{mark.get('maxScore', 'N/A')}"
        percentage = f"{mark.get('percentage', 'N/A')}%"
        date = mark.get('date', 'N/A')
        
        print(f"{exam_name:<25} {score_display:<15} {percentage:<12} {date:<12}")

def evaluate_student_for_exam(student, exam, marks):
    """Evaluate a specific student for a specific exam"""
    print(f"\n🎯 EVALUATING: {student['name']}")
    print(f"📚 Exam: {exam['name']}")
    print(f"📊 Maximum Score: {exam['maxScore']}")
    
    # Check if student already has a mark for this exam
    existing_mark = next((m for m in marks if m.get('studentId') == student.get('id') and m.get('examId') == exam.get('id')), None)
    
    if existing_mark:
        print(f"\n⚠️ EXISTING MARK FOUND:")
        print(f"   Current Score: {existing_mark['score']}/{existing_mark['maxScore']}")
        print(f"   Percentage: {existing_mark['percentage']}%")
        print(f"   Date: {existing_mark.get('date', 'N/A')}")
        
        proceed = input("\nDo you want to UPDATE this mark? (y/N): ").strip().lower()
        if proceed not in ['y', 'yes']:
            print("❌ Operation cancelled.")
            return marks, False
    
    # Get new score
    while True:
        try:
            score_input = input(f"\nEnter score (0-{exam['maxScore']}): ").strip()
            if score_input.lower() == 'q':
                print("❌ Operation cancelled.")
                return marks, False
                
            score = float(score_input)
            
            if 0 <= score <= exam['maxScore']:
                break
            else:
                print(f"❌ Score must be between 0 and {exam['maxScore']}")
        except ValueError:
            print("❌ Please enter a valid number (or 'q' to cancel)")
    
    # Calculate percentage
    percentage = (score / exam['maxScore'] * 100)
    
    # Show confirmation
    print(f"\n📋 CONFIRM MARK:")
    print(f"   Student: {student['name']}")
    print(f"   Exam: {exam['name']}")
    print(f"   Score: {score}/{exam['maxScore']}")
    print(f"   Percentage: {percentage:.1f}%")
    
    confirm = input("\nSave this mark? (y/N): ").strip().lower()
    if confirm not in ['y', 'yes']:
        print("❌ Mark not saved.")
        return marks, False
    
    # Create/update mark
    new_mark = {
        "id": f"mark_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}",
        "studentId": student['id'],
        "examId": exam['id'],
        "score": score,
        "maxScore": exam['maxScore'],
        "percentage": f"{percentage:.1f}",
        "date": datetime.now().strftime('%Y-%m-%d'),
        "createdAt": datetime.now().isoformat()
    }
    
    updated_marks = marks.copy()
    
    if existing_mark:
        # Update existing mark
        for i, mark in enumerate(updated_marks):
            if mark.get('id') == existing_mark.get('id'):
                updated_marks[i] = new_mark
                break
        print(f"✅ Updated mark for {student['name']}: {score}/{exam['maxScore']} ({percentage:.1f}%)")
    else:
        # Add new mark
        updated_marks.append(new_mark)
        print(f"✅ Added new mark for {student['name']}: {score}/{exam['maxScore']} ({percentage:.1f}%)")
    
    return updated_marks, True

def main():
    """Main function"""
    print("⚡ QUICK STUDENT MARK ENTRY")
    print("=" * 50)
    print("This tool provides quick access to add or edit individual student marks.")
    
    try:
        # Load existing data
        students, groups, exams, marks = load_data()
        
        print(f"\n📊 System Status: {len(students)} students, {len(exams)} exams, {len(marks)} marks")
        
        if not students:
            print("\n❌ No students found. Please add students first.")
            return
        
        if not exams:
            print("\n❌ No exams found. Please create exams first.")
            return
        
        # Create backup
        create_backup()
        
        # Main loop
        while True:
            print(f"\n" + "="*50)
            print("🔍 FIND STUDENT")
            print("Enter student name, ID, or student number to search")
            print("(or 'q' to quit)")
            
            search_input = input("\nSearch: ").strip()
            
            if search_input.lower() == 'q':
                break
            
            if not search_input:
                print("❌ Please enter a search term.")
                continue
            
            # Search for students
            found_students = search_students(students, search_input)
            
            if not found_students:
                print(f"❌ No students found matching: '{search_input}'")
                continue
            
            # Display found students
            displayed_students = display_students(found_students)
            
            # Select student
            if len(found_students) == 1:
                selected_student = found_students[0]
                print(f"✅ Auto-selected: {selected_student['name']}")
            else:
                while True:
                    try:
                        choice = input(f"\nSelect student (1-{len(found_students)}): ").strip()
                        if choice.isdigit() and 1 <= int(choice) <= len(found_students):
                            selected_student = found_students[int(choice) - 1]
                            break
                        else:
                            print(f"❌ Please enter a number between 1 and {len(found_students)}.")
                    except ValueError:
                        print("❌ Invalid input.")
            
            print(f"\n👨‍🎓 Selected Student: {selected_student['name']} (Group: {selected_student.get('groupId', 'N/A')})")
            
            # Show current marks
            display_student_marks(selected_student, exams, marks)
            
            # Show available exams
            available_exams = display_exams_for_student(exams, selected_student.get('groupId'))
            if not available_exams:
                continue
            
            # Select exam
            while True:
                try:
                    exam_choice = input(f"\nSelect exam (1-{len(available_exams)}) or 'b' to go back: ").strip()
                    if exam_choice.lower() == 'b':
                        break
                    
                    if exam_choice.isdigit() and 1 <= int(exam_choice) <= len(available_exams):
                        selected_exam = available_exams[int(exam_choice) - 1]
                        
                        # Evaluate student for this exam
                        updated_marks, changed = evaluate_student_for_exam(selected_student, selected_exam, marks)
                        
                        if changed:
                            # Save changes
                            os.makedirs('public/data', exist_ok=True)
                            with open('public/data/marks.json', 'w', encoding='utf-8') as f:
                                json.dump(updated_marks, f, indent=2, ensure_ascii=False)
                            
                            marks = updated_marks  # Update local copy
                            print(f"\n💾 Changes saved to marks.json")
                        
                        break
                    else:
                        print(f"❌ Please enter a number between 1 and {len(available_exams)}.")
                except ValueError:
                    print("❌ Invalid input.")
    
    except KeyboardInterrupt:
        print("\n\n👋 Quick entry cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Please check your data files and try again.")

if __name__ == "__main__":
    main()
