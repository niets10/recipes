'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CreateActivitySchema, UpdateActivitySchema } from '@/schemas';
import { routes } from '@/lib/routes';
import { z } from 'zod';

function toNum(val) {
    if (val === '' || val === undefined || val === null) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
}

export async function getActivitiesAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getActivitiesPageAction({ page = 0, query } = {}) {
    const supabase = await createClient();
    const columns = 'id, title, description, time_minutes, calories, created_at';
    let request = supabase.from('activities').select(columns);
    if (query) {
        request = request.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }
    const { data, error } = await request.order('created_at', { ascending: false }).range(page * 10, (page + 1) * 10 - 1);
    if (error) throw new Error(error.message);
    return { activities: data, hasMore: data.length === 10 };
}

export async function getActivityByIdAction(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('activities').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
}

export async function getActivitiesForSelectAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('activities').select('id, title').order('title');
    if (error) throw new Error(error.message);
    return data;
}

export async function createActivityAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = CreateActivitySchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();
    const { error } = await supabase.from('activities').insert({
        title: v.title,
        description: v.description || null,
        time_minutes: toNum(v.time_minutes),
        calories: toNum(v.calories),
    });
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessActivities);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function updateActivityAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = UpdateActivitySchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();
    const { error } = await supabase
        .from('activities')
        .update({
            title: v.title,
            description: v.description || null,
            time_minutes: toNum(v.time_minutes),
            calories: toNum(v.calories),
        })
        .eq('id', v.id);
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessActivities);
    revalidatePath(`${routes.fitnessActivities}/${v.id}`);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function deleteActivityAction(id) {
    const supabase = await createClient();
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath(routes.fitnessActivities);
    revalidatePath(routes.fitness);
    return { success: true };
}
