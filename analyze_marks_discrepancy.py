import json
from collections import Counter

# Load marks and students data
with open('public/data/marks.json', 'r', encoding='utf-8') as f:
    marks = json.load(f)

with open('public/data/students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

# Create student ID to name mapping
student_map = {student['id']: student['name'] for student in students}

print(f"📊 MARKS ANALYSIS")
print(f"Total marks in marks.json: {len(marks)}")
print(f"Total students in students.json: {len(students)}")

# Count marks by student
student_marks_count = Counter([mark['studentId'] for mark in marks])
print(f"\nUnique students with marks: {len(student_marks_count)}")

print(f"\n📋 MARKS DISTRIBUTION BY STUDENT:")
for student_id, count in sorted(student_marks_count.items()):
    student_name = student_map.get(student_id, "❌ NOT FOUND IN STUDENTS.JSON")
    print(f"{student_id}: {count} marks - {student_name}")

# Find students with marks but not in students.json
marks_student_ids = set(mark['studentId'] for mark in marks)
students_ids = set(student['id'] for student in students)

orphaned_marks = marks_student_ids - students_ids
missing_students = students_ids - marks_student_ids

print(f"\n⚠️  ISSUES FOUND:")
print(f"Students with marks but NOT in students.json: {len(orphaned_marks)}")
for student_id in sorted(orphaned_marks):
    print(f"  - {student_id}")

print(f"\nStudents in students.json but NO marks: {len(missing_students)}")
for student_id in sorted(missing_students):
    student_name = student_map.get(student_id, "Unknown")
    print(f"  - {student_id}: {student_name}")

# Check for duplicate marks
print(f"\n🔍 DUPLICATE ANALYSIS:")
duplicate_keys = []
for mark in marks:
    key = f"{mark['studentId']}_{mark.get('examId', 'no_exam')}"
    duplicate_keys.append(key)

duplicate_counts = Counter(duplicate_keys)
duplicates = {k: v for k, v in duplicate_counts.items() if v > 1}

if duplicates:
    print("Found potential duplicates:")
    for key, count in duplicates.items():
        print(f"  {key}: {count} times")
else:
    print("No obvious duplicates found.")
