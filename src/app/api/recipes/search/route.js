import { NextResponse } from 'next/server';
import { searchRecipes } from '@/lib/api';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const diets = searchParams.getAll('diets');

    // Target Params
    const targetProtein = searchParams.get('targetProtein');
    const targetCarbs = searchParams.get('targetCarbs');
    const targetFat = searchParams.get('targetFat');
    const targetCalories = searchParams.get('targetCalories');
    const locale = searchParams.get('locale');

    const data = await searchRecipes({
        query,
        diets,
        targetProtein: targetProtein ? parseInt(targetProtein) : undefined,
        targetCarbs: targetCarbs ? parseInt(targetCarbs) : undefined,
        targetFat: targetFat ? parseInt(targetFat) : undefined,
        targetCalories: targetCalories ? parseInt(targetCalories) : undefined,
        locale
    });

    return NextResponse.json(data);
}
