'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CreateRecipeSchema, UpdateRecipeSchema } from '@/schemas';
import { routes } from '@/lib/routes';
import { z } from 'zod';

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
    const { count, error } = await supabase.from('recipes').select('*', { count: 'exact', head: true })
    if (error) {
        throw new Error(error.message);
    }
    return count;
}

export async function getRecipeByIdAction({ id } = {}) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function createRecipeAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validatedData = CreateRecipeSchema.safeParse(raw);
    if (!validatedData.success) {
        return { error: z.flattenError(validatedData.error).fieldErrors };
    }
    const { title, description } = validatedData.data;

    const supabase = await createClient();
    const { error } = await supabase.from('recipes').insert({ title, description });
    if (error) {
        return { error: { _form: [error.message] } };
    }
    revalidatePath(routes.recipes);
    return { success: true };
}

export async function updateRecipeAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validatedData = UpdateRecipeSchema.safeParse(raw);
    if (!validatedData.success) {
        return { error: z.flattenError(validatedData.error).fieldErrors };
    }
    const { id, title, description } = validatedData.data;

    const supabase = await createClient();
    const { error } = await supabase
        .from('recipes')
        .update({ title, description })
        .eq('id', id);
    if (error) {
        return { error: { _form: [error.message] } };
    }
    revalidatePath(routes.recipes);
    return { success: true };
}

export async function deleteRecipeAction(id) {
    const supabase = await createClient();
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
    revalidatePath(routes.recipes);
    return { success: true };
}
