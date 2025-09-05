#!/usr/bin/env python3
"""
Check Jolly Phonics Exam Evaluation Status
Analyze who has been evaluated and who hasn't for Jolly Phonics exam
"""

import json

def load_data():
    """Load all data from JSON files"""
    try:
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            students = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        students = []

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

    try:
        with open('public/data/groups.json', 'r', encoding='utf-8') as f:
            groups = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        groups = []

    return students, exams, marks, groups

def main():
    print("📊 JOLLY PHONICS EXAM EVALUATION ANALYSIS")
    print("="*60)
    
    students, exams, marks, groups = load_data()
    
    # Find Jolly Phonics exam
    jolly_exam = None
    for exam in exams:
        if "jolly phonics" in exam.get('name', '').lower():
            jolly_exam = exam
            break
    
    if not jolly_exam:
        print("❌ Jolly Phonics exam not found!")
        return
    
    print(f"🎯 Exam Found: {jolly_exam['name']}")
    print(f"📅 Date: {jolly_exam.get('date', 'N/A')}")
    print(f"📊 Max Score: {jolly_exam.get('maxScore', 'N/A')}")
    print(f"🏷️  Type: {jolly_exam.get('type', 'N/A')}")
    
    # Get assigned groups
    assigned_groups = jolly_exam.get('assignedGroups', [])
    print(f"👥 Assigned to groups: {len(assigned_groups)} groups")
    print(f"   Groups: {', '.join(assigned_groups)}")
    
    # Get all students in assigned groups
    eligible_students = []
    for student in students:
        if student.get('groupId') in assigned_groups:
            eligible_students.append(student)
    
    print(f"\n📈 STUDENT STATISTICS:")
    print(f"   Total eligible students: {len(eligible_students)}")
    
    # Group breakdown
    group_stats = {}
    for group_id in assigned_groups:
        group_students = [s for s in eligible_students if s.get('groupId') == group_id]
        group_stats[group_id] = len(group_students)
        print(f"   • {group_id}: {len(group_students)} students")
    
    # Get marks for this exam
    exam_marks = [m for m in marks if m.get('examId') == jolly_exam['id']]
    print(f"\n📝 EVALUATION STATISTICS:")
    print(f"   Total marks recorded: {len(exam_marks)}")
    
    # Find evaluated vs non-evaluated students
    evaluated_student_ids = set(m.get('studentId') for m in exam_marks)
    
    evaluated_students = []
    non_evaluated_students = []
    
    for student in eligible_students:
        if student.get('id') in evaluated_student_ids:
            evaluated_students.append(student)
        else:
            non_evaluated_students.append(student)
    
    print(f"   Evaluated students: {len(evaluated_students)}")
    print(f"   Non-evaluated students: {len(non_evaluated_students)}")
    
    # Show evaluation breakdown by group
    print(f"\n📊 EVALUATION BY GROUP:")
    print("-" * 60)
    print(f"{'Group':<15} {'Total':<8} {'Evaluated':<12} {'Not Evaluated':<15} {'%':<8}")
    print("-" * 60)
    
    for group_id in assigned_groups:
        group_students = [s for s in eligible_students if s.get('groupId') == group_id]
        group_evaluated = [s for s in group_students if s.get('id') in evaluated_student_ids]
        group_not_evaluated = [s for s in group_students if s.get('id') not in evaluated_student_ids]
        
        total = len(group_students)
        eval_count = len(group_evaluated)
        percentage = (eval_count / total * 100) if total > 0 else 0
        
        print(f"{group_id:<15} {total:<8} {eval_count:<12} {len(group_not_evaluated):<15} {percentage:.1f}%")
    
    # Show non-evaluated students
    if non_evaluated_students:
        print(f"\n❌ NON-EVALUATED STUDENTS ({len(non_evaluated_students)}):")
        print("-" * 70)
        print(f"{'No.':<4} {'Name':<35} {'Group':<15} {'Student ID':<12}")
        print("-" * 70)
        
        for i, student in enumerate(non_evaluated_students, 1):
            print(f"{i:<4} {student.get('name', 'N/A'):<35} {student.get('groupId', 'N/A'):<15} {student.get('id', 'N/A'):<12}")
    
    # Show evaluated students with their scores
    if evaluated_students:
        print(f"\n✅ EVALUATED STUDENTS ({len(evaluated_students)}):")
        print("-" * 80)
        print(f"{'No.':<4} {'Name':<30} {'Group':<12} {'Score':<10} {'Percentage':<12}")
        print("-" * 80)
        
        for i, student in enumerate(evaluated_students, 1):
            student_mark = next((m for m in exam_marks if m.get('studentId') == student.get('id')), None)
            if student_mark:
                score = f"{student_mark.get('score', 'N/A')}/{student_mark.get('maxScore', jolly_exam.get('maxScore', 'N/A'))}"
                percentage = f"{student_mark.get('percentage', 'N/A')}%"
            else:
                score = "N/A"
                percentage = "N/A"
            
            print(f"{i:<4} {student.get('name', 'N/A')[:29]:<30} {student.get('groupId', 'N/A'):<12} {score:<10} {percentage:<12}")
    
    print(f"\n🎯 SUMMARY:")
    print(f"   • {len(eligible_students)} students are eligible for this exam")
    print(f"   • {len(evaluated_students)} students have been evaluated ({(len(evaluated_students)/len(eligible_students)*100):.1f}%)")
    print(f"   • {len(non_evaluated_students)} students still need evaluation")
    
    if len(evaluated_students) == 9:
        print(f"\n✅ The web interface is showing the correct count of 9 evaluated students!")
    else:
        print(f"\n⚠️  Expected 9 but found {len(evaluated_students)} evaluated students in the analysis.")

if __name__ == "__main__":
    main()
