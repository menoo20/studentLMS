#!/usr/bin/env python3
"""
List all 32 valid students to identify the 3 being filtered
"""

import json

def main():
    # Load data
    with open('public/data/marks.json', 'r', encoding='utf-8') as f:
        marks = json.load(f)
    with open('public/data/students.json', 'r', encoding='utf-8') as f:
        students = json.load(f)

    # Get valid student IDs (exist in both files)
    marks_ids = set(mark['studentId'] for mark in marks)
    student_ids = set(s['id'] for s in students)
    valid_ids = marks_ids & student_ids

    print(f'🔍 VALID STUDENTS (exist in both files): {len(valid_ids)}')
    print(f'🖥️  SHOWING IN INTERFACE: 29')  
    print(f'❓ MISSING FROM INTERFACE: {len(valid_ids) - 29}')

    print(f'\n📋 ALL {len(valid_ids)} VALID STUDENTS:')
    print('='*80)
    valid_students = [s for s in students if s['id'] in valid_ids]

    for i, student in enumerate(sorted(valid_students, key=lambda x: x['id']), 1):
        student_id = student['id']
        group_id = student.get('groupId', 'No group')
        name = student.get('name', 'No name')
        student_marks = [m for m in marks if m['studentId'] == student_id]
        
        print(f'{i:2d}. {student_id:12} | {group_id:8} | {name[:30]:30} | {len(student_marks)} marks')

    print(f'\n🤔 LIKELY REASONS FOR 3 MISSING STUDENTS:')
    print('='*50)
    print('• Group filtering (not matching current group selection)')
    print('• Exam filtering (only evaluated in exams not currently displayed)')
    print('• Edge case in filtering logic (needs code investigation)')

if __name__ == "__main__":
    main()
