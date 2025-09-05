#!/usr/bin/env python3
"""
Institute Analytics Script
This script generates comprehensive reports for institute-level analysis
"""

import json
import os
from datetime import datetime, timedelta
from collections import defaultdict
import statistics

def load_data():
    """Load all data from JSON files"""
    try:
        with open('public/data/students.json', 'r', encoding='utf-8') as f:
            students = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        students = []

    try:
        with open('public/data/groups.json', 'r', encoding='utf-8') as f:
            groups = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        groups = []

    try:
        with open('public/data/exams.json', 'r', encoding='utf-8') as f:
            exams = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        exams = []

    try:
        with open('public/data/marks.json', 'r', encoding='utf-8') as f:
            marks = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        marks = []

    return students, groups, exams, marks

def generate_institute_report(students, groups, exams, marks):
    """Generate comprehensive institute analytics report"""
    
    print("🏛️ INSTITUTE COMPREHENSIVE ANALYTICS REPORT")
    print("=" * 80)
    print(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Basic Statistics
    print(f"\n📊 OVERALL STATISTICS:")
    print(f"   • Total Students: {len(students)}")
    print(f"   • Total Groups: {len(groups)}")
    print(f"   • Total Exams: {len(exams)}")
    print(f"   • Total Evaluations: {len(marks)}")
    
    # Overall Performance
    if marks:
        overall_scores = [float(mark.get('percentage', 0)) for mark in marks if mark.get('percentage')]
        overall_avg = statistics.mean(overall_scores) if overall_scores else 0
        overall_median = statistics.median(overall_scores) if overall_scores else 0
        
        print(f"\n🎯 INSTITUTE PERFORMANCE:")
        print(f"   • Average Score: {overall_avg:.1f}%")
        print(f"   • Median Score: {overall_median:.1f}%")
        print(f"   • Highest Score: {max(overall_scores):.1f}%" if overall_scores else "   • No scores available")
        print(f"   • Lowest Score: {min(overall_scores):.1f}%" if overall_scores else "")
    
    # Performance Distribution
    excellent = len([m for m in marks if float(m.get('percentage', 0)) >= 90])
    good = len([m for m in marks if 70 <= float(m.get('percentage', 0)) < 90])
    average = len([m for m in marks if 50 <= float(m.get('percentage', 0)) < 70])
    poor = len([m for m in marks if float(m.get('percentage', 0)) < 50])
    
    print(f"\n📈 PERFORMANCE DISTRIBUTION:")
    print(f"   • Excellent (≥90%): {excellent} ({(excellent/len(marks)*100):.1f}%)" if marks else "   • No data available")
    if marks:
        print(f"   • Good (70-89%): {good} ({(good/len(marks)*100):.1f}%)")
        print(f"   • Average (50-69%): {average} ({(average/len(marks)*100):.1f}%)")
        print(f"   • Needs Help (<50%): {poor} ({(poor/len(marks)*100):.1f}%)")
    
    # Group Analysis
    print(f"\n👥 GROUP PERFORMANCE ANALYSIS:")
    print("-" * 80)
    group_data = []
    
    for group in groups:
        group_students = [s for s in students if s.get('groupId') == group.get('id')]
        group_marks = [m for m in marks if any(s.get('id') == m.get('studentId') for s in group_students)]
        
        if group_marks:
            group_scores = [float(m.get('percentage', 0)) for m in group_marks if m.get('percentage')]
            group_avg = statistics.mean(group_scores) if group_scores else 0
        else:
            group_avg = 0
            
        evaluation_rate = (len(group_marks) / (len(group_students) * len(exams)) * 100) if group_students and exams else 0
        
        group_data.append({
            'name': group.get('name', 'Unknown'),
            'students': len(group_students),
            'avg_score': group_avg,
            'evaluations': len(group_marks),
            'evaluation_rate': evaluation_rate
        })
    
    # Sort by average score
    group_data.sort(key=lambda x: x['avg_score'], reverse=True)
    
    print(f"{'Rank':<6} {'Group Name':<25} {'Students':<10} {'Avg Score':<12} {'Evaluations':<12} {'Completion':<10}")
    print("-" * 80)
    
    for i, group in enumerate(group_data, 1):
        rank_symbol = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i:2d}"
        print(f"{rank_symbol:<6} {group['name']:<25} {group['students']:<10} {group['avg_score']:<12.1f} {group['evaluations']:<12} {group['evaluation_rate']:<10.1f}%")
    
    # Exam Analysis
    print(f"\n📚 EXAM PERFORMANCE ANALYSIS:")
    print("-" * 80)
    
    exam_data = []
    for exam in exams:
        exam_marks = [m for m in marks if m.get('examId') == exam.get('id')]
        if exam_marks:
            exam_scores = [float(m.get('percentage', 0)) for m in exam_marks if m.get('percentage')]
            exam_avg = statistics.mean(exam_scores) if exam_scores else 0
        else:
            exam_avg = 0
            
        exam_data.append({
            'name': exam.get('name', 'Unknown'),
            'type': exam.get('type', 'N/A'),
            'avg_score': exam_avg,
            'participants': len(exam_marks),
            'max_score': exam.get('maxScore', 'N/A')
        })
    
    exam_data.sort(key=lambda x: x['avg_score'], reverse=True)
    
    print(f"{'Exam Name':<30} {'Type':<10} {'Avg Score':<12} {'Participants':<12} {'Max Points':<10}")
    print("-" * 80)
    
    for exam in exam_data:
        print(f"{exam['name']:<30} {exam['type']:<10} {exam['avg_score']:<12.1f} {exam['participants']:<12} {exam['max_score']:<10}")
    
    # Top Performers
    print(f"\n🌟 TOP PERFORMING STUDENTS:")
    print("-" * 50)
    
    student_performance = defaultdict(list)
    for mark in marks:
        if mark.get('percentage'):
            student_performance[mark.get('studentId')].append(float(mark.get('percentage')))
    
    student_averages = []
    for student_id, scores in student_performance.items():
        student = next((s for s in students if s.get('id') == student_id), None)
        if student:
            avg_score = statistics.mean(scores)
            student_averages.append({
                'name': student.get('name', 'Unknown'),
                'group': student.get('groupId', 'N/A'),
                'avg_score': avg_score,
                'exams_taken': len(scores)
            })
    
    student_averages.sort(key=lambda x: x['avg_score'], reverse=True)
    
    print(f"{'Rank':<6} {'Student Name':<35} {'Group':<15} {'Avg Score':<12} {'Exams':<6}")
    print("-" * 75)
    
    for i, student in enumerate(student_averages[:10], 1):  # Top 10
        rank_symbol = "🏆" if i == 1 else f"{i:2d}"
        print(f"{rank_symbol:<6} {student['name']:<35} {student['group']:<15} {student['avg_score']:<12.1f} {student['exams_taken']:<6}")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    print("-" * 50)
    
    if group_data:
        lowest_group = min(group_data, key=lambda x: x['avg_score'])
        highest_group = max(group_data, key=lambda x: x['avg_score'])
        
        print(f"   • Focus on improving '{lowest_group['name']}' group (avg: {lowest_group['avg_score']:.1f}%)")
        print(f"   • Share best practices from '{highest_group['name']}' group (avg: {highest_group['avg_score']:.1f}%)")
    
    if exam_data:
        difficult_exams = [e for e in exam_data if e['avg_score'] < 60]
        if difficult_exams:
            print(f"   • Review content for challenging exams: {', '.join([e['name'] for e in difficult_exams[:3]])}")
    
    low_completion = [g for g in group_data if g['evaluation_rate'] < 80]
    if low_completion:
        print(f"   • Increase evaluation completion for: {', '.join([g['name'] for g in low_completion[:3]])}")
    
    print(f"\n" + "=" * 80)
    print("End of Report")

