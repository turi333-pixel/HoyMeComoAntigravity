import { NextResponse } from 'next/server';

const MOCK_DETAILS = {
    1: {
        id: 1,
        title: "Avocado Toast with Egg",
        image: "https://images.unsplash.com/photo-1598516063669-7c87c26c483a?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 12, fat: 18, carbs: 25, calories: 310 },
        readyInMinutes: 10,
        servings: 1,
        diets: ["vegetarian"],
        summary: "A perfect start to your day with healthy fats and protein.",
        ingredients: [
            { id: 1, name: "Avocado", amount: 0.5, unit: "fruit" },
            { id: 2, name: "Whole Grain Bread", amount: 1, unit: "slice" },
            { id: 3, name: "Egg", amount: 1, unit: "large" },
            { id: 4, name: "Salt & Pepper", amount: 1, unit: "pinch" }
        ],
        instructions: [
            "Toast the bread to your liking.",
            "Mash the avocado with salt and pepper.",
            "Fry the egg sunny-side up.",
            "Spread avocado on toast and top with the egg."
        ]
    },
    2: {
        id: 2,
        title: "Keto Beef Stir Fry",
        image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&w=800&q=80",
        macros: { protein: 35, fat: 25, carbs: 8, calories: 450 },
        readyInMinutes: 20,
        servings: 2,
        diets: ["keto", "gluten free"],
        summary: "Quick, easy, and packed with protein.",
        ingredients: [
            { id: 1, name: "Beef strips", amount: 200, unit: "g" },
            { id: 2, name: "Broccoli", amount: 100, unit: "g" },
            { id: 3, name: "Soy Sauce (Tamari)", amount: 2, unit: "tbsp" },
            { id: 4, name: "Sesame Oil", amount: 1, unit: "tbsp" }
        ],
        instructions: [
            "Heat oil in a wok.",
            "Sear beef strips until browned.",
            "Add broccoli and stir fry for 3 mins.",
            "Add soy sauce and toss to coat."
        ]
    }
};

export async function GET(request, { params }) {
    const { id } = await params;

    // Mock Data fallback
    const recipe = MOCK_DETAILS[id] || { ...MOCK_DETAILS[1], id, title: `Recipe ${id}` };

    return NextResponse.json(recipe);
}
