import pandas as pd
import json

# Read the Dabal+Fahss sheet specifically
excel_file = "attendace and timetables/كشوفات الغياب الاسبوعي.xlsx"
df = pd.read_excel(excel_file, sheet_name='Dabal +Fahss', header=None)

print(f"Sheet shape: {df.shape}")
print("Looking for all names in Dabal +Fahss:")

# Find the Names section
names_found = False
for i in range(df.shape[0]):
    for j in range(df.shape[1]):
        cell_value = df.iloc[i, j]
        if pd.notna(cell_value) and 'Names' in str(cell_value):
            print(f"Found Names at row {i}, col {j}")
            names_found = True
            
            # Extract all students from this row onwards
            start_row = i + 1
            students = []
            
            for row_idx in range(start_row, df.shape[0]):  # Check all remaining rows
                number = df.iloc[row_idx, j]
                name = df.iloc[row_idx, j + 1]
                
                if pd.notna(number) and pd.notna(name):
                    clean_name = str(name).strip()
                    if clean_name and len(clean_name) > 2:
                        students.append({
                            "number": str(int(number)) if isinstance(number, (int, float)) else str(number),
                            "name": clean_name
                        })
                        print(f"{len(students)}. {clean_name}")
            
            print(f"\nTotal students found: {len(students)}")
            
            # Now update the JSON file
            with open('public/data/students.json', 'r', encoding='utf-8') as f:
                all_students = json.load(f)
            
            # Remove existing Dabal+Fahss students
            all_students = [s for s in all_students if s['groupId'] != 'dabal_fahss']
            
            # Add the corrected Dabal+Fahss students
            for i, student in enumerate(students):
                new_student = {
                    "id": f"s{len(all_students) + i + 1:03d}",
                    "name": student['name'],
                    "studentId": student['number'],
                    "groupId": "dabal_fahss",
                    "email": "",
                    "subject": "English",
                    "position": "Vocational Training",
                    "dateEnrolled": "2024-09-01"
                }
                all_students.append(new_student)
            
            # Save the updated file
            with open('public/data/students.json', 'w', encoding='utf-8') as f:
                json.dump(all_students, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Updated students.json with {len(students)} Dabal+Fahss students")
            break
    if names_found:
        break

if not names_found:
    print("❌ Names section not found!")
