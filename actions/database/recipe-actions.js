'use server';

import { createClient } from '@/lib/supabase/server';

export async function getRecipesAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getRecipesPageAction({ page, query } = {}) {
    const supabase = await createClient();
    let request = supabase.from('recipes').select('*');

    if (query) {
        request = request.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await request.range(page * 10, (page + 1) * 10 - 1);

    if (error) {
        throw new Error(error.message);
    }
    return { recipes: data, hasMore: data.length === 10 };
}

export async function getRecipeCountAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recipes').select('*').count();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getRecipeByIdAction({ id } = {}) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function createRecipeAction({ title, description } = {}) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recipes').insert({ title, description });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function updateRecipeAction({ id, title, description } = {}) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('recipes')
        .update({ title, description })
        .eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function deleteRecipeAction(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
