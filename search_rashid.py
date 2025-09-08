import json

# Load students data
with open('public/data/students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

# Search for راشد الكليبي
print("🔍 Searching for راشد الكليبي...")
matches = []

for student in students:
    name = student['name']
    if 'راشد' in name and 'كليبي' in name:
        matches.append(student)

if matches:
    print(f"Found {len(matches)} match(es):")
    for student in matches:
        print(f"📋 Student Details:")
        print(f"   Name: {student['name']}")
        print(f"   Group: {student['groupId']}")
        print(f"   Student ID: {student['studentId']}")
        print(f"   Internal ID: {student['id']}")
        print(f"   Position: {student['position']}")
        print(f"   Enrolled: {student['dateEnrolled']}")
        print("-" * 40)
else:
    print("❌ No exact matches found.")
    print("\n🔍 Let me search for similar names:")
    
    # Search for راشد
    rashid_matches = [s for s in students if 'راشد' in s['name']]
    if rashid_matches:
        print(f"\nFound students with 'راشد':")
        for student in rashid_matches:
            print(f"   {student['name']} - {student['groupId']}")
    
    # Search for كليبي
    kalibi_matches = [s for s in students if 'كليبي' in s['name']]
    if kalibi_matches:
        print(f"\nFound students with 'كليبي':")
        for student in kalibi_matches:
            print(f"   {student['name']} - {student['groupId']}")
