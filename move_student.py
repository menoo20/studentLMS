import json
import shutil
from datetime import datetime

def move_student_between_groups():
    # Create backup first
    backup_time = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f"public/data/students_backup_{backup_time}.json"
    shutil.copy2("public/data/students.json", backup_file)
    print(f"📦 Backup created: {backup_file}")
    
    # Load students data
    with open('public/data/students.json', 'r', encoding='utf-8') as f:
        students = json.load(f)
    
    # Find راشد محمد يحي كليبي
    target_student = None
    for i, student in enumerate(students):
        if student['name'] == 'راشد محمد يحي كليبي' and student['groupId'] == 'saipem5':
            target_student = student
            student_index = i
            break
    
    if not target_student:
        print("❌ Student not found!")
        return False
    
    print("📋 Found student:")
    print(f"   Name: {target_student['name']}")
    print(f"   Current Group: {target_student['groupId']}")
    print(f"   Current Student ID: {target_student['studentId']}")
    print(f"   Internal ID: {target_student['id']}")
    
    # Find next available student ID in SAIPEM6
    saipem6_students = [s for s in students if s['groupId'] == 'saipem6']
    max_student_id = 0
    for student in saipem6_students:
        try:
            student_id_num = int(student['studentId'])
            max_student_id = max(max_student_id, student_id_num)
        except ValueError:
            continue
    
    new_student_id = str(max_student_id + 1)
    
    print(f"\n🔄 Moving to SAIPEM6:")
    print(f"   New Group: saipem6")
    print(f"   New Student ID: {new_student_id}")
    
    # Update student record
    target_student['groupId'] = 'saipem6'
    target_student['studentId'] = new_student_id
    
    # Remove from current position
    students.pop(student_index)
    
    # Find insertion point (after last SAIPEM6 student)
    insert_index = len(students)
    for i in range(len(students) - 1, -1, -1):
        if students[i]['groupId'] == 'saipem6':
            insert_index = i + 1
            break
    
    # Insert at new position
    students.insert(insert_index, target_student)
    
    # Save updated data
    with open('public/data/students.json', 'w', encoding='utf-8') as f:
        json.dump(students, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Successfully moved student!")
    print(f"   Name: {target_student['name']}")
    print(f"   From: SAIPEM5 → SAIPEM6")
    print(f"   New Student ID: {new_student_id}")
    print(f"   Internal ID: {target_student['id']} (unchanged)")
    
    return True

if __name__ == "__main__":
    print("🔄 MOVING STUDENT BETWEEN GROUPS")
    print("=" * 40)
    print("Moving راشد محمد يحي كليبي from SAIPEM5 to SAIPEM6...")
    print()
    
    success = move_student_between_groups()
    
    if success:
        print("\n🎉 Student transfer completed successfully!")
        print("💡 The student will now appear in SAIPEM6 with a new student ID.")
    else:
        print("\n❌ Student transfer failed!")
