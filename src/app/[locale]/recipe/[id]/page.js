'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

export default function RecipePage({ params }) {
    const { id } = use(params);

    const [recipe, setRecipe] = useState(null);
    const [multiplier, setMultiplier] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/recipes/${id}`)
            .then(res => res.json())
            .then(data => {
                setRecipe(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!recipe) return <div>Not Found</div>;

    return (
        <div className={styles.container}>
            <div className={styles.imageHeader}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={recipe.image} alt={recipe.title} className={styles.image} />
                <div className={styles.overlay}>
                    <h1>{recipe.title}</h1>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.stats}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Calories</span>
                        <span className={styles.statValue}>{Math.round(recipe.macros.calories * multiplier)}</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Protein</span>
                        <span className={styles.statValue}>{Math.round(recipe.macros.protein * multiplier)}g</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Carbs</span>
                        <span className={styles.statValue}>{Math.round(recipe.macros.carbs * multiplier)}g</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>Fat</span>
                        <span className={styles.statValue}>{Math.round(recipe.macros.fat * multiplier)}g</span>
                    </div>
                </div>

                <div className={styles.scaler}>
                    <label>Servings: {(recipe.servings * multiplier).toFixed(1)}</label>
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={multiplier}
                        onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                        className={styles.range}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.actionButton}
                        onClick={() => {
                            const text = recipe.ingredients.map(i =>
                                `- ${(i.amount * multiplier).toFixed(1)} ${i.unit} ${i.name}`
                            ).join('\n');
                            navigator.clipboard.writeText(text);
                            alert('Shopping List Copied!');
                        }}
                    >
                        📋 Copy List
                    </button>
                    <button
                        className={styles.actionButton}
                        onClick={() => {
                            // Mock Swap: Go to random ID 1 or 2
                            const nextId = id === '1' ? '2' : '1';
                            window.location.href = `/en/recipe/${nextId}`;
                        }}
                    >
                        🔄 Swap Recipe
                    </button>
                </div>

                <section className={styles.section}>
                    <h2>Ingredients</h2>
                    <ul className={styles.ingredients}>
                        {recipe.ingredients && recipe.ingredients.map(ing => (
                            <li key={ing.id} className={styles.ingredientRow}>
                                <span className={styles.amount}>
                                    {(ing.amount * multiplier).toFixed(ing.amount % 1 === 0 ? 0 : 1)} {ing.unit}
                                </span>
                                <span className={styles.name}>{ing.name}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Instructions</h2>
                    <ol className={styles.instructions}>
                        {recipe.instructions && recipe.instructions.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </section>
            </div>
        </div>
    );
}
