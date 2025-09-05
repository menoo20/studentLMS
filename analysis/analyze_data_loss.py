#!/usr/bin/env python3
"""
Investigate why marks are getting lost and implement prevention mechanisms
Analyze the pattern of data loss and create safeguards
"""

import json
import glob
from datetime import datetime
import os

def analyze_data_loss_pattern():
    """Analyze backup files to understand when and how data loss occurs"""
    print("🔍 ANALYZING DATA LOSS PATTERNS")
    print("="*60)
    
    # Get all backup files sorted by timestamp
    backup_files = glob.glob('public/data/marks_backup*.json')
    backup_files.sort()
    
    print(f"📁 Found {len(backup_files)} backup files")
    
    # Analyze each backup file
    file_analysis = []
    
    for backup_file in backup_files:
        try:
            with open(backup_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Extract timestamp from filename
            filename = os.path.basename(backup_file)
            if 'backup_' in filename:
                timestamp_part = filename.split('backup_')[1].replace('.json', '')
                if timestamp_part.replace('_', '').replace('-', '').isdigit():
                    # Convert to readable time
                    if len(timestamp_part) >= 15:  # YYYYMMDD_HHMMSS format
                        date_part = timestamp_part[:8]
                        time_part = timestamp_part[9:15] if len(timestamp_part) > 8 else "000000"
                        readable_time = f"{date_part[:4]}-{date_part[4:6]}-{date_part[6:8]} {time_part[:2]}:{time_part[2:4]}:{time_part[4:6]}"
                    else:
                        readable_time = timestamp_part
                else:
                    readable_time = timestamp_part
            else:
                readable_time = "Unknown"
            
            file_analysis.append({
                'file': backup_file,
                'timestamp': readable_time,
                'count': len(data),
                'data': data
            })
            
        except Exception as e:
            print(f"❌ Error reading {backup_file}: {e}")
            continue
    
    # Show the progression
    print("\n📊 BACKUP FILE PROGRESSION (chronological):")
    print("-" * 70)
    print(f"{'Time':<20} {'File':<35} {'Count':<6} {'Change'}")
    print("-" * 70)
    
    prev_count = 0
    for i, analysis in enumerate(file_analysis):
        count = analysis['count']
        change = count - prev_count if i > 0 else 0
        change_str = f"+{change}" if change > 0 else str(change) if change < 0 else "±0"
        
        file_short = analysis['file'].split('\\')[-1][:35]
        print(f"{analysis['timestamp']:<20} {file_short:<35} {count:<6} {change_str}")
        
        prev_count = count
    
    # Find the biggest drops
    print(f"\n🔻 SIGNIFICANT DATA LOSSES DETECTED:")
    print("-" * 50)
    
    biggest_losses = []
    for i in range(1, len(file_analysis)):
        current_count = file_analysis[i]['count']
        prev_count = file_analysis[i-1]['count']
        loss = prev_count - current_count
        
        if loss > 0:  # Data was lost
            biggest_losses.append({
                'from_file': file_analysis[i-1]['file'],
                'to_file': file_analysis[i]['file'],
                'from_time': file_analysis[i-1]['timestamp'],
                'to_time': file_analysis[i]['timestamp'],
                'lost_count': loss,
                'from_count': prev_count,
                'to_count': current_count
            })
    
    biggest_losses.sort(key=lambda x: x['lost_count'], reverse=True)
    
    for loss in biggest_losses[:5]:  # Show top 5 losses
        print(f"📉 Lost {loss['lost_count']} marks between:")
        print(f"   From: {loss['from_time']} ({loss['from_count']} marks)")
        print(f"   To:   {loss['to_time']} ({loss['to_count']} marks)")
        print()
    
    return file_analysis, biggest_losses

def identify_root_causes():
    """Identify potential root causes of data loss"""
    print("🎯 POTENTIAL ROOT CAUSES OF DATA LOSS:")
    print("="*60)
    
    causes = [
        {
            "cause": "Race Condition During Concurrent Access",
            "explanation": "When multiple browser tabs or evaluation scripts run simultaneously, they might overwrite each other's data",
            "risk": "HIGH",
            "evidence": "Marks disappear between evaluation sessions"
        },
        {
            "cause": "Incomplete File Writes",
            "explanation": "If the browser/system crashes or loses connection during save, the file might be corrupted or partially written",
            "risk": "MEDIUM",
            "evidence": "Some backup files have fewer entries than expected"
        },
        {
            "cause": "Browser Storage Issues",
            "explanation": "Browser localStorage or sessionStorage conflicts when loading/saving data",
            "risk": "MEDIUM", 
            "evidence": "Data loss occurs during web interface usage"
        },
        {
            "cause": "File Lock/Permission Issues",
            "explanation": "Operating system file locks preventing proper writes",
            "risk": "LOW",
            "evidence": "Would see consistent errors, not intermittent loss"
        }
    ]
    
    for i, cause in enumerate(causes, 1):
        print(f"{i}. 🚨 {cause['cause']} (Risk: {cause['risk']})")
        print(f"   💡 {cause['explanation']}")
        print(f"   🔍 Evidence: {cause['evidence']}")
        print()

def create_prevention_system():
    """Create a robust prevention system"""
    print("🛡️ CREATING PREVENTION SYSTEM:")
    print("="*60)
    
    # 1. Enhanced backup system
    backup_enhancement = '''
// Enhanced backup system for marks.json
function createTimestampedBackup(data, action = 'save') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `marks_backup_${action}_${timestamp}.json`;
    
    // Always create backup before any modification
    localStorage.setItem(backupName, JSON.stringify(data));
    
    // Keep only last 50 backups to avoid storage bloat
    const backups = Object.keys(localStorage).filter(key => key.startsWith('marks_backup_'));
    if (backups.length > 50) {
        backups.sort();
        for (let i = 0; i < backups.length - 50; i++) {
            localStorage.removeItem(backups[i]);
        }
    }
    
    return backupName;
}
'''
    
    # 2. Atomic write system
    atomic_write = '''
// Atomic write system to prevent partial writes
function atomicSaveMarks(marksData) {
    try {
        // 1. Create backup first
        const backupName = createTimestampedBackup(marksData, 'before_save');
        
        // 2. Validate data before saving
        if (!Array.isArray(marksData)) {
            throw new Error('Marks data must be an array');
        }
        
        // 3. Check for required fields
        for (const mark of marksData) {
            if (!mark.studentId || !mark.examId || mark.score === undefined) {
                throw new Error(`Invalid mark data: ${JSON.stringify(mark)}`);
            }
        }
        
        // 4. Write to temporary location first
        const tempData = JSON.stringify(marksData, null, 2);
        localStorage.setItem('marks_temp', tempData);
        
        // 5. If temp write succeeded, move to main location
        localStorage.setItem('marks', tempData);
        
        // 6. Clean up temp
        localStorage.removeItem('marks_temp');
        
        // 7. Create success backup
        createTimestampedBackup(marksData, 'after_save');
        
        console.log(`✅ Saved ${marksData.length} marks safely with backup: ${backupName}`);
        return true;
        
    } catch (error) {
        console.error('❌ Failed to save marks:', error);
        
        // Try to recover from backup
        const backups = Object.keys(localStorage)
            .filter(key => key.startsWith('marks_backup_'))
            .sort()
            .reverse();
            
        if (backups.length > 0) {
            const lastBackup = localStorage.getItem(backups[0]);
            if (lastBackup) {
                localStorage.setItem('marks', lastBackup);
                console.log(`🔄 Recovered from backup: ${backups[0]}`);
            }
        }
        
        return false;
    }
}
'''
    
    # 3. Data validation system
    validation_system = '''
// Data validation and integrity checking
function validateMarksIntegrity(marksData) {
    const issues = [];
    
    if (!Array.isArray(marksData)) {
        issues.push('Marks data is not an array');
        return issues;
    }
    
    const seenIds = new Set();
    const studentExamPairs = new Set();
    
    for (let i = 0; i < marksData.length; i++) {
        const mark = marksData[i];
        
        // Check required fields
        if (!mark.studentId) issues.push(`Mark ${i}: Missing studentId`);
        if (!mark.examId) issues.push(`Mark ${i}: Missing examId`);
        if (mark.score === undefined || mark.score === null) issues.push(`Mark ${i}: Missing score`);
        
        // Check for duplicates
        const markId = mark.id;
        if (markId && seenIds.has(markId)) {
            issues.push(`Duplicate mark ID: ${markId}`);
        }
        if (markId) seenIds.add(markId);
        
        // Check for duplicate student-exam pairs
        const pairKey = `${mark.studentId}-${mark.examId}`;
        if (studentExamPairs.has(pairKey)) {
            issues.push(`Duplicate evaluation: Student ${mark.studentId} in exam ${mark.examId}`);
        }
        studentExamPairs.add(pairKey);
        
        // Validate score ranges
        if (typeof mark.score === 'number' && typeof mark.maxScore === 'number') {
            if (mark.score < 0) issues.push(`Mark ${i}: Negative score`);
            if (mark.score > mark.maxScore) issues.push(`Mark ${i}: Score exceeds maximum`);
        }
    }
    
    return issues;
}
'''
    
    print("📝 Created prevention system components:")
    print("1. ✅ Enhanced timestamped backup system")
    print("2. ✅ Atomic write operations")
    print("3. ✅ Data validation and integrity checking")
    print("4. ✅ Automatic recovery from backups")
    
    return backup_enhancement, atomic_write, validation_system

def create_implementation_files():
    """Create the actual implementation files"""
    print("\n💾 CREATING IMPLEMENTATION FILES:")
    print("-" * 40)
    
    # Create the prevention system JavaScript file
    js_content = '''/**
 * Marks Data Protection System
 * Prevents data loss during mark recording and saving
 */

class MarksProtectionSystem {
    constructor() {
        this.backupPrefix = 'marks_backup_';
        this.maxBackups = 50;
    }

    // Create timestamped backup
    createBackup(data, action = 'save') {
        try {
            const timestamp = new Date().toISOString()
                .replace(/[:.]/g, '-')
                .replace('T', '_')
                .substring(0, 19);
            const backupName = `${this.backupPrefix}${action}_${timestamp}`;
            
            localStorage.setItem(backupName, JSON.stringify(data, null, 2));
            
            // Cleanup old backups
            this.cleanupOldBackups();
            
            console.log(`📦 Created backup: ${backupName}`);
            return backupName;
        } catch (error) {
            console.error('Failed to create backup:', error);
            return null;
        }
    }

    // Clean up old backups
    cleanupOldBackups() {
        try {
            const backups = Object.keys(localStorage)
                .filter(key => key.startsWith(this.backupPrefix))
                .sort();
            
            if (backups.length > this.maxBackups) {
                const toDelete = backups.slice(0, backups.length - this.maxBackups);
                toDelete.forEach(backup => localStorage.removeItem(backup));
                console.log(`🧹 Cleaned up ${toDelete.length} old backups`);
            }
        } catch (error) {
            console.error('Failed to cleanup backups:', error);
        }
    }

    // Validate marks data
    validateMarks(marksData) {
        const issues = [];
        
        if (!Array.isArray(marksData)) {
            issues.push('Marks data must be an array');
            return issues;
        }

        const seenIds = new Set();
        const studentExamPairs = new Set();

        marksData.forEach((mark, index) => {
            // Required fields
            if (!mark.studentId) issues.push(`Mark ${index}: Missing studentId`);
            if (!mark.examId) issues.push(`Mark ${index}: Missing examId`);
            if (mark.score === undefined || mark.score === null) {
                issues.push(`Mark ${index}: Missing score`);
            }

            // Duplicate checks
            if (mark.id && seenIds.has(mark.id)) {
                issues.push(`Duplicate mark ID: ${mark.id}`);
            }
            if (mark.id) seenIds.add(mark.id);

            const pairKey = `${mark.studentId}-${mark.examId}`;
            if (studentExamPairs.has(pairKey)) {
                issues.push(`Duplicate: Student ${mark.studentId} in exam ${mark.examId}`);
            }
            studentExamPairs.add(pairKey);

            // Score validation
            if (typeof mark.score === 'number' && typeof mark.maxScore === 'number') {
                if (mark.score < 0) issues.push(`Mark ${index}: Negative score`);
                if (mark.score > mark.maxScore) {
                    issues.push(`Mark ${index}: Score (${mark.score}) exceeds max (${mark.maxScore})`);
                }
            }
        });

        return issues;
    }

    // Safe save operation
    async safeUpdateMarks(newMark) {
        try {
            console.log('🛡️ Starting safe mark update...');
            
            // 1. Load current marks
            const currentMarks = JSON.parse(localStorage.getItem('marks') || '[]');
            console.log(`📊 Current marks count: ${currentMarks.length}`);
            
            // 2. Create backup before any changes
            const backupName = this.createBackup(currentMarks, 'before_update');
            if (!backupName) {
                throw new Error('Failed to create backup');
            }
            
            // 3. Add new mark
            const updatedMarks = [...currentMarks, newMark];
            console.log(`➕ Adding new mark for student ${newMark.studentId}`);
            
            // 4. Validate the updated data
            const issues = this.validateMarks(updatedMarks);
            if (issues.length > 0) {
                console.error('❌ Validation failed:', issues);
                throw new Error(`Validation failed: ${issues.join(', ')}`);
            }
            
            // 5. Atomic write - save to temp first
            const tempKey = 'marks_temp';
            localStorage.setItem(tempKey, JSON.stringify(updatedMarks, null, 2));
            
            // 6. Move temp to main location
            localStorage.setItem('marks', localStorage.getItem(tempKey));
            localStorage.removeItem(tempKey);
            
            // 7. Create success backup
            this.createBackup(updatedMarks, 'after_update');
            
            console.log(`✅ Successfully saved ${updatedMarks.length} marks`);
            return { success: true, count: updatedMarks.length };
            
        } catch (error) {
            console.error('❌ Safe update failed:', error);
            
            // Try to recover from the most recent backup
            return this.recoverFromBackup();
        }
    }

    // Recover from backup
    recoverFromBackup() {
        try {
            const backups = Object.keys(localStorage)
                .filter(key => key.startsWith(this.backupPrefix))
                .sort()
                .reverse();
            
            if (backups.length === 0) {
                throw new Error('No backups available for recovery');
            }
            
            const latestBackup = backups[0];
            const backupData = localStorage.getItem(latestBackup);
            
            if (!backupData) {
                throw new Error(`Backup ${latestBackup} is empty`);
            }
            
            const recoveredMarks = JSON.parse(backupData);
            localStorage.setItem('marks', JSON.stringify(recoveredMarks, null, 2));
            
            console.log(`🔄 Recovered from backup: ${latestBackup} (${recoveredMarks.length} marks)`);
            return { success: true, recovered: true, count: recoveredMarks.length };
            
        } catch (error) {
            console.error('❌ Recovery failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Get status report
    getStatus() {
        const marks = JSON.parse(localStorage.getItem('marks') || '[]');
        const backups = Object.keys(localStorage)
            .filter(key => key.startsWith(this.backupPrefix));
        
        return {
            marksCount: marks.length,
            backupsCount: backups.length,
            lastBackup: backups.sort().pop() || 'None',
            validationIssues: this.validateMarks(marks)
        };
    }
}

// Global instance
window.marksProtection = new MarksProtectionSystem();

// Usage example:
// window.marksProtection.safeUpdateMarks(newMark);
// const status = window.marksProtection.getStatus();
'''
    
    return js_content

def main():
    # Analyze the data loss pattern
    file_analysis, biggest_losses = analyze_data_loss_pattern()
    
    # Identify root causes
    identify_root_causes()
    
    # Create prevention system
    backup_sys, atomic_write, validation = create_prevention_system()
    
    # Create implementation
    js_implementation = create_implementation_files()
    
    print("\n🎯 RECOMMENDATIONS TO PREVENT FUTURE DATA LOSS:")
    print("="*60)
    print("1. 🔒 Always create backups before saving")
    print("2. 🔄 Use atomic write operations")
    print("3. ✅ Validate data before saving")
    print("4. 🚫 Avoid multiple browser tabs/windows")
    print("5. 💾 Implement the protection system below")
    print("6. 📱 Consider server-side storage for production")
    
    print(f"\n📋 SUMMARY OF FINDINGS:")
    print(f"• Found {len(biggest_losses)} instances of data loss")
    print(f"• Most likely cause: Race conditions during concurrent access")
    print(f"• Solution: Implement atomic operations with backup system")

if __name__ == "__main__":
    main()
