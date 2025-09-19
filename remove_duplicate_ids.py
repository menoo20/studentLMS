#!/usr/bin/env python3
"""
Script to remove duplicate student IDs from students.json.
This fixes cases where different students have the same ID but different names.
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

def find_id_duplicates(students):
    """Find duplicate students based on identical IDs."""
    id_to_students = {}
    duplicates = []
    
    for student in students:
        student_id = student['id']
        if student_id not in id_to_students:
            id_to_students[student_id] = []
        id_to_students[student_id].append(student)
    
    # Find IDs with multiple students
    for student_id, student_list in id_to_students.items():
        if len(student_list) > 1:
            # Keep the first one, mark others as duplicates
            duplicates.extend(student_list[1:])
            print(f"🔍 Found {len(student_list)} students with ID '{student_id}':")
            for i, student in enumerate(student_list):
                status = "KEEP" if i == 0 else "REMOVE"
                print(f"   {status}: Name: '{student['name']}' - Group: {student.get('groupId', 'N/A')} - Enrolled: {student.get('dateEnrolled', 'N/A')}")
    
    return duplicates

def remove_duplicate_marks(marks, duplicate_student_ids):
    """Remove marks associated with duplicate students."""
    original_count = len(marks)
    cleaned_marks = [mark for mark in marks if mark['studentId'] not in duplicate_student_ids]
    removed_count = original_count - len(cleaned_marks)
    
    if removed_count > 0:
        print(f"🗑️  Removed {removed_count} marks associated with duplicate student IDs")
    
    return cleaned_marks

def main():
    """Main function to remove duplicate student IDs."""
    print("🔍 Starting duplicate student ID removal process...")
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
    
    # Find ID duplicates
    print("\n🔍 Analyzing for duplicate IDs...")
    duplicates = find_id_duplicates(students)
    
    if not duplicates:
        print("✅ No duplicate student IDs found! Database is clean.")
        return
    
    print(f"\n⚠️  Found {len(duplicates)} duplicate student IDs to remove")
    
    # Ask for confirmation
    print("\n" + "=" * 60)
    response = input("❓ Do you want to proceed with removing ID duplicates? (y/N): ").strip().lower()
    
    if response != 'y' and response != 'yes':
        print("❌ Operation cancelled by user")
        return
    
    # Get IDs of duplicate students
    duplicate_ids = [student['id'] for student in duplicates]
    print(f"\n🗑️  Removing {len(duplicate_ids)} duplicate student IDs...")
    
    # Remove duplicates from students list (keep only first occurrence of each ID)
    seen_ids = set()
    cleaned_students = []
    for student in students:
        if student['id'] not in seen_ids:
            cleaned_students.append(student)
            seen_ids.add(student['id'])
    
    # Remove associated marks for the duplicate IDs that were removed
    print("🗑️  Cleaning up associated marks...")
    cleaned_marks = remove_duplicate_marks(marks, duplicate_ids)
    
    # Save cleaned data
    print("\n💾 Saving cleaned data...")
    save_json_file(students_file, cleaned_students)
    save_json_file(marks_file, cleaned_marks)
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ ID DUPLICATE CLEANUP COMPLETE!")
    print(f"📊 Students: {len(students)} → {len(cleaned_students)} (removed {len(duplicates)})")
    print(f"📊 Marks: {len(marks)} → {len(cleaned_marks)} (removed {len(marks) - len(cleaned_marks)})")
    
    print("\n📋 Removed duplicate student IDs:")
    for student in duplicates:
        print(f"   • {student['name']} (ID: {student['id']}, Group: {student.get('groupId', 'N/A')})")
    
    print("\n💡 Tip: Check the backup files if you need to restore any data")

if __name__ == "__main__":
    main()