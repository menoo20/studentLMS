#!/usr/bin/env python3
"""
Excel to JSON Converter for Student Management System

This script converts Excel files containing student data into JSON format
for use with the Student Management System website.

Usage:
    python excel_to_json.py <excel_file.xlsx>

Requirements:
    pip install pandas openpyxl

Supported sheet names and formats:
- "Students" or "students": Student information
- "Groups" or "groups": Group/class information  
- "Exams" or "exams": Exam definitions
- "Marks" or "marks": Student marks/scores
- "Schedule" or "schedule": Teaching schedule
- "Syllabus" or "syllabus": Curriculum data
- "Resources" or "resources": Educational resources
"""

import pandas as pd
import json
import sys
import os
from datetime import datetime
import uuid

def generate_id():
    """Generate a unique ID for records"""
    return str(uuid.uuid4())[:8]

def clean_data(df):
    """Clean DataFrame by removing empty rows and handling NaN values"""
    # Remove completely empty rows
    df = df.dropna(how='all')
    
    # Fill NaN values with appropriate defaults
    df = df.fillna('')
    
    # Convert all column names to lowercase and replace spaces with underscores
    df.columns = df.columns.str.lower().str.replace(' ', '_')
    
    return df

def convert_students(df):
    """Convert students data to JSON format"""
    df = clean_data(df)
    
    students = []
    for _, row in df.iterrows():
        student = {
            "id": row.get('id', generate_id()),
            "name": str(row.get('name', '')),
            "email": str(row.get('email', '')),
            "groupId": str(row.get('group_id', row.get('group', ''))),
            "studentId": str(row.get('student_id', row.get('student_number', ''))),
            "dateEnrolled": str(row.get('date_enrolled', row.get('enrollment_date', '')))
        }
        students.append(student)
    
    return students

def convert_groups(df):
    """Convert groups data to JSON format"""
    df = clean_data(df)
    
    groups = []
    for _, row in df.iterrows():
        group = {
            "id": str(row.get('id', generate_id())),
            "name": str(row.get('name', '')),
            "description": str(row.get('description', '')),
            "year": str(row.get('year', datetime.now().year)),
            "semester": str(row.get('semester', ''))
        }
        groups.append(group)
    
    return groups

def convert_exams(df):
    """Convert exams data to JSON format"""
    df = clean_data(df)
    
    exams = []
    for _, row in df.iterrows():
        exam = {
            "id": str(row.get('id', generate_id())),
            "name": str(row.get('name', '')),
            "subject": str(row.get('subject', '')),
            "date": str(row.get('date', '')),
            "maxScore": int(row.get('max_score', row.get('total_marks', 100))),
            "type": str(row.get('type', 'exam'))
        }
        exams.append(exam)
    
    return exams

def convert_marks(df):
    """Convert marks data to JSON format"""
    df = clean_data(df)
    
    marks = []
    for _, row in df.iterrows():
        mark = {
            "id": str(row.get('id', generate_id())),
            "studentId": str(row.get('student_id', '')),
            "examId": str(row.get('exam_id', '')),
            "score": float(row.get('score', row.get('mark', 0))),
            "date": str(row.get('date', ''))
        }
        marks.append(mark)
    
    return marks

def convert_schedule(df):
    """Convert schedule data to JSON format"""
    df = clean_data(df)
    
    schedule = []
    for _, row in df.iterrows():
        item = {
            "id": str(row.get('id', generate_id())),
            "date": str(row.get('date', '')),
            "time": str(row.get('time', '')),
            "subject": str(row.get('subject', '')),
            "group": str(row.get('group', '')),
            "room": str(row.get('room', '')),
            "type": str(row.get('type', 'Lecture')),
            "duration": str(row.get('duration', ''))
        }
        schedule.append(item)
    
    return schedule

def convert_syllabus(df):
    """Convert syllabus data to JSON format"""
    df = clean_data(df)
    
    syllabus = []
    for _, row in df.iterrows():
        # Parse subtopics if they exist (comma-separated)
        subtopics = []
        if row.get('subtopics', ''):
            subtopic_names = str(row.get('subtopics')).split(',')
            for name in subtopic_names:
                subtopics.append({
                    "name": name.strip(),
                    "completed": False
                })
        
        # Parse objectives if they exist (comma-separated)
        objectives = []
        if row.get('objectives', ''):
            objectives = [obj.strip() for obj in str(row.get('objectives')).split(',')]
        
        # Parse resources if they exist (comma-separated)
        resources = []
        if row.get('resources', ''):
            resources = [res.strip() for res in str(row.get('resources')).split(',')]
        
        item = {
            "id": str(row.get('id', generate_id())),
            "subject": str(row.get('subject', '')),
            "unit": str(row.get('unit', '')),
            "topic": str(row.get('topic', '')),
            "description": str(row.get('description', '')),
            "duration": str(row.get('duration', '')),
            "status": str(row.get('status', 'not-started')),
            "startDate": str(row.get('start_date', '')),
            "endDate": str(row.get('end_date', '')),
            "resources": resources,
            "objectives": objectives,
            "subtopics": subtopics
        }
        syllabus.append(item)
    
    return syllabus

