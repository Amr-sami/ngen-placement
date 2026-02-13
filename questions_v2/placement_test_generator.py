import json
import random
from pathlib import Path
from typing import List, Dict, Optional


class PlacementTestGenerator:
    """
    Generates placement tests from question bank JSON files.
    
    File Structure Expected:
    questions_folder/
    ├── Belt Name/
    │   ├── ar/
    │   │   ├── 6-9.json
    │   │   └── ...
    │   └── en/
    │       ├── 6-9.json
    │       └── ...
    """
    
    def __init__(self, questions_dir: str):
        """
        Initialize the generator with the questions directory path.
        
        Args:
            questions_dir: Path to the questions folder (e.g., "questions_v2")
        """
        self.questions_dir = Path(questions_dir)
        if not self.questions_dir.exists():
            raise FileNotFoundError(f"Questions directory not found: {self.questions_dir}")
        self._cache: Dict[str, List[Dict]] = {}
    
    def _load_questions(self, belt: str, language: str) -> List[Dict]:
        """Load all questions for a specific belt and language"""
        cache_key = f"{belt}_{language}"
        
        if cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        questions = []
        belt_path = self.questions_dir / belt / language
        
        if not belt_path.exists():
            return questions
        
        for json_file in belt_path.glob('*.json'):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        questions.extend(data)
                    else:
                        questions.append(data)
            except json.JSONDecodeError:
                continue
        
        self._cache[cache_key] = questions
        return questions.copy()
    
    def get_available_belts(self) -> List[str]:
        """Get list of all available belt names"""
        return [
            item.name for item in self.questions_dir.iterdir()
            if item.is_dir() and not item.name.startswith('.')
        ]
    
    def _get_difficulty_counts(
        self, 
        n: int, 
        easy_pct: float, 
        medium_pct: float, 
        hard_pct: float
    ) -> Dict[int, int]:
        """Calculate question counts for each difficulty level"""
        n_easy = round(n * easy_pct)
        n_medium = round(n * medium_pct)
        n_hard = n - n_easy - n_medium
        return {1: n_easy, 2: n_medium, 3: n_hard}
    
    def generate_test(
        self,
        n_questions_per_belt: int = 10,
        easy_pct: float = 0.33,
        medium_pct: float = 0.34,
        hard_pct: float = 0.33,
        belts: Optional[List[str]] = None,
        age_group: Optional[str] = None,
        language: str = 'en',
        seed: Optional[int] = None
    ) -> List[Dict]:
        """
        Generate a placement test with specified parameters.
        
        Args:
            n_questions_per_belt: Number of questions to select per belt
            easy_pct: Percentage of easy questions (difficulty_level=1)
            medium_pct: Percentage of medium questions (difficulty_level=2)
            hard_pct: Percentage of hard questions (difficulty_level=3)
            belts: List of belt names to include (None = all belts)
            age_group: Filter questions by age group (e.g., "6-9", "10-14", "15-18")
            language: Language code ('en', 'ar')
            seed: Random seed for reproducibility
        
        Returns:
            Single shuffled list of all selected questions
        """
        # Validate percentages
        total_pct = easy_pct + medium_pct + hard_pct
        if not (0.99 <= total_pct <= 1.01):
            raise ValueError(f"Percentages must sum to 1.0, got {total_pct}")
        
        # Set random seed if provided
        if seed is not None:
            random.seed(seed)
        
        # Get belts to process
        if belts is None:
            belts = self.get_available_belts()
        
        # Calculate difficulty distribution
        difficulty_counts = self._get_difficulty_counts(
            n_questions_per_belt, easy_pct, medium_pct, hard_pct
        )
        
        all_selected = []
        
        for belt in belts:
            # Load and filter questions
            questions = self._load_questions(belt, language)
            
            if not questions:
                continue
            
            # Filter by age group if specified
            if age_group:
                questions = [q for q in questions if q.get('age_group') == age_group]
                if not questions:
                    continue
            
            # Shuffle all questions first
            random.shuffle(questions)
            
            # Select questions by difficulty
            for difficulty, count in difficulty_counts.items():
                difficulty_questions = [
                    q for q in questions 
                    if q.get('difficulty_level') == difficulty
                ]
                random.shuffle(difficulty_questions)
                all_selected.extend(difficulty_questions[:count])
        
        # Final shuffle of all selected questions
        random.shuffle(all_selected)
        
        return all_selected


def generate_placement_test(
    questions_dir: str,
    n_questions_per_belt: int = 10,
    easy_pct: float = 0.33,
    medium_pct: float = 0.34,
    hard_pct: float = 0.33,
    belts: Optional[List[str]] = None,
    age_group: Optional[str] = None,
    language: str = 'en',
    seed: Optional[int] = None
) -> List[Dict]:
    """
    Convenience function to generate a placement test.
    
    Returns:
        Single shuffled list of all selected questions
    """
    generator = PlacementTestGenerator(questions_dir)
    return generator.generate_test(
        n_questions_per_belt=n_questions_per_belt,
        easy_pct=easy_pct,
        medium_pct=medium_pct,
        hard_pct=hard_pct,
        belts=belts,
        age_group=age_group,
        language=language,
        seed=seed
    )


# # =============================================================================
# # USAGE EXAMPLES
# # =============================================================================
# from rich import print as rp
    
# # Example: Get shuffled list of all questions
# test = generate_placement_test(
#     questions_dir=".",
#     n_questions_per_belt=5,
#     easy_pct=0.30,
#     medium_pct=0.40,
#     hard_pct=0.30,
#     # belts=["White Belt", "Yellow Belt", "Orange Belt"],
#     age_group="10-14",
#     language='ar',
# )

# rp(test)