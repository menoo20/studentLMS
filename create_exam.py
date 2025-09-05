#!/usr/bin/env python3
"""
Create Exam Script
This script helps you create exam entries in the JSON database
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

    return students, groups, exams

def create_backup():
    """Create backup of existing exams.json"""
    if os.path.exists('public/data/exams.json'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f'public/data/exams_backup_{timestamp}.json'
        import shutil
        shutil.copy2('public/data/exams.json', backup_name)
        print(f"📋 Created backup: {backup_name}")

def display_groups(groups):
    """Display available groups"""
    if not groups:
        print("❌ No groups found in the system.")
        return []
    
    print("\n📚 AVAILABLE GROUPS:")
    print("-" * 50)
    print(f"{'No.':<4} {'Group ID':<15} {'Group Name':<30}")
    print("-" * 50)
    
    for i, group in enumerate(groups, 1):
        print(f"{i:<4} {group.get('id', 'N/A'):<15} {group.get('name', 'N/A'):<30}")
    
    return groups

def get_exam_input(groups):
    """Get exam details from user input"""
    print("\n🎯 CREATE NEW EXAM")
    print("=" * 50)
    
    # Get exam name
    while True:
        exam_name = input("\n📚 Enter exam name: ").strip()
        if exam_name:
            break
        print("❌ Exam name cannot be empty. Please try again.")
    
    # Get description
    description = input("📝 Enter exam description (optional): ").strip()
    
    # Get exam type
    print("\n📋 Select exam type:")
    exam_types = ["quiz", "midterm", "final", "assignment", "project", "test"]
    for i, exam_type in enumerate(exam_types, 1):
        print(f"{i}. {exam_type.capitalize()}")
    
    while True:
        try:
            type_choice = input("Choose exam type (1-6): ").strip()
            if type_choice.isdigit() and 1 <= int(type_choice) <= 6:
                selected_type = exam_types[int(type_choice) - 1]
                break
            else:
                print("❌ Please enter a number between 1 and 6.")
        except (ValueError, IndexError):
            print("❌ Invalid input. Please try again.")
    
    # Get max score
    while True:
        try:
            max_score = input("🎯 Enter maximum score: ").strip()
            max_score = float(max_score)
            if max_score > 0:
                break
            else:
                print("❌ Maximum score must be greater than 0.")
        except ValueError:
            print("❌ Please enter a valid number.")
    
    # Get exam date
    exam_date = input(f"📅 Enter exam date (YYYY-MM-DD) [default: today]: ").strip()
    if not exam_date:
        exam_date = datetime.now().strftime('%Y-%m-%d')
    else:
        # Validate date format
        try:
            datetime.strptime(exam_date, '%Y-%m-%d')
        except ValueError:
            print("⚠️ Invalid date format, using today's date.")
            exam_date = datetime.now().strftime('%Y-%m-%d')
    
    # Get assigned groups
    assigned_groups = []
    if groups:
        print("\n👥 ASSIGN TO GROUPS:")
        print("Available options:")
        print("0. All groups")
        display_groups(groups)
        
        while True:
            group_input = input("\nEnter group numbers (comma-separated) or 0 for all: ").strip()
            
            if group_input == "0":
                # All groups - don't specify groupId, exam will be available to all
                assigned_groups = []
                print("✅ Exam will be available to all groups")
                break
            
            try:
                group_numbers = [int(x.strip()) for x in group_input.split(',')]
                valid_groups = []
                
                for num in group_numbers:
                    if 1 <= num <= len(groups):
                        group_id = groups[num - 1]['id']
                        group_name = groups[num - 1]['name']
                        valid_groups.append(group_id)
                        print(f"✅ Added group: {group_name}")
                    else:
                        print(f"❌ Invalid group number: {num}")
                
                if valid_groups:
                    assigned_groups = valid_groups
                    break
                else:
                    print("❌ No valid groups selected. Please try again.")
                    
            except ValueError:
                print("❌ Invalid input format. Use comma-separated numbers (e.g., 1,2,3)")
    
    return {
        'name': exam_name,
        'description': description if description else None,
        'type': selected_type,
        'maxScore': max_score,
        'date': exam_date,
        'assignedGroups': assigned_groups
    }

def save_exam(exam_data, exams):
    """Save exam to JSON file"""
    # Generate unique ID
    exam_id = f"exam_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
    
    new_exam = {
        "id": exam_id,
        "name": exam_data['name'],
        "subject": "English",  # Default subject
        "date": exam_data['date'],
        "maxScore": exam_data['maxScore'],
        "type": exam_data['type'],
        "createdAt": datetime.now().isoformat()
    }
    
    # Add optional fields
    if exam_data['description']:
        new_exam['description'] = exam_data['description']
    
    # Handle group assignments
    if exam_data['assignedGroups']:
        # Store assigned groups as an array in the exam
        new_exam['assignedGroups'] = exam_data['assignedGroups']
        print(f"✅ Created exam '{exam_data['name']}' for groups: {', '.join(exam_data['assignedGroups'])}")
    else:
        # No specific groups - exam available to all (don't set assignedGroups field)
        print(f"✅ Created exam '{exam_data['name']}' for all groups")
    
    exams.append(new_exam)
    return exams

def main():
    """Main function"""
    print("🎯 EXAM CREATION TOOL")
    print("=" * 50)
    print("This tool helps you create new exams in your student management system.")
    
    try:
        # Load existing data
        students, groups, exams = load_data()
        
        print(f"\n📊 Current System Status:")
        print(f"   • Students: {len(students)}")
        print(f"   • Groups: {len(groups)}")
        print(f"   • Exams: {len(exams)}")
        
        # Create backup
        create_backup()
        
        # Get exam details from user
        exam_data = get_exam_input(groups)
        
        # Confirm before saving
        print(f"\n📋 EXAM SUMMARY:")
        print(f"   • Name: {exam_data['name']}")
        print(f"   • Type: {exam_data['type']}")
        print(f"   • Max Score: {exam_data['maxScore']}")
        print(f"   • Date: {exam_data['date']}")
        if exam_data['description']:
            print(f"   • Description: {exam_data['description']}")
        
        if exam_data['assignedGroups']:
            print(f"   • Assigned to groups: {', '.join(exam_data['assignedGroups'])}")
        else:
            print(f"   • Available to: All groups")
        
        confirm = input("\n✅ Create this exam? (y/N): ").strip().lower()
        if confirm in ['y', 'yes']:
            # Save exam
            updated_exams = save_exam(exam_data, exams)
            
            # Write to file
            os.makedirs('public/data', exist_ok=True)
            with open('public/data/exams.json', 'w', encoding='utf-8') as f:
                json.dump(updated_exams, f, indent=2, ensure_ascii=False)
            
            print(f"\n🎉 SUCCESS! Exam created successfully!")
            print(f"📁 Saved to: public/data/exams.json")
            print(f"📊 Total exams: {len(updated_exams)}")
        else:
            print("\n❌ Exam creation cancelled.")
    
    except KeyboardInterrupt:
        print("\n\n👋 Bye! Exam creation cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Please check your data files and try again.")

if __name__ == "__main__":
    main()
