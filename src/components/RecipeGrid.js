'use client';

import { motion } from 'framer-motion';
import styles from './RecipeGrid.module.css';
import { useRouter } from 'next/navigation';

export default function RecipeGrid({ recipes }) {
    if (!recipes || recipes.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '2rem' }}
            >
                No recipes found. Try adjusting filters!
            </motion.div>
        );
    }

    return (
        <div className={styles.grid}>
            {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
        </div>
    );
}

function RecipeCard({ recipe, index }) {
    const router = useRouter();

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push(`/en/recipe/${recipe.id}`)}
        >
            <div className={styles.imageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={recipe.image} alt={recipe.title} className={styles.image} loading="lazy" />
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.title}>{recipe.title}</h3>
                <div className={styles.meta}>
                    <span>⏱ {recipe.readyInMinutes}m</span>
                    <span>👥 {recipe.servings}</span>
                    <span style={{ color: 'var(--color-success)' }}>{Math.round(recipe.confidence * 100)}% Match</span>
                </div>
                <div className={styles.macros}>
                    <span className={styles.macroPill}>{Math.round(recipe.macros.protein)}g P</span>
                    <span className={styles.macroPill}>{Math.round(recipe.macros.carbs)}g C</span>
                    <span className={styles.macroPill}>{Math.round(recipe.macros.fat)}g F</span>
                    <span className={styles.macroPill} style={{ fontWeight: 600 }}>{Math.round(recipe.macros.calories)} kcal</span>
                </div>
            </div>
        </motion.div>
    );
}
