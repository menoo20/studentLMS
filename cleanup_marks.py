#!/usr/bin/env python3
"""
Clean up marks.json:
1. Remove test data (s1, s2, s3, s4)
2. Handle duplicates for remaining missing students
"""

import json
from datetime import datetime

def main():
    print('🧹 CLEANING UP MARKS DATA')
    print('='*50)
    
    # Load marks data
    with open('public/data/marks.json', 'r', encoding='utf-8') as f:
        marks = json.load(f)
    
    print(f'📊 Original marks count: {len(marks)}')
    
    # PART 1: Remove test data (s1, s2, s3, s4)
    test_student_ids = {'s1', 's2', 's3', 's4'}
    
    marks_before_cleanup = len(marks)
    marks = [mark for mark in marks if mark['studentId'] not in test_student_ids]
    marks_after_cleanup = len(marks)
    
    removed_count = marks_before_cleanup - marks_after_cleanup
    print(f'🗑️  Removed test data: {removed_count} marks for students {test_student_ids}')
    print(f'📊 Marks after cleanup: {marks_after_cleanup}')
    
    # PART 2: Analyze duplicates and placement tests
    print(f'\n🔍 ANALYZING DUPLICATES:')
    print('='*40)
    
    # Group marks by student
    student_marks = {}
    for mark in marks:
        student_id = mark['studentId']
        if student_id not in student_marks:
            student_marks[student_id] = []
        student_marks[student_id].append(mark)
    
    duplicates_found = []
    placement_test_duplicates = []
    jolly_phonics_only = []
    
    for student_id, student_mark_list in student_marks.items():
        if len(student_mark_list) > 1:
            duplicates_found.append(student_id)
            
            # Check what types of exams they have
            exam_ids = [m['examId'] for m in student_mark_list]
            has_placement = any('placement' in exam_id.lower() for exam_id in exam_ids)
            has_jolly_phonics = any('jp_' in exam_id or 'jolly' in exam_id.lower() or 'exam_202509' in exam_id for exam_id in exam_ids)
            
            print(f'👥 {student_id}: {len(student_mark_list)} marks')
            for mark in student_mark_list:
                print(f'    • {mark["examId"]}: {mark.get("score", "N/A")} points')
            
            if has_placement:
                placement_test_duplicates.append(student_id)
                print(f'    🎯 Action: Remove placement test duplicate')
            elif has_jolly_phonics:
                jolly_phonics_only.append(student_id)
                print(f'    ✅ Keep: Jolly Phonics evaluations')
            print()
    
    print(f'📊 DUPLICATE ANALYSIS:')
    print(f'• Students with duplicates: {len(duplicates_found)}')
    print(f'• With placement test duplicates: {len(placement_test_duplicates)}')
    print(f'• With Jolly Phonics only: {len(jolly_phonics_only)}')
    
    # Remove placement test duplicates
    marks_to_keep = []
    removed_duplicates = 0
    
    for mark in marks:
        student_id = mark['studentId']
        exam_id = mark['examId']
        
        # If student has duplicates and this is a placement test, remove it
        if (student_id in placement_test_duplicates and 
            ('placement' in exam_id.lower() or exam_id == 'placement_test')):
            removed_duplicates += 1
            print(f'🗑️  Removing duplicate placement test: {student_id} - {exam_id}')
        else:
            marks_to_keep.append(mark)
    
    print(f'\n📊 FINAL CLEANUP:')
    print(f'• Original marks: {marks_before_cleanup}')
    print(f'• Removed test data: {removed_count}')
    print(f'• Removed placement duplicates: {removed_duplicates}')
    print(f'• Final marks: {len(marks_to_keep)}')
    
    # Create backup
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f'public/data/marks_backup_cleanup_{timestamp}.json'
    
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(marks, f, indent=2, ensure_ascii=False)
    print(f'💾 Backup created: {backup_file}')
    
    # Save cleaned marks
    with open('public/data/marks.json', 'w', encoding='utf-8') as f:
        json.dump(marks_to_keep, f, indent=2, ensure_ascii=False)
    
    print(f'✅ Cleaned marks.json saved!')
    
    # Show final stats
    print(f'\n🎯 FINAL STATISTICS:')
    final_students = set(mark['studentId'] for mark in marks_to_keep)
    print(f'• Total evaluations: {len(marks_to_keep)}')
    print(f'• Unique students: {len(final_students)}')
    print(f'• Average evaluations per student: {len(marks_to_keep) / len(final_students):.1f}')

if __name__ == "__main__":
    main()
