```py
{
    'overall_readiness': 36.7,
    'total_questions': 30,
    'total_correct': 12,
    'belts_assessed': 3,
    'belts_to_study': ['Yellow', 'Orange', 'White'],
    'belts_to_skip': [],
    'belts_to_review': ['Orange'],
    'study_priority': [
        {
            'rank': 1,
            'belt': 'Yellow',
            'score_percentage': 25.0,
            'status': 'needs_full_course',
            'reasons': [
                'Fundamental concepts need attention',
                '11 concept(s) need focused study',
                'Requires comprehensive course study'
            ],
            'weak_concepts': [
                'Story in Programming',
                'Character Dialogue',
                'Algorithm',
                'Problem Solving',
                'Debugging',
                'Complex Actions',
                'Steps',
                'Events',
                'Cause and Effect',
                'Beginning',
                'Missing Steps'
            ],
            'priority_score': 175.0
        },
        {
            'rank': 2,
            'belt': 'White',
            'score_percentage': 30.0,
            'status': 'needs_full_course',
            'reasons': [
                'Fundamental concepts need attention',
                '12 concept(s) need focused study',
                'Requires comprehensive course study'
            ],
            'weak_concepts': [
                'Create Folder',
                'Steps',
                'Language Switch',
                'Alt+Shift',
                'Ads',
                'Danger',
                'Minimize',
                'Windows',
                'Save',
                'Importance',
                'Snipping Tool',
                'Screenshot'
            ],
            'priority_score': 165.0
        },
        {
            'rank': 3,
            'belt': 'Orange',
            'score_percentage': 55.0,
            'status': 'needs_review',
            'reasons': [
                'Fundamental concepts need attention',
                '6 concept(s) need focused study',
                'Review and reinforcement recommended'
            ],
            'weak_concepts': [
                'Speech to Text',
                'Voice Recognition',
                'AI Examples',
                'Data Analysis',
                'Machine Learning',
                'Brain'
            ],
            'priority_score': 98.33
        }
    ],
    'belt_details': {
        'Yellow': {
            'score_percentage': 25.0,
            'correct': 3,
            'total': 10,
            'status': 'needs_full_course',
            'confidence': 'high',
            'by_difficulty': {
                '1': {'label': 'Easy', 'correct': 1, 'total': 3, 'percentage': 33.3},
                '2': {'label': 'Medium', 'correct': 2, 'total': 4, 'percentage': 50.0},
                '3': {'label': 'Hard', 'correct': 0, 'total': 3, 'percentage': 0.0}
            },
            'strong_concepts': ['Order of Instructions', 'Movement Effects', 'Repeat', 'Loops', 'Efficiency'],
            'weak_concepts': [
                'Story in Programming',
                'Character Dialogue',
                'Algorithm',
                'Problem Solving',
                'Debugging',
                'Complex Actions',
                'Steps',
                'Events',
                'Cause and Effect',
                'Beginning',
                'Missing Steps'
            ]
        },
        'Orange': {
            'score_percentage': 55.0,
            'correct': 5,
            'total': 10,
            'status': 'needs_review',
            'confidence': 'high',
            'by_difficulty': {
                '1': {'label': 'Easy', 'correct': 1, 'total': 3, 'percentage': 33.3},
                '2': {'label': 'Medium', 'correct': 2, 'total': 4, 'percentage': 50.0},
                '3': {'label': 'Hard', 'correct': 2, 'total': 3, 'percentage': 66.7}
            },
            'strong_concepts': [
                'Sum',
                'Count',
                'Storing Data',
                'Addition',
                'Data Science Definition',
                'Pic-Graph',
                'Data Visualization'
            ],
            'weak_concepts': [
                'Speech to Text',
                'Voice Recognition',
                'AI Examples',
                'Data Analysis',
                'Machine Learning',
                'Brain'
            ]
        },
        'White': {
            'score_percentage': 30.0,
            'correct': 4,
            'total': 10,
            'status': 'needs_full_course',
            'confidence': 'high',
            'by_difficulty': {
                '1': {'label': 'Easy', 'correct': 2, 'total': 3, 'percentage': 66.7},
                '2': {'label': 'Medium', 'correct': 2, 'total': 4, 'percentage': 50.0},
                '3': {'label': 'Hard', 'correct': 0, 'total': 3, 'percentage': 0.0}
            },
            'strong_concepts': [
                'Pseudocode',
                'Definition',
                'Search',
                'Browser',
                'Internet Safety',
                '3 Rules',
                'Cut',
                'Ctrl+X'
            ],
            'weak_concepts': [
                'Create Folder',
                'Steps',
                'Language Switch',
                'Alt+Shift',
                'Ads',
                'Danger',
                'Minimize',
                'Windows',
                'Save',
                'Importance',
                'Snipping Tool',
                'Screenshot'
            ]
        }
    },
    'study_plan': [
        '📚 Start with complete courses for: Yellow, White',
        '📖 Review materials recommended for: Orange',
        '🎯 Focus especially on: Story in Programming, Character Dialogue, Algorithm, Problem Solving, Debugging',
        '⭐ Recommended to start with: Yellow (Score: 25%)',
        '💡 Unusual pattern detected: Review fundamental concepts carefully.'
    ],
    'strengths': [
        'Solid understanding of: Order of Instructions',
        'Solid understanding of: Movement Effects',
        'Solid understanding of: Repeat'
    ],
    'weaknesses': [
        'Needs comprehensive work in: Yellow, White',
        'Review needed for: Steps',
        'Review needed for: Story in Programming',
        'Review needed for: Character Dialogue',
        'Struggles with Hard questions (22%)'
    ],
    'flags': ['INVERTED_DIFFICULTY_PATTERN']
}
```