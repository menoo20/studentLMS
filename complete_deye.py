import json

# Load current students data
with open('public/data/students.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Remove current DEYE students
data = [s for s in data if s['groupId'] != 'deye']

# Complete list of 32 DEYE students in correct order
complete_deye_students = [
    "علي محمد عبدالله الجنبي",
    "حسين سعيد صالح آل محفوظ", 
    "موسى كاظم صالح ال محفوظ",
    "بيسم فؤاد عبدالله المحروس",
    "سجاد اياد ابراهيم المرهون",
    "عبدالله جعفر عبدالله ال جساس",
    "خالد عيد حمدان العنزي",
    "عبدالله عامر عياش غروي",
    "علي بن عبد العزيز  آل تنبل",
    "سجاد ساري احمد المصلاب",
    "ريان رياض عائش الشمسي",
    "علي عباس حسن  القديحي",
    "مرتضى محمد علوي الحسين",
    "عبدالله احمد عيسى المرهون",
    "مهند فؤاد علي ال شيف",
    "هشام سعود عبدالحيم الفرج",
    "جواد حبيب بن حسن محفوظ",
    "باسل خليل إبراهيم بالعيسى",
    "حسين جاسم عبدالله ربعان",  # Missing student 1
    "سيف خالد علي السعيد",
    "علي حبیب رضي زين الدين",
    "رضا يعقوب علي البحراني",
    "سجاد محمد بنسلمان البيش",
    "هاشم مصطفى بن هاشم آل شبر",
    "مرتضى سعيد علي السماك",
    "حيدر فاضل بن عباس الأصيل",
    "زهير احمد علي آل فردان",
    "يحيى زكريا جاسم الحايكي",  # Missing student 2
    "حسن فاضل حسن العواد",
    "إسماعيل احمد عيد ال احمد",
    "كرار جمعة الأحمد",
    "عبدالغفور المدن"
]

# Add all DEYE students with correct data
for i, name in enumerate(complete_deye_students, 1):
    data.append({
        "id": f"deye_{i:03d}",
        "name": name,
        "groupId": "deye",
        "position": "English Trainee"
    })

# Save updated file
with open('public/data/students.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Updated DEYE group with all 32 students")
print(f"📈 Total students now: {len(data)}")
print()
print("Added missing students:")
print("19. حسين جاسم عبدالله ربعان")
print("28. يحيى زكريا جاسم الحايكي")
