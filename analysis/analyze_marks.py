#!/usr/bin/env python3
"""
Analyze Marks.json File
Count total marks and unique students with marks
"""

import json

def load_marks():
    """Load marks from JSON file"""
    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            marks = json.load(f)
        return marks
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error loading marks: {e}")
        return []

def main():
    print("📊 MARKS.JSON ANALYSIS")
    print("="*50)
    
    marks = load_marks()
    if not marks:
        return
    
    print(f"📝 Total mark entries: {len(marks)}")
    
    # Count unique students
    unique_students = set()
    unique_exams = set()
    
    # Analyze each mark entry
    print(f"\n📋 MARK ENTRIES:")
    print("-" * 70)
    print(f"{'No.':<4} {'Mark ID':<15} {'Student ID':<15} {'Exam ID':<20} {'Score':<10}")
    print("-" * 70)
    
    for i, mark in enumerate(marks, 1):
        mark_id = mark.get('id', 'N/A')
        student_id = mark.get('studentId', 'N/A')
        exam_id = mark.get('examId', 'N/A')
        score = mark.get('score', 'N/A')
        
        # Add to unique sets
        if student_id != 'N/A':
            unique_students.add(student_id)
        if exam_id != 'N/A':
            unique_exams.add(exam_id)
        
        print(f"{i:<4} {mark_id:<15} {student_id:<15} {exam_id:<20} {score:<10}")
    
    print(f"\n📈 SUMMARY STATISTICS:")
    print(f"   • Total mark entries: {len(marks)}")
    print(f"   • Unique students with marks: {len(unique_students)}")
    print(f"   • Unique exams with marks: {len(unique_exams)}")
    
    print(f"\n👥 STUDENTS WITH MARKS:")
    student_list = sorted(list(unique_students))
    for i, student_id in enumerate(student_list, 1):
        student_marks = [m for m in marks if m.get('studentId') == student_id]
        print(f"   {i:2}. {student_id} ({len(student_marks)} mark(s))")
    
    print(f"\n📚 EXAMS WITH MARKS:")
    exam_list = sorted(list(unique_exams))
    for i, exam_id in enumerate(exam_list, 1):
        exam_marks = [m for m in marks if m.get('examId') == exam_id]
        print(f"   {i:2}. {exam_id} ({len(exam_marks)} mark(s))")
    
    # Check for any duplicate or problematic entries
    print(f"\n🔍 DATA QUALITY CHECK:")
    missing_student_id = [m for m in marks if not m.get('studentId')]
    missing_exam_id = [m for m in marks if not m.get('examId')]
    missing_score = [m for m in marks if 'score' not in m or m.get('score') is None]
    
    if missing_student_id:
        print(f"   ⚠️  {len(missing_student_id)} marks missing studentId")
    if missing_exam_id:
        print(f"   ⚠️  {len(missing_exam_id)} marks missing examId")  
    if missing_score:
        print(f"   ⚠️  {len(missing_score)} marks missing score")
    
    if not missing_student_id and not missing_exam_id and not missing_score:
        print(f"   ✅ All mark entries have required fields")
    
    print(f"\n🎯 ANSWER: {len(unique_students)} students have marks in the system")

if __name__ == "__main__":
    main()
