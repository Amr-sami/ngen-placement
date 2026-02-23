const testPayload = {
    testId: null,
    surveyData: {
        name: "Automated Tester",
        email: "test@example.com",
        phone: "01000000000",
        age: "18",
        country: "Egypt",
        city: "Cairo",
        schoolName: "Test School",
        techExperience: "Yes",
        heardAboutUs: "Other"
    },
    questions: [
        { question: "Q1", options: ["A", "B", "C"], ans_idx: 0, belt: "White Belt", difficulty_level: 1 }
    ],
    selectedAnswers: [0],
    score: 1,
    totalQuestions: 1,
    belt: {
        belt: "White Belt",
        stage: "Beginner",
        color: "gray",
        focus: "Intro",
        duration: "1 week",
        totalHours: "10",
        totalClasses: "2",
        scoreRange: [0, 20]
    },
    track: "general"
};

fetch('http://localhost:3000/api/placement-test/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
}).then(res => res.json()).then(data => console.log('Response:', data)).catch(err => console.error('Error:', err));