def convert_resources(df):
    """Convert resources data to JSON format"""
    df = clean_data(df)
    
    resources = []
    for _, row in df.iterrows():
        # Parse tags if they exist (comma-separated)
        tags = []
        if row.get('tags', ''):
            tags = [tag.strip() for tag in str(row.get('tags')).split(',')]
        
        resource = {
            "id": str(row.get('id', generate_id())),
            "title": str(row.get('title', '')),
            "description": str(row.get('description', '')),
            "category": str(row.get('category', '')),
            "type": str(row.get('type', '')),
            "url": str(row.get('url', '')),
            "tags": tags,
            "dateAdded": str(row.get('date_added', datetime.now().strftime('%Y-%m-%d'))),
            "size": str(row.get('size', ''))
        }
        resources.append(resource)
    
    return resources

def convert_excel_to_json(excel_file):
    """Main function to convert Excel file to JSON files"""
    try:
        # Read all sheets from the Excel file
        xl_file = pd.ExcelFile(excel_file)
        
        print(f"Found sheets: {xl_file.sheet_names}")
        
        # Create output directory if it doesn't exist
        output_dir = "public/data"
        os.makedirs(output_dir, exist_ok=True)
        
        converters = {
            'students': convert_students,
            'groups': convert_groups,
            'exams': convert_exams,
            'marks': convert_marks,
            'schedule': convert_schedule,
            'syllabus': convert_syllabus,
            'resources': convert_resources
        }
        
        converted_files = []
        
        for sheet_name in xl_file.sheet_names:
            sheet_name_lower = sheet_name.lower()
            
            # Find matching converter
            converter = None
            output_filename = None
            
            for key, conv_func in converters.items():
                if key in sheet_name_lower:
                    converter = conv_func
                    output_filename = f"{key}.json"
                    break
            
            if converter:
                print(f"Converting sheet '{sheet_name}' to {output_filename}...")
                
                # Read the sheet
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                
                # Convert to JSON format
                json_data = converter(df)
                
                # Write to JSON file
                output_path = os.path.join(output_dir, output_filename)
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(json_data, f, indent=2, ensure_ascii=False)
                
                converted_files.append(output_filename)
                print(f"✓ Created {output_path} with {len(json_data)} records")
            else:
                print(f"⚠ Skipping sheet '{sheet_name}' - no matching converter found")
        
        print(f"\n✅ Conversion complete! Created {len(converted_files)} JSON files:")
        for filename in converted_files:
            print(f"   - {output_dir}/{filename}")
        
        print(f"\n📝 Next steps:")
        print(f"   1. Review the generated JSON files in the '{output_dir}' directory")
        print(f"   2. Run 'npm run dev' to start the development server")
        print(f"   3. Visit http://localhost:5173/my-annual-plan/ to view your data")
        
    except Exception as e:
        print(f"❌ Error converting Excel file: {str(e)}")
        return False
    
    return True

def print_usage():
    """Print usage instructions"""
    print("""
Excel to JSON Converter for Student Management System

Usage:
    python excel_to_json.py <excel_file.xlsx>

Supported Excel sheet names (case-insensitive):
    - Students: Student information (name, email, group, etc.)
    - Groups: Class/group definitions
    - Exams: Exam definitions (name, date, max score, etc.)
    - Marks: Student marks/scores for exams
    - Schedule: Teaching schedule (date, time, subject, room, etc.)
    - Syllabus: Curriculum and syllabus data
    - Resources: Educational resources and file links

Required columns for each sheet:
    Students: name, email, group_id (or group)
    Groups: name, description
    Exams: name, subject, date, max_score (or total_marks)
    Marks: student_id, exam_id, score (or mark)
    Schedule: date, time, subject, group, room
    Syllabus: subject, unit, topic, description, duration, status
    Resources: title, description, category, type, url

Example:
    python excel_to_json.py student_data.xlsx
    """)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print_usage()
        sys.exit(1)
    
    excel_file = sys.argv[1]
    
    if not os.path.exists(excel_file):
        print(f"❌ Error: File '{excel_file}' not found")
        sys.exit(1)
    
    if not excel_file.lower().endswith(('.xlsx', '.xls')):
        print(f"❌ Error: File must be an Excel file (.xlsx or .xls)")
        sys.exit(1)
    
    print(f"🔄 Converting {excel_file} to JSON format...")
    
    if convert_excel_to_json(excel_file):
        print("✅ Conversion completed successfully!")
    else:
        print("❌ Conversion failed!")
        sys.exit(1)
