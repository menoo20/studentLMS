#!/usr/bin/env python3
"""
Analyze students with evaluations to find the missing 7 students
"""

import json

def main():
    # Load all data files
    with open('public/data/marks.json', 'r', encoding='utf-8') as f:
        marks = json.load(f)

    with open('public/data/students.json', 'r', encoding='utf-8') as f:
        students = json.load(f)

    with open('public/data/groups.json', 'r', encoding='utf-8') as f:
        groups = json.load(f)

    with open('public/data/exams.json', 'r', encoding='utf-8') as f:
        exams = json.load(f)

    print('🔍 ANALYZING THE 7 MISSING STUDENTS')
    print('='*60)

    # Get students who have evaluations
    students_with_marks = set()
    for mark in marks:
        students_with_marks.add(mark['studentId'])

    print(f'📊 Students with evaluations: {len(students_with_marks)}')
    print(f'📊 Total students in database: {len(students)}')

    # Analyze each student with evaluations
    students_analysis = []
    for student in students:
        if student['id'] in students_with_marks:
            # Get their marks
            student_marks = [m for m in marks if m['studentId'] == student['id']]
            
            # Get their group info
            group = next((g for g in groups if g['id'] == student.get('groupId')), None)
            
            analysis = {
                'student': student,
                'group': group,
                'marks': student_marks,
                'exam_ids': list(set(m['examId'] for m in student_marks))
            }
            students_analysis.append(analysis)

    print(f'\nFound {len(students_analysis)} students with evaluations:')
    print('='*60)

    # Show detailed analysis
    for i, analysis in enumerate(students_analysis, 1):
        student = analysis['student']
        group = analysis['group']
        marks = analysis['marks']
        
        student_name = student.get('name', 'No name')
        student_id = student['id']
        group_id = student.get('groupId', 'No group')
        group_name = group['name'] if group else 'Unknown Group'
        
        print(f'{i:2d}. 👤 {student_name}')
        print(f'    📋 ID: {student_id}')
        print(f'    👥 Group: {group_id} ({group_name})')
        print(f'    📊 Evaluations: {len(marks)} marks')
        
        for mark in marks:
            exam = next((e for e in exams if e['id'] == mark['examId']), None)
            exam_name = exam['name'] if exam else 'Unknown Exam'
            score = mark.get('score', 'No score')
            exam_id = mark.get('examId', 'No exam ID')
            print(f'        • {exam_name}: {score} points (Exam ID: {exam_id})')
        print()

    print(f'\n🧮 SUMMARY:')
    print(f'• Total students in DB: {len(students)}')
    print(f'• Students with marks: {len(students_with_marks)}') 
    print(f'• Should show (after hide filter): {len(students_with_marks)}')
    print(f'• Actually showing: 29')
    print(f'• Missing: {len(students_with_marks) - 29}')
    
    # Try to identify why 7 are missing
    print(f'\n🔍 POSSIBLE REASONS FOR MISSING STUDENTS:')
    print('='*50)
    
    # Group filter analysis
    group_counts = {}
    exam_counts = {}
    
    for analysis in students_analysis:
        group_id = analysis['student'].get('groupId', 'no_group')
        if group_id not in group_counts:
            group_counts[group_id] = 0
        group_counts[group_id] += 1
        
        for exam_id in analysis['exam_ids']:
            if exam_id not in exam_counts:
                exam_counts[exam_id] = 0
            exam_counts[exam_id] += 1
    
    print(f'📊 Students by Group:')
    for group_id, count in sorted(group_counts.items()):
        group = next((g for g in groups if g['id'] == group_id), None)
        group_name = group['name'] if group else 'Unknown'
        print(f'   {group_id} ({group_name}): {count} students')
    
    print(f'\n📊 Students by Exam:')
    for exam_id, count in sorted(exam_counts.items()):
        exam = next((e for e in exams if e['id'] == exam_id), None)
        exam_name = exam['name'] if exam else 'Unknown'
        print(f'   {exam_id} ({exam_name}): {count} students')

if __name__ == "__main__":
    main()
