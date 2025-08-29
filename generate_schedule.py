import json
from datetime import datetime, timedelta

def generate_schedule():
    schedule = []
    schedule_id = 1
    
    # Start date: August 24, 2025 (Sunday)
    start_date = datetime(2025, 8, 24)
    
    # NESMA end date: September 18, 2025
    nesma_end_date = datetime(2025, 9, 18)
    
    # Other groups end date: October 23, 2025  
    other_end_date = datetime(2025, 10, 23)
    
    current_date = start_date
    
    while current_date <= other_end_date:
        # Skip Friday (5) and Saturday (6) - weekends
        if current_date.weekday() in [4, 5]:  # Friday=4, Saturday=5
            current_date += timedelta(days=1)
            continue
            
        date_str = current_date.strftime("%Y-%m-%d")
        
        # NESMA Online (9:00-11:00) - Only Sunday (6), Tuesday (1), Thursday (3)
        # Note: weekday() returns Monday=0, Sunday=6
        weekday = current_date.weekday()
        if weekday in [6, 1, 3] and current_date <= nesma_end_date:  # Sun, Tue, Thu
            schedule.append({
                "id": f"sch{schedule_id}",
                "date": date_str,
                "time": "09:00",
                "subject": "English",
                "group": "NESMA",
                "room": "Online",
                "type": "Online Class",
                "duration": "120 minutes"
            })
            schedule_id += 1
        
        # Other classes (11:00-16:00) - All working days (Sun-Thu)
        if weekday in [6, 0, 1, 2, 3]:  # Sun, Mon, Tue, Wed, Thu
            # SAM5 at 11:00
            schedule.append({
                "id": f"sch{schedule_id}",
                "date": date_str,
                "time": "11:00",
                "subject": "English",
                "group": "SAM5",
                "room": "Room 8",
                "type": "Lecture",
                "duration": "60 minutes"
            })
            schedule_id += 1
            
            # SAIPEM6 at 12:00
            schedule.append({
                "id": f"sch{schedule_id}",
                "date": date_str,
                "time": "12:00",
                "subject": "English",
                "group": "SAIPEM6",
                "room": "Room 8",
                "type": "Lecture",
                "duration": "60 minutes"
            })
            schedule_id += 1
            
            # SAM2 at 14:00
            schedule.append({
                "id": f"sch{schedule_id}",
                "date": date_str,
                "time": "14:00",
                "subject": "English",
                "group": "SAM2",
                "room": "Room 8",
                "type": "Lecture",
                "duration": "60 minutes"
            })
            schedule_id += 1
            
            # SAM8 at 15:00
            schedule.append({
                "id": f"sch{schedule_id}",
                "date": date_str,
                "time": "15:00",
                "subject": "English",
                "group": "SAM8",
                "room": "Room 8",
                "type": "Lecture",
                "duration": "60 minutes"
            })
            schedule_id += 1
        
        current_date += timedelta(days=1)
    
    return schedule

# Generate the schedule
new_schedule = generate_schedule()

# Save to JSON file
with open('public/data/schedule.json', 'w', encoding='utf-8') as f:
    json.dump(new_schedule, f, ensure_ascii=False, indent=2)

print(f"✅ Schedule generated with {len(new_schedule)} total classes")

# Count NESMA classes
nesma_classes = [item for item in new_schedule if item['group'] == 'NESMA']
print(f"📅 NESMA classes: {len(nesma_classes)} (3 times per week until Sep 18)")

# Count other classes  
other_classes = [item for item in new_schedule if item['group'] != 'NESMA']
print(f"🏫 Other classes: {len(other_classes)} (daily until Oct 23)")
