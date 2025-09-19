#!/usr/bin/env python3
"""
Script to remove duplicate students from students.json based on identical names.
Keeps the first occurrence of each name and removes subsequent duplicates.
Also removes any marks associated with the duplicate students.
"""

import json
import os
from datetime import datetime
import sys

def load_json_file(filepath):
    """Load JSON file safely."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: File {filepath} not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in {filepath}: {e}")
        sys.exit(1)

def save_json_file(filepath, data):
    """Save JSON file safely with backup."""
    # Create backup first
    backup_name = f"{filepath}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            backup_data = f.read()
        with open(backup_name, 'w', encoding='utf-8') as f:
            f.write(backup_data)
        print(f"📋 Backup created: {backup_name}")
    
    # Save new data
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def find_duplicates(students):
    """Find duplicate students based on identical names."""
    name_to_students = {}
    duplicates = []
    
    for student in students:
        name = student['name'].strip()
        if name not in name_to_students:
            name_to_students[name] = []
        name_to_students[name].append(student)
    
    # Find names with multiple students
    for name, student_list in name_to_students.items():
        if len(student_list) > 1:
            # Keep the first one, mark others as duplicates
            duplicates.extend(student_list[1:])
            print(f"🔍 Found {len(student_list)} students with name: '{name}'")
            for i, student in enumerate(student_list):
                status = "KEEP" if i == 0 else "REMOVE"
                print(f"   {status}: ID {student['id']} - Group: {student.get('groupId', 'N/A')} - Enrolled: {student.get('dateEnrolled', 'N/A')}")
    
    return duplicates

def remove_duplicate_marks(marks, duplicate_student_ids):
    """Remove marks associated with duplicate students."""
    original_count = len(marks)
    cleaned_marks = [mark for mark in marks if mark['studentId'] not in duplicate_student_ids]
    removed_count = original_count - len(cleaned_marks)
    
    if removed_count > 0:
        print(f"🗑️  Removed {removed_count} marks associated with duplicate students")
    
    return cleaned_marks

def main():
    """Main function to remove duplicate students."""
    print("🔍 Starting duplicate student removal process...")
    print("=" * 60)
    
    # Define file paths
    students_file = "public/data/students.json"
    marks_file = "public/data/marks.json"
    
    # Check if files exist
    if not os.path.exists(students_file):
        print(f"❌ Error: {students_file} not found")
        sys.exit(1)
    
    if not os.path.exists(marks_file):
        print(f"❌ Error: {marks_file} not found")
        sys.exit(1)
    
    # Load data
    print("📂 Loading student data...")
    students = load_json_file(students_file)
    print(f"📊 Total students loaded: {len(students)}")
    
    print("📂 Loading marks data...")
    marks = load_json_file(marks_file)
    print(f"📊 Total marks loaded: {len(marks)}")
    
    # Find duplicates
    print("\n🔍 Analyzing for duplicates...")
    duplicates = find_duplicates(students)
    
    if not duplicates:
        print("✅ No duplicate students found! Database is clean.")
        return
    
    print(f"\n⚠️  Found {len(duplicates)} duplicate students to remove")
    
    # Ask for confirmation
    print("\n" + "=" * 60)
    response = input("❓ Do you want to proceed with removing duplicates? (y/N): ").strip().lower()
    
    if response != 'y' and response != 'yes':
        print("❌ Operation cancelled by user")
        return
    
    # Get IDs of duplicate students
    duplicate_ids = [student['id'] for student in duplicates]
    print(f"\n🗑️  Removing {len(duplicate_ids)} duplicate students...")
    
    # Remove duplicates from students list
    cleaned_students = [student for student in students if student['id'] not in duplicate_ids]
    
    # Remove associated marks
    print("🗑️  Cleaning up associated marks...")
    cleaned_marks = remove_duplicate_marks(marks, duplicate_ids)
    
    # Save cleaned data
    print("\n💾 Saving cleaned data...")
    save_json_file(students_file, cleaned_students)
    save_json_file(marks_file, cleaned_marks)
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ CLEANUP COMPLETE!")
    print(f"📊 Students: {len(students)} → {len(cleaned_students)} (removed {len(duplicates)})")
    print(f"📊 Marks: {len(marks)} → {len(cleaned_marks)} (removed {len(marks) - len(cleaned_marks)})")
    
    print("\n📋 Removed duplicate students:")
    for student in duplicates:
        print(f"   • {student['name']} (ID: {student['id']}, Group: {student.get('groupId', 'N/A')})")
    
    print("\n💡 Tip: Check the backup files if you need to restore any data")

if __name__ == "__main__":
    main()