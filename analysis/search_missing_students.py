#!/usr/bin/env python3
"""
Search for Missing Students with Fuzzy Matching
Find students with similar names that might be the missing ones
"""

import json

def load_students():
    """Load students from JSON file"""
    try:
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            students = json.load(f)
        return students
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error loading students: {e}")
        return []

def fuzzy_search(students, target_name):
    """Search for students with similar names"""
    target_words = target_name.split()
    matches = []
    
    for student in students:
        name = student.get('name', '')
        name_words = name.split()
        
        # Count matching words
        matching_words = 0
        for target_word in target_words:
            for name_word in name_words:
                if target_word in name_word or name_word in target_word:
                    matching_words += 1
                    break
        
        # If at least 2 words match, it's a potential match
        if matching_words >= 2:
            matches.append((student, matching_words, len(target_words)))
    
    # Sort by match quality (more matches = better)
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches

def main():
    missing_students = [
        "عباس رائد محمد الدريع",
        "مساعد احمد علي سباعي"
    ]
    
    print("🔍 FUZZY SEARCH FOR MISSING STUDENTS")
    print("="*50)
    
    students = load_students()
    if not students:
        return
    
    for target_name in missing_students:
        print(f"\n🔍 Searching for: {target_name}")
        print("-" * 40)
        
        matches = fuzzy_search(students, target_name)
        
        if matches:
            print(f"Found {len(matches)} potential matches:")
            for i, (student, match_score, total_words) in enumerate(matches[:10], 1):  # Show top 10
                match_percentage = (match_score / total_words) * 100
                print(f"   {i:2}. {student['name']}")
                print(f"       Group: {student.get('groupId', 'No Group')} | ID: {student.get('id')} | Match: {match_percentage:.0f}%")
        else:
            print("   ❌ No similar names found")
    
    # Also search for specific keywords
    print(f"\n" + "="*50)
    print("KEYWORD SEARCHES:")
    print("="*50)
    
    keywords = ["عباس", "رائد", "الدريع", "مساعد", "سباعي"]
    
    for keyword in keywords:
        print(f"\n🔍 Students containing '{keyword}':")
        found = False
        for student in students:
            if keyword in student.get('name', ''):
                print(f"   • {student['name']} (Group: {student.get('groupId')}, ID: {student.get('id')})")
                found = True
        if not found:
            print(f"   ❌ No students found with '{keyword}'")

if __name__ == "__main__":
    main()
