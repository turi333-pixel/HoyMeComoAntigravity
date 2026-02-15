'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import MacroSliders from '@/components/MacroSliders';
import Filters from '@/components/Filters';
import RecipeGrid from '@/components/RecipeGrid';

export default function HomePage({ params: { locale } }) {
    const t = useTranslations('HomePage');

    // State
    const [macros, setMacros] = useState({
        protein: 30,
        carbs: 40,
        fat: 20,
        calories: 500
    });

    const [selectedDiets, setSelectedDiets] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Recipes
    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                targetProtein: macros.protein,
                targetCarbs: macros.carbs,
                targetFat: macros.fat,
                targetCalories: macros.calories,
                locale: locale
            });

            selectedDiets.forEach(d => queryParams.append('diets', d));
            if (selectedMeal) queryParams.append('type', selectedMeal);

            const res = await fetch(`/api/recipes/search?${queryParams}`);
            const data = await res.json();
            setRecipes(data.results || []);
        } catch (error) {
            console.error("Failed to fetch recipes", error);
        } finally {
            setLoading(false);
        }
    }, [macros, selectedDiets, selectedMeal, locale]);

    // Debounce Fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRecipes();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchRecipes]);

    const handleToggleDiet = (diet) => {
        setSelectedDiets(prev =>
            prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
        );
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {t('title')}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{t('subtitle')}</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <MacroSliders macros={macros} onChange={setMacros} />

                <Filters
                    selectedDiets={selectedDiets}
                    onToggleDiet={handleToggleDiet}
                    selectedMeal={selectedMeal}
                    onSelectMeal={setSelectedMeal}
                />

                <section>
                    <h2 style={{ padding: '0 1rem', fontSize: '1.25rem' }}>
                        {loading ? 'Updating...' : `${recipes.length} Results`}
                    </h2>
                    <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                        <RecipeGrid recipes={recipes} />
                    </div>
                </section>
            </div>
        </div>
    );
}