def export_detailed_analytics(students, groups, exams, marks):
    """Export detailed analytics to JSON file"""
    analytics = {
        "generated_at": datetime.now().isoformat(),
        "summary": {
            "total_students": len(students),
            "total_groups": len(groups), 
            "total_exams": len(exams),
            "total_evaluations": len(marks)
        },
        "group_performance": [],
        "exam_analysis": [],
        "student_rankings": []
    }
    
    # Group performance
    for group in groups:
        group_students = [s for s in students if s.get('groupId') == group.get('id')]
        group_marks = [m for m in marks if any(s.get('id') == m.get('studentId') for s in group_students)]
        
        if group_marks:
            group_scores = [float(m.get('percentage', 0)) for m in group_marks if m.get('percentage')]
            group_avg = statistics.mean(group_scores) if group_scores else 0
        else:
            group_avg = 0
        
        analytics["group_performance"].append({
            "group_id": group.get('id'),
            "group_name": group.get('name'),
            "student_count": len(group_students),
            "average_score": round(group_avg, 1),
            "total_evaluations": len(group_marks)
        })
    
    # Export to file
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'institute_analytics_{timestamp}.json'
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(analytics, f, indent=2, ensure_ascii=False)
    
    print(f"\n📁 Detailed analytics exported to: {filename}")

def main():
    """Main function"""
    print("🏛️ INSTITUTE ANALYTICS GENERATOR")
    print("=" * 50)
    print("This tool generates comprehensive institute-level analytics and reports.")
    
    try:
        # Load data
        students, groups, exams, marks = load_data()
        
        if not students or not groups or not exams:
            print("\n⚠️ Warning: Some data files are missing or empty.")
            print("Make sure you have:")
            print("   • students.json with student data")
            print("   • groups.json with group data") 
            print("   • exams.json with exam data")
            print("   • marks.json with evaluation data")
        
        # Generate report
        generate_institute_report(students, groups, exams, marks)
        
        # Ask for export
        export_choice = input(f"\n📊 Export detailed analytics to JSON? (y/N): ").strip().lower()
        if export_choice in ['y', 'yes']:
            export_detailed_analytics(students, groups, exams, marks)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Please check your data files and try again.")

if __name__ == "__main__":
    main()
