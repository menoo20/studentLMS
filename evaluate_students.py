#!/usr/bin/env python3
"""
Evaluate Students Script
This script helps you add or edit student marks for exams
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

def display_groups(groups, students):
    """Display available groups"""
    if not groups:
        print("❌ No groups found in the system.")
        return None
    
    print("\n👥 AVAILABLE GROUPS:")
    print("-" * 60)
    print(f"{'No.':<4} {'Group ID':<15} {'Group Name':<25} {'Students':<10}")
    print("-" * 60)
    
    for i, group in enumerate(groups, 1):
        # Count students in this group
        students_count = len([s for s in students if s.get('groupId') == group.get('id')])
        print(f"{i:<4} {group.get('id', 'N/A'):<15} {group.get('name', 'N/A'):<25} {students_count:<10}")
    
    return groups

def select_group(groups, students):
    """Let user select a group"""
    available_groups = display_groups(groups, students)
    if not available_groups:
        return None
    
    while True:
        try:
            choice = input(f"\nSelect group (1-{len(groups)}): ").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(groups):
                selected_group = groups[int(choice) - 1]
                print(f"✅ Selected group: {selected_group['name']}")
                return selected_group
            else:
                print(f"❌ Please enter a number between 1 and {len(groups)}.")
        except (ValueError, IndexError):
            print("❌ Invalid input. Please try again.")

def display_exams(exams, group_id=None):
    """Display available exams for a group"""
    # Filter exams for the selected group
    if group_id:
        available_exams = []
        for exam in exams:
            # Exam is available if:
            # 1. It has no assignedGroups (available to all), OR
            # 2. It has assignedGroups and includes this group_id, OR  
            # 3. Legacy: it has groupId that matches (backward compatibility)
            if (not exam.get('assignedGroups') and not exam.get('groupId')) or \
               (exam.get('assignedGroups') and group_id in exam.get('assignedGroups', [])) or \
               (exam.get('groupId') == group_id):
                available_exams.append(exam)
    else:
        available_exams = exams
    
    if not available_exams:
        print("❌ No exams found for this group.")
        return None
    
    print("\n📚 AVAILABLE EXAMS:")
    print("-" * 80)
    print(f"{'No.':<4} {'Exam Name':<30} {'Type':<12} {'Max Score':<10} {'Date':<12}")
    print("-" * 80)
    
    for i, exam in enumerate(available_exams, 1):
        print(f"{i:<4} {exam.get('name', 'N/A'):<30} {exam.get('type', 'N/A'):<12} {exam.get('maxScore', 'N/A'):<10} {exam.get('date', 'N/A'):<12}")
    
    return available_exams

def select_exam(exams, group_id):
    """Let user select an exam"""
    available_exams = display_exams(exams, group_id)
    if not available_exams:
        return None
    
    while True:
        try:
            choice = input(f"\nSelect exam (1-{len(available_exams)}): ").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(available_exams):
                selected_exam = available_exams[int(choice) - 1]
                print(f"✅ Selected exam: {selected_exam['name']} (Max: {selected_exam['maxScore']} points)")
                return selected_exam
            else:
                print(f"❌ Please enter a number between 1 and {len(available_exams)}.")
        except (ValueError, IndexError):
            print("❌ Invalid input. Please try again.")

def get_students_in_group(students, group_id):
    """Get students in the selected group"""
    group_students = [s for s in students if s.get('groupId') == group_id]
    return sorted(group_students, key=lambda x: x.get('name', ''))

def display_students(students, exam_id, marks):
    """Display students with their current marks if any"""
    if not students:
        print("❌ No students found in this group.")
        return
    
    print(f"\n👨‍🎓 STUDENTS IN GROUP ({len(students)} students):")
    print("-" * 100)
    print(f"{'No.':<4} {'Student ID':<12} {'Student Name':<40} {'Current Mark':<15}")
    print("-" * 100)
    
    for i, student in enumerate(students, 1):
        # Check if student already has a mark for this exam
        existing_mark = next((m for m in marks if m.get('studentId') == student.get('id') and m.get('examId') == exam_id), None)
        
        current_mark = "Not evaluated"
        if existing_mark:
            current_mark = f"{existing_mark.get('score', 'N/A')}/{existing_mark.get('maxScore', 'N/A')} ({existing_mark.get('percentage', 'N/A')}%)"
        
        # Handle Arabic text display
        name = student.get('name', 'N/A')
        student_id = student.get('id', 'N/A')
        
        try:
            # Better handling for Arabic text
            if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in name):
                # Display Arabic text with better formatting
                print(f"{i:<4} {student_id:<12} {name:<40} {current_mark:<15}")
            else:
                print(f"{i:<4} {student_id:<12} {name:<40} {current_mark:<15}")
        except:
            # Fallback if there are encoding issues
            print(f"{i:<4} {student_id:<12} {repr(name):<40} {current_mark:<15}")

def evaluate_students(students, selected_exam, marks):
    """Main evaluation loop"""
    print(f"\n🎯 EVALUATING EXAM: {selected_exam['name']}")
    print(f"📊 Maximum Score: {selected_exam['maxScore']}")
    print("\n📝 Instructions:")
    print("   • Enter student number to evaluate")
    print("   • Enter 'q' to quit and save progress")
    print("   • Enter 'list' to see students again")
    
    updated_marks = marks.copy()
    changes_made = False
    
    while True:
        print("\n" + "="*50)
        choice = input("\nEnter student number (or 'list'/'q'): ").strip().lower()
        
        if choice == 'q':
            break
        elif choice == 'list':
            display_students(students, selected_exam['id'], updated_marks)
            continue
        
        try:
            student_num = int(choice)
            if 1 <= student_num <= len(students):
                student = students[student_num - 1]
                
                # Check if student already has a mark
                existing_mark = next((m for m in updated_marks if m.get('studentId') == student.get('id') and m.get('examId') == selected_exam['id']), None)
                
                print(f"\n👨‍🎓 Evaluating: {student['name']} (ID: {student['id']})")
                
                if existing_mark:
                    print(f"⚠️ Current mark: {existing_mark['score']}/{existing_mark['maxScore']} ({existing_mark['percentage']}%)")
                    overwrite = input("Do you want to update this mark? (y/N): ").strip().lower()
                    if overwrite not in ['y', 'yes']:
                        print("❌ Evaluation cancelled for this student.")
                        continue
                
                # Get new score
                while True:
                    try:
                        score_input = input(f"Enter score (0-{selected_exam['maxScore']}): ").strip()
                        score = float(score_input)
                        
                        if 0 <= score <= selected_exam['maxScore']:
                            break
                        else:
                            print(f"❌ Score must be between 0 and {selected_exam['maxScore']}")
                    except ValueError:
                        print("❌ Please enter a valid number")
                
                # Calculate percentage
                percentage = (score / selected_exam['maxScore'] * 100)
                
                # Create/update mark
                new_mark = {
                    "id": f"mark_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}",
                    "studentId": student['id'],
                    "examId": selected_exam['id'],
                    "score": score,
                    "maxScore": selected_exam['maxScore'],
                    "percentage": f"{percentage:.1f}",
                    "date": datetime.now().strftime('%Y-%m-%d'),
                    "createdAt": datetime.now().isoformat()
                }
                
                if existing_mark:
                    # Update existing mark
                    existing_mark.update(new_mark)
                    print(f"✅ Updated mark for {student['name']}: {score}/{selected_exam['maxScore']} ({percentage:.1f}%)")
                else:
                    # Add new mark
                    updated_marks.append(new_mark)
                    print(f"✅ Added mark for {student['name']}: {score}/{selected_exam['maxScore']} ({percentage:.1f}%)")
                
                changes_made = True
                
            else:
                print(f"❌ Please enter a number between 1 and {len(students)}")
                
        except ValueError:
            print("❌ Invalid input. Please try again.")
    
    return updated_marks, changes_made

def main():
    """Main function"""
    print("📝 STUDENT EVALUATION TOOL")
    print("=" * 50)
    print("This tool helps you evaluate students for specific exams.")
    
    try:
        # Load existing data
        students, groups, exams, marks = load_data()
        
        print(f"\n📊 Current System Status:")
        print(f"   • Students: {len(students)}")
        print(f"   • Groups: {len(groups)}")
        print(f"   • Exams: {len(exams)}")
        print(f"   • Marks: {len(marks)}")
        
        if not groups:
            print("\n❌ No groups found. Please create groups first.")
            return
        
        if not exams:
            print("\n❌ No exams found. Please create exams first.")
            return
        
        # Create backup
        create_backup()
        
        # Step 1: Select group
        selected_group = select_group(groups, students)
        if not selected_group:
            return
        
        # Step 2: Select exam
        selected_exam = select_exam(exams, selected_group['id'])
        if not selected_exam:
            return
        
        # Step 3: Get students in group
        group_students = get_students_in_group(students, selected_group['id'])
        if not group_students:
            print(f"\n❌ No students found in group: {selected_group['name']}")
            return
        
        print(f"\n👥 Found {len(group_students)} students in {selected_group['name']}")
        
        # Step 4: Ask if user wants to add new marks or edit existing
        print(f"\n📋 Evaluation Options:")
        print(f"   1. Add new marks")
        print(f"   2. Edit existing marks")
        print(f"   3. Add/Edit marks (mixed)")
        
        while True:
            option = input("\nSelect option (1-3): ").strip()
            if option in ['1', '2', '3']:
                break
            print("❌ Please enter 1, 2, or 3.")
        
        # Step 5: Display current status
        display_students(group_students, selected_exam['id'], marks)
        
        # Step 6: Start evaluation
        updated_marks, changes_made = evaluate_students(group_students, selected_exam, marks)
        
        if changes_made:
            # Save changes
            os.makedirs('public/data', exist_ok=True)
            with open('public/data/marks.json', 'w', encoding='utf-8') as f:
                json.dump(updated_marks, f, indent=2, ensure_ascii=False)
            
            print(f"\n🎉 SUCCESS! Marks saved successfully!")
            print(f"📁 Saved to: public/data/marks.json")
            print(f"📊 Total marks: {len(updated_marks)}")
        else:
            print(f"\n📝 No changes made.")
    
    except KeyboardInterrupt:
        print("\n\n👋 Evaluation cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Please check your data files and try again.")

if __name__ == "__main__":
    main()
