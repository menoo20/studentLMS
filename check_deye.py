import json

# Load the students data
with open('public/data/students.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Filter DEYE students
deye_students = [s for s in data if s['groupId'] == 'deye']

print(f"Total DEYE students: {len(deye_students)}")
print("\nFirst 5 DEYE students:")
for i, student in enumerate(deye_students[:5]):
    print(f"{i+1}. ID: {student['id']}")
    print(f"   Name: '{student['name']}'")
    print(f"   Position: {student.get('position', 'N/A')}")
    print()

print("\nLast 3 DEYE students:")
for i, student in enumerate(deye_students[-3:]):
    print(f"{len(deye_students)-2+i}. ID: {student['id']}")
    print(f"   Name: '{student['name']}'")
    print(f"   Position: {student.get('position', 'N/A')}")
    print()
