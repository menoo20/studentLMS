#!/usr/bin/env python3
"""
Fix NESMA schedule to ensure proper Sunday-Tuesday-Thursday pattern for 4 weeks
"""
import json
from datetime import datetime, timedelta

def fix_nesma_schedule():
    # Read the current schedule
    with open('public/data/schedule.json', 'r', encoding='utf-8') as f:
        schedule = json.load(f)
    
    # Remove all existing NESMA entries
    schedule = [entry for entry in schedule if entry.get('group') != 'NESMA']
    
    # Define the correct NESMA schedule for 4 weeks (12 classes total)
    # Starting from Aug 28 (Thu), Aug 31 (Sun), Sep 2 (Tue), Sep 5 (Thu)...
    nesma_dates = [
        # Week 1 (Aug 26 - Sep 1)
        "2025-08-28",  # Thursday
        "2025-08-31",  # Sunday
        
        # Week 2 (Sep 1 - Sep 7) 
        "2025-09-02",  # Tuesday
        "2025-09-04",  # Thursday (corrected from Sep 5)
        "2025-09-07",  # Sunday
        
        # Week 3 (Sep 8 - Sep 14)
        "2025-09-09",  # Tuesday  
        "2025-09-11",  # Thursday
        "2025-09-14",  # Sunday
        
        # Week 4 (Sep 15 - Sep 21)
        "2025-09-16",  # Tuesday
        "2025-09-18",  # Thursday
        "2025-09-21",  # Sunday
        
        # Week 5 (Sep 22 - Sep 28) - Final class
        "2025-09-23",  # Tuesday
    ]
    
    # Create new NESMA entries
    nesma_entries = []
    for i, date in enumerate(nesma_dates):
        nesma_entry = {
            "id": f"nesma_{i+1}",
            "date": date,
            "time": "09:00",
            "subject": "English",
            "group": "NESMA",
            "room": "Online",
            "type": "Online Class",
            "duration": "120 minutes"
        }
        nesma_entries.append(nesma_entry)
    
    # Add NESMA entries back to schedule
    schedule.extend(nesma_entries)
    
    # Sort by date and time
    schedule.sort(key=lambda x: (x['date'], x['time']))
    
    # Write back to file
    with open('public/data/schedule.json', 'w', encoding='utf-8') as f:
        json.dump(schedule, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Fixed NESMA schedule with {len(nesma_entries)} classes")
    print("NESMA Classes Schedule:")
    for entry in nesma_entries:
        date_obj = datetime.strptime(entry['date'], '%Y-%m-%d')
        day_name = date_obj.strftime('%A')
        print(f"  - {entry['date']} ({day_name}) at {entry['time']}")

if __name__ == "__main__":
    fix_nesma_schedule()
