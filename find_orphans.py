#!/usr/bin/env python3
"""
Find orphaned student marks (students with marks but no student records)
"""

import json

def main():
    # Load marks data
    with open('public/data/marks.json', 'r', encoding='utf-8') as f:
        marks = json.load(f)

    with open('public/data/students.json', 'r', encoding='utf-8') as f:
        students = json.load(f)

    # Get all student IDs from marks
    marks_student_ids = set(mark['studentId'] for mark in marks)
    print(f'📊 Unique student IDs in marks.json: {len(marks_student_ids)}')

    # Get all student IDs from students.json  
    students_student_ids = set(student['id'] for student in students)
    print(f'📊 Unique student IDs in students.json: {len(students_student_ids)}')

    # Find marks for students not in students.json
    orphan_marks = marks_student_ids - students_student_ids
    print(f'🔍 Student IDs in marks but NOT in students.json: {len(orphan_marks)}')

    if orphan_marks:
        print(f'\n🚫 ORPHANED STUDENT MARKS (THE MISSING 4):')
        print('='*60)
        for student_id in sorted(orphan_marks):
            student_marks = [m for m in marks if m['studentId'] == student_id]
            print(f'👻 {student_id}: {len(student_marks)} mark(s)')
            for mark in student_marks:
                exam_id = mark.get('examId', 'N/A')
                score = mark.get('score', 'N/A')
                print(f'      - Exam: {exam_id}, Score: {score}')
            print()

    # Show the breakdown
    print(f'📊 DETAILED BREAKDOWN:')
    print('='*40)
    print(f'• Total marks entries: {len(marks)}')  
    print(f'• Unique student IDs with marks: {len(marks_student_ids)}')
    print(f'• Students with data in students.json: {len(marks_student_ids & students_student_ids)}')
    print(f'• Students with marks but no student data: {len(orphan_marks)}')
    print(f'• Should show in interface: {len(marks_student_ids & students_student_ids)}')
    print(f'• Actually showing: 29')
    print(f'• Missing from interface: {len(marks_student_ids & students_student_ids) - 29}')

    # Now let's identify the 7 students that are being filtered out
    valid_students_with_marks = marks_student_ids & students_student_ids
    print(f'\n🔍 THE 7 FILTERED OUT STUDENTS:')
    print('='*50)
    print('These students exist in both files but are filtered out by the interface:')
    
    # We know 32 students exist and have marks, but only 29 show
    # The interface must be filtering out 3 students due to some condition

if __name__ == "__main__":
    main()
