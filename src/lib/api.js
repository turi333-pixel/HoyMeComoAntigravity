const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Expanded Mock Data
const MOCK_RECIPES = [
    {
        id: 1,
        title: { en: "Avocado Toast with Egg", es: "Tostada de Aguacate con Huevo", de: "Avocado-Toast mit Ei" },
        image: "https://images.unsplash.com/photo-1598516063669-7c87c26c483a?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 12, fat: 18, carbs: 25, calories: 310 },
        readyInMinutes: 10,
        servings: 1,
        diets: ["vegetarian"],
        sourceName: "Healthy Eats"
    },
    {
        id: 2,
        title: { en: "Keto Beef Stir Fry", es: "Salteado de Res Keto", de: "Keto Rindfleischpfanne" },
        image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 35, fat: 25, carbs: 8, calories: 450 },
        readyInMinutes: 20,
        servings: 2,
        diets: ["keto", "gluten free"],
        sourceName: "LowCarb Life"
    },
    {
        id: 3,
        title: { en: "Chickpea Curry", es: "Curry de Garbanzos", de: "Kichererbsen-Curry" },
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 15, fat: 10, carbs: 45, calories: 380 },
        readyInMinutes: 30,
        servings: 4,
        diets: ["vegan", "vegetarian", "gluten free"],
        sourceName: "Spice World"
    },
    {
        id: 4,
        title: { en: "Grilled Salmon Salad", es: "Ensalada de Salmón", de: "Lachs-Salat" },
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 30, fat: 20, carbs: 5, calories: 350 },
        readyInMinutes: 15,
        servings: 1,
        diets: ["keto", "gluten free", "pescatarian"],
        sourceName: "Fit Kitchen"
    },
    {
        id: 5,
        title: { en: "Quinoa Power Bowl", es: "Bowl de Quinoa", de: "Quinoa-Bowl" },
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 18, fat: 12, carbs: 55, calories: 420 },
        readyInMinutes: 25,
        servings: 2,
        diets: ["vegan", "vegetarian"],
        sourceName: "Plant Based"
    },
    {
        id: 6,
        title: { en: "Greek Yogurt Parfait", es: "Parfait de Yogur", de: "Joghurt-Parfait" },
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 20, fat: 5, carbs: 30, calories: 250 },
        readyInMinutes: 5,
        servings: 1,
        diets: ["vegetarian", "gluten free"],
        sourceName: "Morning Start"
    },
    {
        id: 7,
        title: { en: "Chicken Pasta Pesto", es: "Pasta Pesto con Pollo", de: "Hähnchen-Pesto-Nudel" },
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 40, fat: 22, carbs: 60, calories: 600 },
        readyInMinutes: 25,
        servings: 2,
        diets: [],
        sourceName: "Italian Home"
    },
    {
        id: 8,
        title: { en: "Protein Pancakes", es: "Panqueques de Proteína", de: "Eiweißpfannkuchen" },
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 26, fat: 8, carbs: 35, calories: 320 },
        readyInMinutes: 15,
        servings: 2,
        diets: ["vegetarian"],
        sourceName: "Gym Food"
    }
];

export async function searchRecipes(params) {
    const {
        query, diets,
        targetProtein, targetCarbs, targetFat, targetCalories,
        locale = 'en'
    } = params;

    // Helper to calculate match score (0 to 1)
    const calculateScore = (recipe) => {
        let score = 0;
        let maxScore = 0;

        const checkMetric = (target, actual, weight = 1) => {
            if (!target) return;
            const diff = Math.abs(target - actual);
            const tolerance = target * 0.4; // 40% tolerance
            if (diff <= tolerance) {
                // Closer = higher score
                score += weight * (1 - diff / tolerance);
            }
            maxScore += weight;
        };

        checkMetric(targetProtein, recipe.macros.protein, 2); // Protein weighted higher
        checkMetric(targetCarbs, recipe.macros.carbs, 1.5);
        checkMetric(targetFat, recipe.macros.fat, 1);
        checkMetric(targetCalories, recipe.macros.calories, 1);

        return maxScore === 0 ? 0.9 : score / maxScore; // Default high confidence if no targets
    };

    let results = [];

    if (!API_KEY) {
        // MOCK LOGIC
        results = MOCK_RECIPES.filter(r => {
            if (diets && diets.length > 0) {
                return diets.every(d => r.diets.includes(d));
            }
            return true;
        }).map(r => ({
            ...r,
            title: r.title[locale] || r.title['en'],
            confidence: calculateScore(r)
        })).filter(r => r.confidence > 0.3) // Only return relevant results
            .sort((a, b) => b.confidence - a.confidence); // Best match first

    } else {
        // REAL API LOGIC
        const url = new URL(`${BASE_URL}/complexSearch`);
        url.searchParams.append('apiKey', API_KEY);
        url.searchParams.append('addRecipeNutrition', 'true');
        url.searchParams.append('number', '10');
        if (query) url.searchParams.append('query', query);
        if (diets) url.searchParams.append('diet', Array.isArray(diets) ? diets.join(',') : diets);

        // Use min/max for strict API filtering based on targets
        if (targetProtein) {
            url.searchParams.append('minProtein', Math.max(0, targetProtein - 20));
            url.searchParams.append('maxProtein', targetProtein + 20);
        }
        if (targetCarbs) {
            url.searchParams.append('minCarbs', Math.max(0, targetCarbs - 20));
            url.searchParams.append('maxCarbs', targetCarbs + 30);
        }
        if (targetCalories) {
            url.searchParams.append('minCalories', Math.max(0, targetCalories - 200));
            url.searchParams.append('maxCalories', targetCalories + 200);
        }

        try {
            const res = await fetch(url.toString());
            if (!res.ok) throw new Error(`Spoonacular API Error: ${res.statusText}`);
            const data = await res.json();

            results = data.results.map(r => {
                const normalized = normalizeRecipe(r);
                normalized.confidence = calculateScore(normalized);
                return normalized;
            });
        } catch (error) {
            console.error("Recipe Search Failed:", error);
            return { results: [], error: error.message };
        }
    }

    return { results, totalResults: results.length };
}

function normalizeRecipe(data) {
    const nutrients = data.nutrition.nutrients;
    const getNutrient = (name) => nutrients.find(n => n.name === name)?.amount || 0;

    return {
        id: data.id,
        title: data.title,
        image: data.image,
        readyInMinutes: data.readyInMinutes,
        servings: data.servings,
        diets: data.diets,
        sourceName: data.sourceName || "Unknown",
        macros: {
            calories: getNutrient("Calories"),
            protein: getNutrient("Protein"),
            fat: getNutrient("Fat"),
            carbs: getNutrient("Carbohydrates"),
        }
    };
}
