import json

with open('public/data/schedule.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

nesma_classes = [x for x in data if x['group'] == 'NESMA']

print("🎯 NESMA Schedule (3 times per week):")
print("=====================================")
for item in nesma_classes:
    print(f"{item['date']} ({item['time']}) - Online")

print(f"\n📊 Total NESMA classes: {len(nesma_classes)}")
print(f"📅 From: {nesma_classes[0]['date']} to {nesma_classes[-1]['date']}")
