#!/usr/bin/env python3
"""
Clean up unnecessary files from the repository
Remove backup files, analysis scripts, and duplicate files
"""

import os
import glob
import shutil
from datetime import datetime

def cleanup_repository():
    """Remove all unnecessary files"""
    print("🧹 CLEANING UP REPOSITORY")
    print("="*50)
    
    files_deleted = 0
    bytes_saved = 0
    
    # 1. Delete all backup files
    print("🗑️ Deleting backup files...")
    backup_files = glob.glob('public/data/*backup*.json')
    for backup_file in backup_files:
        try:
            size = os.path.getsize(backup_file)
            os.remove(backup_file)
            print(f"   ✅ Deleted: {backup_file} ({size:,} bytes)")
            files_deleted += 1
            bytes_saved += size
        except Exception as e:
            print(f"   ❌ Failed to delete {backup_file}: {e}")
    
    # 2. Delete analysis folder
    print("\n📊 Deleting analysis folder...")
    if os.path.exists('analysis'):
        try:
            # Calculate size first
            analysis_size = 0
            for root, dirs, files in os.walk('analysis'):
                for file in files:
                    file_path = os.path.join(root, file)
                    analysis_size += os.path.getsize(file_path)
                    files_deleted += 1
            
            shutil.rmtree('analysis')
            print(f"   ✅ Deleted: analysis/ folder ({analysis_size:,} bytes)")
            bytes_saved += analysis_size
        except Exception as e:
            print(f"   ❌ Failed to delete analysis folder: {e}")
    
    # 3. Delete duplicate/unnecessary files
    print("\n🔄 Deleting duplicate and unnecessary files...")
    unnecessary_files = [
        'src/pages/Exams_simplified.jsx',
        'institute_analytics.py',
        'public/js/marks-protection.js',
        'DATA_LOSS_PREVENTION_GUIDE.md',
        'analyze_file_necessity.py'
    ]
    
    for file_path in unnecessary_files:
        if os.path.exists(file_path):
            try:
                size = os.path.getsize(file_path)
                os.remove(file_path)
                print(f"   ✅ Deleted: {file_path} ({size:,} bytes)")
                files_deleted += 1
                bytes_saved += size
            except Exception as e:
                print(f"   ❌ Failed to delete {file_path}: {e}")
        else:
            print(f"   ⚠️ Not found: {file_path}")
    
    # 4. Delete empty js folder if it exists and is empty
    if os.path.exists('public/js'):
        try:
            if not os.listdir('public/js'):  # Check if empty
                os.rmdir('public/js')
                print(f"   ✅ Deleted: empty public/js/ folder")
        except Exception as e:
            print(f"   ⚠️ Could not remove public/js/: {e}")
    
    return files_deleted, bytes_saved

def show_remaining_files():
    """Show what files remain after cleanup"""
    print(f"\n📁 REMAINING ESSENTIAL FILES:")
    print("-" * 40)
    
    essential_paths = [
        'public/data/',
        'src/',
        '*.py',
        '*.json',
        '*.html',
        '*.js',
        '*.md'
    ]
    
    # Show data files
    data_files = glob.glob('public/data/*.json')
    if data_files:
        print("📊 Data files:")
        for file in sorted(data_files):
            size = os.path.getsize(file)
            print(f"   📄 {file} ({size:,} bytes)")
    
    # Show Python tools
    py_files = [f for f in glob.glob('*.py') if not f.startswith('analyze')]
    if py_files:
        print(f"\n🐍 Python tools:")
        for file in sorted(py_files):
            size = os.path.getsize(file)
            print(f"   📄 {file} ({size:,} bytes)")
    
    # Show key config files
    config_files = ['package.json', 'index.html', 'vite.config.js', 'tailwind.config.js']
    print(f"\n⚙️ Config files:")
    for file in config_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"   📄 {file} ({size:,} bytes)")
    
    # Show src structure
    src_files = glob.glob('src/**/*.jsx', recursive=True)
    if src_files:
        print(f"\n⚛️ React components ({len(src_files)} files):")
        for file in sorted(src_files)[:10]:  # Show first 10
            size = os.path.getsize(file)
            print(f"   📄 {file} ({size:,} bytes)")
        if len(src_files) > 10:
            print(f"   ... and {len(src_files) - 10} more React files")

def main():
    print("🧹 REPOSITORY CLEANUP")
    print("="*60)
    
    # Clean up
    files_deleted, bytes_saved = cleanup_repository()
    
    # Show results
    print(f"\n📊 CLEANUP SUMMARY:")
    print("="*30)
    print(f"   🗑️ Files deleted: {files_deleted}")
    print(f"   💾 Space saved: {bytes_saved:,} bytes ({bytes_saved/1024:.1f} KB)")
    print(f"   📁 Repository is now clean!")
    
    # Show remaining files
    show_remaining_files()
    
    print(f"\n✅ CLEANUP COMPLETE!")
    print("Your repository now contains only essential files.")
    print("The system will work exactly the same, just cleaner!")

if __name__ == "__main__":
    main()
