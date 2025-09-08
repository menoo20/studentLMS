#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Student Creation Script for Black Gold Training Institute
Creates new students in the student management system
"""

import json
import os
from datetime import datetime
import re

class StudentCreator:
    def __init__(self):
        self.data_dir = "public/data"
        self.students_file = os.path.join(self.data_dir, "students.json")
        self.groups_file = os.path.join(self.data_dir, "groups.json")
        
        # Load existing data
        self.students = self.load_json(self.students_file)
        self.groups = self.load_json(self.groups_file)
        
    def load_json(self, filepath):
        """Load JSON data from file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Error: {filepath} not found!")
            return []
        except json.JSONDecodeError:
            print(f"❌ Error: Invalid JSON in {filepath}")
            return []
    
    def save_json(self, data, filepath):
        """Save JSON data to file with backup"""
        try:
            # Create backup
            backup_path = f"{filepath}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            if os.path.exists(filepath):
                import shutil
                shutil.copy2(filepath, backup_path)
                print(f"📦 Backup created: {backup_path}")
            
            # Save new data
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"❌ Error saving {filepath}: {e}")
            return False
    
    def get_available_groups(self):
        """Get list of available groups"""
        group_list = []
        for group in self.groups:
            group_list.append({
                'id': group['id'],
                'name': group['name'],
                'students_count': len([s for s in self.students if s['groupId'] == group['id']])
            })
        return group_list
    
    def get_next_student_id(self, group_id):
        """Get the next available student ID for a group"""
        if group_id == 'nesma':
            # For NESMA group: n001, n002, etc.
            nesma_students = [s for s in self.students if s['groupId'] == 'nesma']
            if not nesma_students:
                return 'n001'
            
            # Find highest number
            max_num = 0
            for student in nesma_students:
                match = re.search(r'n(\d+)', student['id'])
                if match:
                    max_num = max(max_num, int(match.group(1)))
            return f"n{max_num + 1:03d}"
        
        elif group_id.startswith('saipem'):
            # For SAIPEM groups: find next studentId number
            group_students = [s for s in self.students if s['groupId'] == group_id]
            if not group_students:
                return "1"
            
            # Find highest studentId number
            max_num = 0
            for student in group_students:
                try:
                    num = int(student['studentId'])
                    max_num = max(max_num, num)
                except ValueError:
                    continue
            return str(max_num + 1)
        
        elif group_id.startswith('alfa'):
            # For ALFA groups: alfa2_001, alfa2_002, etc.
            group_students = [s for s in self.students if s['groupId'] == group_id]
            if not group_students:
                return f"{group_id}_001"
            
            # Find highest number
            max_num = 0
            for student in group_students:
                match = re.search(rf'{group_id}_(\d+)', student['id'])
                if match:
                    max_num = max(max_num, int(match.group(1)))
            return f"{group_id}_{max_num + 1:03d}"
        
        elif group_id == 'deye':
            # For DEYE group: deye_001, deye_002, etc.
            deye_students = [s for s in self.students if s['groupId'] == 'deye']
            if not deye_students:
                return "deye_001"
            
            # Find highest number
            max_num = 0
            for student in deye_students:
                match = re.search(r'deye_(\d+)', student['id'])
                if match:
                    max_num = max(max_num, int(match.group(1)))
            return f"deye_{max_num + 1:03d}"
        
        else:
            # General case: s001, s002, etc.
            all_s_students = [s for s in self.students if s['id'].startswith('s') and s['id'][1:].isdigit()]
            if not all_s_students:
                return "s001"
            
            # Find highest number
            max_num = 0
            for student in all_s_students:
                match = re.search(r's(\d+)', student['id'])
                if match:
                    max_num = max(max_num, int(match.group(1)))
            return f"s{max_num + 1:03d}"
    
    def create_student(self, name, group_id, email="", position=""):
        """Create a new student"""
        # Validate group
        valid_groups = [g['id'] for g in self.groups]
        if group_id not in valid_groups:
            print(f"❌ Invalid group ID: {group_id}")
            print(f"Available groups: {', '.join(valid_groups)}")
            return False
        
        # Generate IDs
        student_id = self.get_next_student_id(group_id)
        
        # Generate internal ID based on group
        if group_id == 'nesma':
            internal_id = student_id  # n001, n002, etc.
        elif group_id.startswith('saipem'):
            # Find next s019_new sequence
            existing_news = [s for s in self.students if s['id'].startswith('s019_new')]
            if existing_news:
                max_new_num = 0
                for student in existing_news:
                    match = re.search(r's019_new(\d*)', student['id'])
                    if match:
                        num_str = match.group(1)
                        if num_str == '':
                            max_new_num = max(max_new_num, 1)
                        else:
                            max_new_num = max(max_new_num, int(num_str))
                internal_id = f"s019_new{max_new_num + 1}"
            else:
                internal_id = "s019_new"
        else:
            internal_id = student_id
        
        # Set default position based on group
        if not position:
            if group_id == 'nesma':
                position = "Online Training"
            elif 'saipem' in group_id:
                position = "Vocational Training"
            else:
                position = "Vocational Training"
        
        # Create student object
        new_student = {
            "id": internal_id,
            "name": name,
            "studentId": student_id,
            "groupId": group_id,
            "email": email,
            "subject": "English",
            "position": position,
            "dateEnrolled": datetime.now().strftime("%Y-%m-%d")
        }
        
        return new_student
    
    def add_student(self, student_data):
        """Add student to the students list"""
        # Check for duplicates
        for existing in self.students:
            if existing['name'] == student_data['name'] and existing['groupId'] == student_data['groupId']:
                print(f"⚠️  Warning: Student '{student_data['name']}' already exists in {student_data['groupId']}")
                response = input("Continue anyway? (y/n): ").lower()
                if response != 'y':
                    return False
        
        # Find insertion point (after last student of the same group)
        insert_index = len(self.students)
        for i in range(len(self.students) - 1, -1, -1):
            if self.students[i]['groupId'] == student_data['groupId']:
                insert_index = i + 1
                break
        
        # Insert student
        self.students.insert(insert_index, student_data)
        
        # Save to file
        if self.save_json(self.students, self.students_file):
            print(f"✅ Student added successfully!")
            print(f"   Name: {student_data['name']}")
            print(f"   ID: {student_data['id']}")
            print(f"   Student ID: {student_data['studentId']}")
            print(f"   Group: {student_data['groupId']}")
            print(f"   Position: {student_data['position']}")
            return True
        else:
            print(f"❌ Failed to save student data")
            return False
    
    def interactive_mode(self):
        """Interactive mode for creating students"""
        print("🎓 BLACK GOLD STUDENT CREATOR")
        print("=" * 40)
        
        while True:
            # Show available groups
            print("\n📋 Available Groups:")
            groups = self.get_available_groups()
            for i, group in enumerate(groups, 1):
                print(f"{i}. {group['name']} ({group['id']}) - {group['students_count']} students")
            
            # Get student details
            print("\n➕ Add New Student:")
            name = input("Student Name (Arabic): ").strip()
            if not name:
                print("❌ Name cannot be empty!")
                continue
            
            # Select group
            try:
                group_choice = int(input("Select Group (number): ")) - 1
                if group_choice < 0 or group_choice >= len(groups):
                    print("❌ Invalid group selection!")
                    continue
                group_id = groups[group_choice]['id']
            except ValueError:
                print("❌ Please enter a valid number!")
                continue
            
            # Optional fields
            email = input("Email (optional): ").strip()
            position = input("Position (optional, will use default): ").strip()
            
            # Create student
            student_data = self.create_student(name, group_id, email, position)
            if student_data:
                print(f"\n📝 Student Details:")
                print(f"   Name: {student_data['name']}")
                print(f"   Internal ID: {student_data['id']}")
                print(f"   Student ID: {student_data['studentId']}")
                print(f"   Group: {student_data['groupId']}")
                print(f"   Position: {student_data['position']}")
                print(f"   Email: {student_data['email'] or 'None'}")
                
                confirm = input("\nConfirm creation? (y/n): ").lower()
                if confirm == 'y':
                    self.add_student(student_data)
                else:
                    print("❌ Student creation cancelled")
            
            # Continue?
            another = input("\nAdd another student? (y/n): ").lower()
            if another != 'y':
                break
        
        print("\n✅ Student creation session completed!")

def main():
    """Main function"""
    import sys
    
    creator = StudentCreator()
    
    if len(sys.argv) == 1:
        # Interactive mode
        creator.interactive_mode()
    elif len(sys.argv) >= 3:
        # Command line mode
        name = sys.argv[1]
        group_id = sys.argv[2]
        email = sys.argv[3] if len(sys.argv) > 3 else ""
        position = sys.argv[4] if len(sys.argv) > 4 else ""
        
        student_data = creator.create_student(name, group_id, email, position)
        if student_data:
            creator.add_student(student_data)
    else:
        print("Usage:")
        print("  Interactive mode: python create_student.py")
        print("  Command line: python create_student.py 'Name' 'group_id' ['email'] ['position']")
        print("\nAvailable groups:")
        groups = creator.get_available_groups()
        for group in groups:
            print(f"  - {group['id']}: {group['name']}")

if __name__ == "__main__":
    main()
