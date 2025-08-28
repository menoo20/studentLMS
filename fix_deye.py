import pandas as pd
import json

# Read the Excel file
excel_file = "attendace and timetables/كشوفات الغياب الاسبوعي.xlsx"

try:
    # Get all sheet names first
    xl_file = pd.ExcelFile(excel_file)
    print("Available sheets:", xl_file.sheet_names)
    
    # Look for DEYE sheet
    deye_sheet = None
    for sheet in xl_file.sheet_names:
        if 'DEYE' in sheet.upper():
            deye_sheet = sheet
            break
    
    if not deye_sheet:
        print("❌ Could not find DEYE sheet")
        exit(1)
    
    print(f"📋 Found DEYE sheet: {deye_sheet}")
    
    # Read the DEYE sheet
    df = pd.read_excel(excel_file, sheet_name=deye_sheet, header=None)
    
    # Search for the Names section
    names_row = None
    names_col = None
    
    # Look for "Names" or "الأسماء" or similar
    for i in range(min(20, len(df))):
        for j in range(min(10, len(df.columns))):
            cell_value = str(df.iloc[i, j]).lower()
            if any(keyword in cell_value for keyword in ['name', 'أسماء', 'اسم', 'الاسماء']):
                names_row = i + 1  # Next row should have names
                names_col = j
                print(f"🎯 Found Names section at row {i}, col {j}")
                break
        if names_row:
            break
    
    if not names_row:
        print("❌ Could not find Names section")
        exit(1)
    
    # Extract all student names from the names column
    students = []
    student_counter = 1
    
    # Debug: Print first few rows to understand the structure
    print(f"📋 Checking rows around names_row {names_row}:")
    for check_i in range(max(0, names_row-2), min(len(df), names_row+10)):
        for check_j in range(min(5, len(df.columns))):
            cell_value = df.iloc[check_i, check_j]
            if pd.notna(cell_value):
                print(f"Row {check_i}, Col {check_j}: '{cell_value}'")
    
    # Try different columns if the current one doesn't have names
    actual_names_col = names_col
    
    # Check if we need to look in a different column for actual names
    for test_col in range(min(10, len(df.columns))):
        test_value = df.iloc[names_row, test_col] if names_row < len(df) else None
        if pd.notna(test_value):
            test_str = str(test_value).strip()
            # Check if this looks like an Arabic name (contains Arabic characters)
            if any('\u0600' <= char <= '\u06FF' for char in test_str):
                actual_names_col = test_col
                print(f"🎯 Found Arabic text in column {test_col}: '{test_str}'")
                actual_names_col = test_col
                break
    
    # If no Arabic found, default to column 1 (where names usually are)
    if actual_names_col == names_col and names_col == 0:
        print("🔄 No Arabic found in current column, trying column 1")
        actual_names_col = 1
    
    print(f"📍 Using column {actual_names_col} for names")
    
    # Extract all student names from the names column
    students = []
    student_counter = 1
    
    # Check all rows starting from names_row
    for i in range(names_row, len(df)):
        name = df.iloc[i, actual_names_col]
        if pd.notna(name) and str(name).strip():
            name_str = str(name).strip()
            # Skip header-like entries and numbers
            if (not any(skip_word in name_str.lower() for skip_word in ['name', 'أسماء', 'اسم', 'total', 'المجموع']) 
                and not name_str.isdigit() 
                and len(name_str) > 1):
                print(f"✅ Adding student {student_counter}: '{name_str}'")
                students.append({
                    "id": f"deye_{student_counter:03d}",
                    "name": name_str,
                    "groupId": "deye",
                    "position": "English Trainee"
                })
                student_counter += 1
                
                # Stop if we have enough students
                if student_counter > 35:  # Safety limit
                    break
    
    print(f"📊 Extracted {len(students)} DEYE students")
    
    if len(students) >= 30:  # Accept 30+ students
        # Load current students.json
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            all_students = json.load(f)
        
        # Remove old DEYE students
        all_students = [s for s in all_students if s['groupId'] != 'deye']
        
        # Add new DEYE students
        all_students.extend(students)
        
        # Save updated file
        with open('public/data/students.json', 'w', encoding='utf-8') as f:
            json.dump(all_students, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Updated students.json with {len(students)} DEYE students")
        print(f"📈 Total students now: {len(all_students)}")
    else:
        print(f"⚠️ Only found {len(students)} students, expected 32")
        print("First few students found:")
        for i, student in enumerate(students[:5]):
            print(f"  {i+1}. {student['name']}")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
