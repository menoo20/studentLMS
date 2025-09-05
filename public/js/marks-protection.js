/**
 * Marks Data Protection System
 * Prevents data loss during mark recording and saving
 */

class MarksProtectionSystem {
    constructor() {
        this.backupPrefix = 'marks_backup_';
        this.maxBackups = 50;
        this.isUpdating = false; // Prevent concurrent updates
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

    // Safe save operation with mutex lock
    async safeUpdateMarks(newMark) {
        // Prevent concurrent updates
        if (this.isUpdating) {
            console.warn('⚠️ Another update is in progress, waiting...');
            await this.waitForUpdate();
        }

        this.isUpdating = true;
        
        try {
            console.log('🛡️ Starting safe mark update...');
            
            // 1. Load current marks with retry logic
            let currentMarks = [];
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const marksData = localStorage.getItem('marks');
                    currentMarks = marksData ? JSON.parse(marksData) : [];
                    break;
                } catch (error) {
                    console.warn(`Attempt ${attempt} to load marks failed:`, error);
                    if (attempt === 3) throw error;
                    await this.sleep(100); // Wait 100ms before retry
                }
            }
            
            console.log(`📊 Current marks count: ${currentMarks.length}`);
            
            // 2. Create backup before any changes
            const backupName = this.createBackup(currentMarks, 'before_update');
            if (!backupName) {
                throw new Error('Failed to create backup');
            }
            
            // 3. Check for existing mark (prevent duplicates)
            const existingMarkIndex = currentMarks.findIndex(mark => 
                mark.studentId === newMark.studentId && mark.examId === newMark.examId
            );
            
            let updatedMarks;
            if (existingMarkIndex >= 0) {
                // Update existing mark
                updatedMarks = [...currentMarks];
                updatedMarks[existingMarkIndex] = { ...updatedMarks[existingMarkIndex], ...newMark };
                console.log(`🔄 Updated existing mark for student ${newMark.studentId}`);
            } else {
                // Add new mark
                updatedMarks = [...currentMarks, newMark];
                console.log(`➕ Adding new mark for student ${newMark.studentId}`);
            }
            
            // 4. Validate the updated data
            const issues = this.validateMarks(updatedMarks);
            if (issues.length > 0) {
                console.error('❌ Validation failed:', issues);
                throw new Error(`Validation failed: ${issues.join(', ')}`);
            }
            
            // 5. Atomic write with verification
            const serializedData = JSON.stringify(updatedMarks, null, 2);
            
            // Save to temp location first
            const tempKey = 'marks_temp';
            localStorage.setItem(tempKey, serializedData);
            
            // Verify temp write
            const tempVerify = localStorage.getItem(tempKey);
            if (!tempVerify || tempVerify !== serializedData) {
                throw new Error('Temp write verification failed');
            }
            
            // Move temp to main location
            localStorage.setItem('marks', serializedData);
            
            // Verify main write
            const mainVerify = localStorage.getItem('marks');
            if (!mainVerify || mainVerify !== serializedData) {
                throw new Error('Main write verification failed');
            }
            
            // Clean up temp
            localStorage.removeItem(tempKey);
            
            // 6. Create success backup
            this.createBackup(updatedMarks, 'after_update');
            
            console.log(`✅ Successfully saved ${updatedMarks.length} marks with verification`);
            
            // 7. Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'marks',
                newValue: serializedData,
                url: window.location.href
            }));
            
            return { success: true, count: updatedMarks.length, action: existingMarkIndex >= 0 ? 'updated' : 'added' };
            
        } catch (error) {
            console.error('❌ Safe update failed:', error);
            
            // Try to recover from the most recent backup
            return this.recoverFromBackup();
        } finally {
            this.isUpdating = false;
        }
    }

    // Wait for ongoing update to complete
    async waitForUpdate() {
        while (this.isUpdating) {
            await this.sleep(50);
        }
    }

    // Sleep utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    // Initialize protection system
    init() {
        console.log('🛡️ Initializing Marks Protection System...');
        
        // Listen for storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'marks') {
                console.log('🔄 Marks updated in another tab, refreshing local data...');
                // You might want to refresh your UI here
                if (window.location.reload) {
                    // Only reload if not currently updating
                    setTimeout(() => {
                        if (!this.isUpdating) {
                            window.location.reload();
                        }
                    }, 1000);
                }
            }
        });
        
        // Create initial backup of existing data
        const existingMarks = JSON.parse(localStorage.getItem('marks') || '[]');
        if (existingMarks.length > 0) {
            this.createBackup(existingMarks, 'system_init');
        }
        
        const status = this.getStatus();
        console.log('🛡️ Protection system initialized:', status);
        
        return status;
    }
}

// Global instance
window.marksProtection = new MarksProtectionSystem();

// Auto-initialize on script load
document.addEventListener('DOMContentLoaded', () => {
    window.marksProtection.init();
});

// If DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.marksProtection.init());
} else {
    window.marksProtection.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarksProtectionSystem;
}
