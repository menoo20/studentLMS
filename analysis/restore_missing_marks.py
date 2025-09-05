#!/usr/bin/env python3
"""
Restore missing marks for محمد ناصر students from backup file
"""

import json
from datetime import datetime

def restore_missing_marks():
    """Restore marks that are in backup but missing from current marks.json"""
    print("🔧 RESTORING MISSING MARKS FOR محمد ناصر STUDENTS")
    print("="*60)
    
    # Load current marks
    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            current_marks = json.load(f)
        print(f"📊 Current marks.json has {len(current_marks)} entries")
    except Exception as e:
        print(f"❌ Error loading current marks: {e}")
        return
    
    # Load backup marks
    backup_file = 'public/data/marks_backup_20250905_180149.json'
    try:
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_marks = json.load(f)
        print(f"💾 Backup file has {len(backup_marks)} entries")
    except Exception as e:
        print(f"❌ Error loading backup marks: {e}")
        return
    
    # Find missing marks for محمد ناصر students
    mohammed_nasser_ids = ['s106', 's102', 's139']  # The IDs we found
    
    current_student_ids = set(mark.get('studentId') for mark in current_marks)
    missing_marks = []
    
    for mark in backup_marks:
        student_id = mark.get('studentId')
        if student_id in mohammed_nasser_ids and student_id not in current_student_ids:
            missing_marks.append(mark)
    
    if missing_marks:
        print(f"\n🔍 FOUND {len(missing_marks)} MISSING MARKS:")
        for mark in missing_marks:
            student_id = mark.get('studentId')
            score = mark.get('score')
            max_score = mark.get('maxScore', 16.0)
            percentage = round((score / max_score * 100), 1) if score and max_score else 0
            
            print(f"   📝 Student {student_id}: {score}/{max_score} ({percentage}%)")
            
            # Add complete metadata like other current marks
            mark['percentage'] = percentage
            mark['createdAt'] = mark.get('createdAt', '2025-09-05T18:00:00.000000')
        
        # Add missing marks to current marks
        restored_marks = current_marks + missing_marks
        
        # Create backup of current marks before restoring
        backup_timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_current_file = f'public/data/marks_backup_before_restore_{backup_timestamp}.json'
        
        with open(backup_current_file, 'w', encoding='utf-8') as f:
            json.dump(current_marks, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Created backup of current marks: {backup_current_file}")
        
        # Save restored marks
        with open('public/data/marks.json', 'w', encoding='utf-8') as f:
            json.dump(restored_marks, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ RESTORED {len(missing_marks)} missing marks!")
        print(f"📊 marks.json now has {len(restored_marks)} entries")
        
        # Show the restored students with their names
        try:
            with open('public/data/students.json', 'r', encoding='utf-8') as f:
                students = json.load(f)
            
            student_lookup = {s.get('id'): s.get('name', 'Unknown') for s in students}
            
            print(f"\n🎉 RESTORED MARKS FOR:")
            for mark in missing_marks:
                student_id = mark.get('studentId')
                student_name = student_lookup.get(student_id, f"Student {student_id}")
                score = mark.get('score')
                percentage = mark.get('percentage')
                print(f"   ✅ {student_name}: {score}/16 ({percentage}%)")
        
        except Exception as e:
            print(f"Error getting student names: {e}")
            
    else:
        print("ℹ️  No missing marks found for محمد ناصر students")
    
    return len(missing_marks)

def main():
    restored_count = restore_missing_marks()
    
    print("\n" + "="*60)
    if restored_count > 0:
        print("🎯 SUCCESS! The missing marks have been restored.")
        print("Now check your web interface - محمد ناصر's marks should appear!")
    else:
        print("ℹ️  No marks needed to be restored.")

if __name__ == "__main__":
    main()
