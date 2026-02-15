const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Mock Data for development without API Key
const MOCK_RECIPES = [
    {
        id: 1,
        title: { en: "Avocado Toast with Egg", es: "Tostada de Aguacate con Huevo", de: "Avocado-Toast mit Ei" },
        image: "https://images.unsplash.com/photo-1598516063669-7c87c26c483a?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 12, fat: 18, carbs: 25, calories: 310 },
        readyInMinutes: 10,
        servings: 1,
        diets: ["vegetarian"],
        sourceName: "Healthy Eats",
        confidence: 0.95
    },
    {
        id: 2,
        title: { en: "Keto Beef Stir Fry", es: "Salteado de Res Keto", de: "Keto Rindfleischpfanne" },
        image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 35, fat: 25, carbs: 8, calories: 450 },
        readyInMinutes: 20,
        servings: 2,
        diets: ["keto", "gluten free"],
        sourceName: "LowCarb Life",
        confidence: 0.88
    },
    {
        id: 3,
        title: { en: "Chickpea Curry", es: "Curry de Garbanzos", de: "Kichererbsen-Curry" },
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 15, fat: 10, carbs: 45, calories: 380 },
        readyInMinutes: 30,
        servings: 4,
        diets: ["vegan", "vegetarian", "gluten free"],
        sourceName: "Spice World",
        confidence: 0.92
    }
];

export async function searchRecipes(params) {
    const { query, diets, minProtein, maxCarbs, locale = 'en' } = params;

    if (!API_KEY) {
        console.warn("Using MOCK data (SPOONACULAR_API_KEY not found)");

        // Simple filter mock
        let results = MOCK_RECIPES.filter(r => {
            // Filter by diet
            if (diets && diets.length > 0) {
                const hasDiet = diets.every(d => r.diets.includes(d));
                if (!hasDiet) return false;
            }
            // Filter by macros
            if (minProtein && r.macros.protein < minProtein) return false;
            if (maxCarbs && r.macros.carbs > maxCarbs) return false;

            return true;
        });

        // Localize title
        results = results.map(r => ({
            ...r,
            title: r.title[locale] || r.title['en']
        }));

        return { results, totalResults: results.length };
    }

    // Real API Call
    const url = new URL(`${BASE_URL}/complexSearch`);
    url.searchParams.append('apiKey', API_KEY);
    url.searchParams.append('addRecipeNutrition', 'true');
    url.searchParams.append('number', '10');
    if (query) url.searchParams.append('query', query);
    if (diets) url.searchParams.append('diet', Array.isArray(diets) ? diets.join(',') : diets);
    if (minProtein) url.searchParams.append('minProtein', minProtein);
    if (maxCarbs) url.searchParams.append('maxCarbs', maxCarbs);

    try {
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Spoonacular API Error: ${res.statusText}`);
        const data = await res.json();

        // Normalize Data
        const normalized = data.results.map(r => normalizeRecipe(r));
        return { results: normalized, totalResults: data.totalResults };
    } catch (error) {
        console.error("Recipe Search Failed:", error);
        return { results: [], error: error.message };
    }
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
        confidence: 0.9, // Placeholder
        macros: {
            calories: getNutrient("Calories"),
            protein: getNutrient("Protein"),
            fat: getNutrient("Fat"),
            carbs: getNutrient("Carbohydrates"),
        }
    };
}
