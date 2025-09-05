#!/usr/bin/env python3
"""
Analyze which syllabus files and old/new variants are actually used
and remove the ones that are no longer needed
"""

import os
import json
import glob
from datetime import datetime

def analyze_file_usage():
    """Analyze which files are actually used in the codebase"""
    print("🔍 ANALYZING FILE USAGE")
    print("="*50)
    
    # Files to check for usage
    data_files = glob.glob('public/data/*.json')
    
    # Group similar files
    file_groups = {}
    for file in data_files:
        basename = os.path.basename(file)
        
        # Group by base name (without _old, _new, etc.)
        base_name = basename.replace('_old', '').replace('_new', '').replace('_backup', '').replace('_template', '')
        
        if base_name not in file_groups:
            file_groups[base_name] = []
        file_groups[base_name].append(file)
    
    print("📊 FILE GROUPS FOUND:")
    print("-" * 30)
    for base_name, files in file_groups.items():
        if len(files) > 1:  # Only show groups with multiple files
            print(f"\n📁 {base_name}:")
            for file in sorted(files):
                size = os.path.getsize(file)
                print(f"   📄 {file} ({size:,} bytes)")
    
    return file_groups

def check_usage_in_code(filename):
    """Check if a file is referenced in the React code or Python scripts"""
    filename_only = os.path.basename(filename)
    usage_count = 0
    used_in = []
    
    # Check in React files
    react_files = glob.glob('src/**/*.jsx', recursive=True) + glob.glob('src/**/*.js', recursive=True)
    for react_file in react_files:
        try:
            with open(react_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if filename_only in content:
                    usage_count += 1
                    used_in.append(react_file)
        except:
            continue
    
    # Check in Python files
    py_files = glob.glob('*.py')
    for py_file in py_files:
        try:
            with open(py_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if filename_only in content:
                    usage_count += 1
                    used_in.append(py_file)
        except:
            continue
    
    return usage_count, used_in

def analyze_specific_files():
    """Analyze specific file groups that might have old/new variants"""
    print(f"\n🎯 ANALYZING SPECIFIC FILE GROUPS:")
    print("="*50)
    
    # Syllabus files
    syllabus_files = [
        'public/data/syllabus.json',
        'public/data/syllabus_old.json', 
        'public/data/syllabus_new.json',
        'public/data/syllabus_jolly_phonics.json'
    ]
    
    print("📚 SYLLABUS FILES:")
    print("-" * 30)
    for file in syllabus_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            usage_count, used_in = check_usage_in_code(file)
            
            print(f"📄 {file} ({size:,} bytes)")
            if usage_count > 0:
                print(f"   ✅ Used in {usage_count} files: {', '.join(used_in[:3])}")
            else:
                print(f"   ❌ Not used in any code")
            
            # Check if it has actual content
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        print(f"   📊 Contains {len(data)} items")
                    elif isinstance(data, dict):
                        print(f"   📊 Contains {len(data.keys())} keys")
            except:
                print(f"   ⚠️ Could not read JSON content")
            print()
    
    # Schedule files
    schedule_files = [
        'public/data/schedule.json',
        'public/data/weekly_schedule.json',
        'public/data/weekly_schedule_template.json',
        'public/data/weekly_schedule_template_new.json'
    ]
    
    print("📅 SCHEDULE FILES:")
    print("-" * 30)
    for file in schedule_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            usage_count, used_in = check_usage_in_code(file)
            
            print(f"📄 {file} ({size:,} bytes)")
            if usage_count > 0:
                print(f"   ✅ Used in {usage_count} files: {', '.join(used_in[:3])}")
            else:
                print(f"   ❌ Not used in any code")
            
            # Check content
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if not content or content == '[]' or content == '{}':
                        print(f"   📭 File is empty")
                    else:
                        print(f"   📊 Has content")
            except:
                print(f"   ⚠️ Could not read file")
            print()

def identify_files_to_delete():
    """Identify which files can be safely deleted"""
    print(f"🗑️ SAFE TO DELETE:")
    print("="*30)
    
    files_to_delete = []
    
    # Check each file for usage and content
    candidates = [
        'public/data/syllabus_old.json',
        'public/data/syllabus_new.json', 
        'public/data/schedule.json',  # Often empty
        'public/data/weekly_schedule_template_new.json'
    ]
    
    for file in candidates:
        if os.path.exists(file):
            size = os.path.getsize(file)
            usage_count, used_in = check_usage_in_code(file)
            
            # Check if file is empty or has minimal content
            is_empty = False
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if not content or content in ['[]', '{}', '0']:
                        is_empty = True
            except:
                pass
            
            if usage_count == 0 or is_empty:
                print(f"🗑️ {file} ({size:,} bytes)")
                if usage_count == 0:
                    print(f"   ❌ Not used in any code")
                if is_empty:
                    print(f"   📭 File is empty/minimal")
                files_to_delete.append(file)
                print()
    
    return files_to_delete

def recommend_cleanup(files_to_delete):
    """Recommend which files to clean up"""
    print(f"💡 CLEANUP RECOMMENDATIONS:")
    print("="*50)
    
    if not files_to_delete:
        print("✅ No unnecessary files found!")
        return
    
    total_size = sum(os.path.getsize(f) for f in files_to_delete if os.path.exists(f))
    
    print(f"🗑️ SAFE TO DELETE ({len(files_to_delete)} files, {total_size:,} bytes):")
    for file in files_to_delete:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"   • {file} ({size:,} bytes)")
    
    print(f"\n✅ KEEP (actively used):")
    keep_files = [
        'public/data/syllabus.json',
        'public/data/syllabus_jolly_phonics.json',
        'public/data/weekly_schedule.json',
        'public/data/weekly_schedule_template.json'
    ]
    
    for file in keep_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            usage_count, used_in = check_usage_in_code(file)
            status = "✅ Used" if usage_count > 0 else "📊 Data file"
            print(f"   • {file} ({size:,} bytes) - {status}")

def main():
    print("🧹 SYLLABUS & VARIANT FILE CLEANUP")
    print("="*60)
    
    # Analyze file groups
    file_groups = analyze_file_usage()
    
    # Analyze specific files
    analyze_specific_files()
    
    # Identify files to delete
    files_to_delete = identify_files_to_delete()
    
    # Provide recommendations
    recommend_cleanup(files_to_delete)
    
    # Ask for confirmation
    print(f"\n❓ Would you like me to delete the unnecessary files?")
    print("This will clean up old/unused variants and save space.")
    
    return files_to_delete

if __name__ == "__main__":
    files_to_delete = main()
    
    # For automation, we'll return the list
    if files_to_delete:
        print(f"\n🎯 Found {len(files_to_delete)} files that can be safely deleted.")
    else:
        print(f"\n✅ No unnecessary variant files found!")
