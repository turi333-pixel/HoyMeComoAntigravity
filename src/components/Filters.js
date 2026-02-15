'use client';

import styles from './Filters.module.css';

const DIETS = [
    { id: 'keto', label: 'Keto' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten free', label: 'No Gluten' },
    { id: 'dairy free', label: 'No Dairy' },
];

const MEALS = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' },
];

export default function Filters({ selectedDiets, onToggleDiet, selectedMeal, onSelectMeal }) {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.sectionTitle}>Preferences</div>
                <div className={styles.chipGroup}>
                    {DIETS.map((diet) => (
                        <button
                            key={diet.id}
                            className={`${styles.chip} ${selectedDiets.includes(diet.id) ? styles.active : ''}`}
                            onClick={() => onToggleDiet(diet.id)}
                        >
                            {diet.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className={styles.sectionTitle}>Meal Type</div>
                <div className={styles.chipGroup}>
                    {MEALS.map((meal) => (
                        <button
                            key={meal.id}
                            className={`${styles.chip} ${selectedMeal === meal.id ? styles.active : ''}`}
                            onClick={() => onSelectMeal(meal.id === selectedMeal ? '' : meal.id)}
                        >
                            {meal.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
