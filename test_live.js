// Test script to check live class detection
const testLiveClass = () => {
  const now = new Date();
  console.log('Current time:', now.toLocaleString());
  
  // Test with a NESMA class happening today
  const testClass = {
    id: "test",
    date: "2025-08-29", // Today
    time: "09:00",
    subject: "English",
    group: "NESMA",
    room: "Online",
    type: "Online Class",
    duration: "120 minutes"
  };
  
  const classDate = new Date(testClass.date + 'T' + testClass.time);
  const classEndTime = new Date(classDate.getTime() + 120 * 60000);
  
  console.log('Class start:', classDate.toLocaleString());
  console.log('Class end:', classEndTime.toLocaleString());
  console.log('Is live:', now >= classDate && now <= classEndTime);
};

testLiveClass();
