import { NextResponse } from 'next/server';
import { searchRecipes } from '@/lib/api';

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query');
    const diets = searchParams.getAll('diets'); // Use getAll for multiple values
    const minProtein = searchParams.get('minProtein');
    const maxCarbs = searchParams.get('maxCarbs');
    const locale = searchParams.get('locale') || 'en';

    const data = await searchRecipes({
        query,
        diets,
        minProtein,
        maxCarbs,
        locale
    });

    return NextResponse.json(data);
}
