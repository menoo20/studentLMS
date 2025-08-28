import pandas as pd
import json
import os

# Read the Excel file
excel_file = "attendace and timetables/كشوفات الغياب الاسبوعي.xlsx"

# Get all sheet names
xl_file = pd.ExcelFile(excel_file)
print("Processing sheets:", xl_file.sheet_names)

groups = []
students = []
student_id_counter = 1

def clean_name(name):
    """Clean student name"""
    if pd.isna(name):
        return ""
    return str(name).strip()

def get_position_from_sheet(df):
    """Extract position/training from sheet"""
    for i in range(min(10, df.shape[0])):
        for j in range(df.shape[1]):
            cell_value = df.iloc[i, j]
            if pd.notna(cell_value):
                cell_str = str(cell_value).strip()
                if cell_str in ['Welding', 'Electronics', 'Mechanical', 'Electrical', 'Plumbing', 'HVAC']:
                    return cell_str
    return "Vocational Training"  # Default

# Process each sheet
for sheet_name in xl_file.sheet_names:
    print(f"\nProcessing sheet: {sheet_name}")
    
    try:
        # Read the sheet
        df = pd.read_excel(excel_file, sheet_name=sheet_name, header=None)
        
        # Get position/training specialty
        position = get_position_from_sheet(df)
        print(f"Position detected: {position}")
        
        # Create group
        group_id = sheet_name.strip().lower().replace(' ', '').replace('+', '_')
        group = {
            "id": group_id,
            "name": sheet_name.strip(),
            "description": f"English Class - {position}",
            "subject": "English",
            "position": position,
            "year": "2024-2025",
            "semester": "Fall"
        }
        groups.append(group)
        
        # Find Names header and extract students
        names_found = False
        for i in range(df.shape[0]):
            for j in range(df.shape[1]):
                cell_value = df.iloc[i, j]
                if pd.notna(cell_value) and 'Names' in str(cell_value):
                    print(f"Found Names at row {i}, col {j}")
                    names_found = True
                    
                    # Extract students from the rows below
                    start_row = i + 1
                    for row_idx in range(start_row, min(start_row + 25, df.shape[0])):
                        # Number in first column, name in second column
                        number = df.iloc[row_idx, j]
                        name = df.iloc[row_idx, j + 1]
                        
                        if pd.notna(number) and pd.notna(name):
                            clean_student_name = clean_name(name)
                            if clean_student_name and len(clean_student_name) > 2:
                                student = {
                                    "id": f"s{student_id_counter:03d}",
                                    "name": clean_student_name,
                                    "studentId": str(int(number)) if isinstance(number, (int, float)) else str(number),
                                    "groupId": group_id,
                                    "email": "",
                                    "subject": "English",
                                    "position": position,
                                    "dateEnrolled": "2024-09-01"
                                }
                                students.append(student)
                                student_id_counter += 1
                                print(f"  Added: {clean_student_name}")
                    break
            if names_found:
                break
        
        if not names_found:
            print(f"  No Names section found in {sheet_name}")
        
    except Exception as e:
        print(f"Error processing {sheet_name}: {e}")

print(f"\nTotal groups: {len(groups)}")
print(f"Total students: {len(students)}")

# Create output directory
os.makedirs("public/data", exist_ok=True)

# Save groups
with open("public/data/groups.json", "w", encoding="utf-8") as f:
    json.dump(groups, f, indent=2, ensure_ascii=False)

# Save students  
with open("public/data/students.json", "w", encoding="utf-8") as f:
    json.dump(students, f, indent=2, ensure_ascii=False)

print(f"\n✅ Created public/data/groups.json with {len(groups)} groups")
print(f"✅ Created public/data/students.json with {len(students)} students")

# Display summary
print(f"\n📊 Groups Summary:")
for group in groups:
    group_students = [s for s in students if s['groupId'] == group['id']]
    print(f"  {group['name']}: {len(group_students)} students ({group['position']})")

print(f"\n🎓 Ready! Your English class data is now loaded!")
print(f"Visit: http://localhost:5173/my-annual-plan/students")
