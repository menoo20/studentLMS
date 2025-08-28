import json

# Your complete list of 32 DEYE students
complete_list = [
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
    "حسين جاسم عبدالله ربعان",
    "سيف خالد علي السعيد",
    "علي حبیب رضي زين الدين",
    "رضا يعقوب علي البحراني",
    "سجاد محمد بنسلمان البيش",
    "هاشم مصطفى بن هاشم آل شبر",
    "مرتضى سعيد علي السماك",
    "حيدر فاضل بن عباس الأصيل",
    "زهير احمد علي آل فردان",
    "يحيى زكريا جاسم الحايكي",
    "حسن فاضل حسن العواد",
    "إسماعيل احمد عيد ال احمد",
    "كرار جمعة الأحمد",
    "عبدالغفور المدن"
]

# Load current DEYE students from JSON
with open('public/data/students.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

current_deye = [s['name'] for s in data if s['groupId'] == 'deye']

print(f"Complete list: {len(complete_list)} students")
print(f"Current extracted: {len(current_deye)} students")
print()

# Find missing students
missing = []
for student in complete_list:
    if student not in current_deye:
        missing.append(student)

print(f"Missing students ({len(missing)}):")
for i, name in enumerate(missing, 1):
    print(f"{i}. {name}")

print()

# Find extra students (if any)
extra = []
for student in current_deye:
    if student not in complete_list:
        extra.append(student)

if extra:
    print(f"Extra students ({len(extra)}):")
    for i, name in enumerate(extra, 1):
        print(f"{i}. {name}")
else:
    print("No extra students found.")
