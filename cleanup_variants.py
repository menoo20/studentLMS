#!/usr/bin/env python3
"""
Clean up old/new syllabus and schedule variants that are no longer needed
"""

import os
import shutil
from datetime import datetime

def analyze_active_vs_legacy():
    """Analyze which files are actively used vs legacy"""
    print("🔍 ANALYZING ACTIVE vs LEGACY FILES")
    print("="*50)
    
    # Files actively used by the current app (based on App.jsx routes)
    ACTIVE_COMPONENTS = {
        'Schedule.jsx': 'weekly_schedule_template.json',  # Current schedule page
        'Syllabus.jsx': ['syllabus.json', 'syllabus_new.json', 'syllabus_jolly_phonics.json']  # Current syllabus page
    }
    
    # Files that appear to be legacy/backup
    LEGACY_FILES = [
        # Legacy schedule files
        'src/pages/Schedule_old_backup.jsx',
        'src/pages/Schedule_new.jsx', 
        'src/pages/Schedule_static.jsx',
        
        # Legacy syllabus files  
        'src/pages/Syllabus_old.jsx',
        'src/pages/Syllabus_new.jsx',
        'src/pages/Syllabus_fixed.jsx',
        
        # Empty/unused data files
        'public/data/schedule.json',  # 0 bytes - empty
        
        # Legacy data files that might not be needed
        'public/data/syllabus_old.json',  # Old syllabus format
        'public/data/weekly_schedule_template_new.json',  # Potentially unused template
        'public/data/schedule_old_backup.json'  # If it exists
    ]
    
    print("✅ CURRENTLY ACTIVE:")
    print("-" * 30)
    print("📄 src/pages/Schedule.jsx → uses weekly_schedule_template.json")
    print("📄 src/pages/Syllabus.jsx → uses syllabus.json, syllabus_new.json, syllabus_jolly_phonics.json")
    print("📄 Routes in App.jsx → /schedule, /syllabus")
    
    print("\n❓ POTENTIALLY LEGACY:")
    print("-" * 30)
    for file in LEGACY_FILES:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"📄 {file} ({size:,} bytes)")
    
    return LEGACY_FILES

def check_file_safety(file):
    """Check if a file is safe to delete"""
    if not os.path.exists(file):
        return False, "File doesn't exist"
    
    # Check if it's referenced in active components
    active_files = [
        'src/App.jsx',
        'src/pages/Schedule.jsx', 
        'src/pages/Syllabus.jsx',
        'src/pages/Home.jsx',
        'src/pages/Students.jsx',
        'src/pages/Exams.jsx'
    ]
    
    filename = os.path.basename(file)
    for active_file in active_files:
        if os.path.exists(active_file):
            try:
                with open(active_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if filename in content or file in content:
                        return False, f"Referenced in {active_file}"
            except:
                continue
    
    # Special checks
    if file == 'public/data/schedule.json':
        size = os.path.getsize(file)
        if size == 0:
            return True, "Empty file"
    
    if 'old' in file.lower() or 'backup' in file.lower():
        return True, "Legacy/backup file"
        
    if file.endswith(('_old.jsx', '_new.jsx', '_backup.jsx', '_static.jsx', '_fixed.jsx')):
        return True, "Legacy component file"
    
    return False, "Potentially still needed"

def perform_cleanup():
    """Perform the cleanup of legacy files"""
    print(f"\n🧹 PERFORMING CLEANUP")
    print("="*40)
    
    legacy_files = analyze_active_vs_legacy()
    
    files_to_delete = []
    total_size = 0
    
    for file in legacy_files:
        if os.path.exists(file):
            is_safe, reason = check_file_safety(file)
            size = os.path.getsize(file)
            
            if is_safe:
                files_to_delete.append((file, size, reason))
                total_size += size
                print(f"🗑️ WILL DELETE: {file} ({size:,} bytes) - {reason}")
            else:
                print(f"✅ KEEPING: {file} ({size:,} bytes) - {reason}")
    
    if not files_to_delete:
        print("✅ No legacy files to delete!")
        return
    
    print(f"\n📊 SUMMARY:")
    print(f"Files to delete: {len(files_to_delete)}")
    print(f"Space to save: {total_size:,} bytes")
    
    # Confirm deletion
    print(f"\n❓ Proceed with deletion? (y/n): ", end="")
    
    # For automation, we'll proceed (comment out for manual confirmation)
    proceed = True  # input().strip().lower() == 'y'
    
    if not proceed:
        print("❌ Cleanup cancelled")
        return
    
    # Perform deletion
    deleted_count = 0
    deleted_size = 0
    
    print(f"\n🗑️ DELETING FILES:")
    print("-" * 30)
    
    for file, size, reason in files_to_delete:
        try:
            if os.path.isfile(file):
                os.remove(file)
                print(f"✅ Deleted: {file} ({size:,} bytes)")
                deleted_count += 1
                deleted_size += size
            elif os.path.isdir(file):
                shutil.rmtree(file)
                print(f"✅ Deleted directory: {file}")
                deleted_count += 1
        except Exception as e:
            print(f"❌ Failed to delete {file}: {e}")
    
    print(f"\n🎉 CLEANUP COMPLETE!")
    print(f"✅ Deleted {deleted_count} legacy files")
    print(f"💾 Saved {deleted_size:,} bytes")
    
    # Show what remains active
    print(f"\n📋 ACTIVE FILES REMAINING:")
    print("-" * 30)
    active_data_files = [
        'public/data/syllabus.json',
        'public/data/syllabus_new.json', 
        'public/data/syllabus_jolly_phonics.json',
        'public/data/weekly_schedule_template.json',
        'public/data/weekly_schedule.json'
    ]
    
    for file in active_data_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"✅ {file} ({size:,} bytes)")

def main():
    print("🗂️ SYLLABUS & SCHEDULE VARIANT CLEANUP")
    print("="*60)
    print("This will remove old/legacy syllabus and schedule files")
    print("while keeping the active ones used by the current app.")
    print()
    
    perform_cleanup()

if __name__ == "__main__":
    main()
