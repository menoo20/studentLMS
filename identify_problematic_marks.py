import json
from collections import Counter

# Load marks and students data
with open('public/data/marks.json', 'r', encoding='utf-8') as f:
    marks = json.load(f)

with open('public/data/students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

# Create student ID to name mapping
student_map = {student['id']: student['name'] for student in students}

print("🔍 POTENTIALLY PROBLEMATIC MARKS:")
print("=" * 50)

# Check for marks that might need attention
for i, mark in enumerate(marks):
    student_id = mark['studentId']
    student_name = student_map.get(student_id, "❌ STUDENT NOT FOUND")
    
    # Flag potentially problematic marks
    issues = []
    
    # Check if student exists
    if student_id not in student_map:
        issues.append("STUDENT_NOT_FOUND")
    
    # Check for suspicious student IDs (incomplete or test data)
    if student_id in ['s019', 's1', 's2', 's3', 's4']:
        issues.append("SUSPICIOUS_ID")
    
    # Check for very low scores that might be test data
    if 'score' in mark and mark['score'] < 1:
        issues.append("VERY_LOW_SCORE")
    
    if issues:
        print(f"Mark #{i+1} (Index: {i}):")
        print(f"  ID: {mark['id']}")
        print(f"  Student ID: {student_id}")
        print(f"  Student Name: {student_name}")
        print(f"  Score: {mark.get('score', 'N/A')}")
        print(f"  Issues: {', '.join(issues)}")
        print()

print("\n📋 STUDENTS WITH MULTIPLE MARKS:")
student_counts = Counter([mark['studentId'] for mark in marks])
for student_id, count in sorted(student_counts.items()):
    if count > 1:
        student_name = student_map.get(student_id, "Unknown")
        print(f"{student_id} ({student_name}): {count} marks")
        # Show the marks for this student
        student_marks = [mark for mark in marks if mark['studentId'] == student_id]
        for mark in student_marks:
            print(f"  - {mark['id']}: Score {mark.get('score', 'N/A')} on {mark.get('date', 'N/A')}")
        print()
