'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CreateGymExerciseSchema, UpdateGymExerciseSchema } from '@/schemas';
import { routes } from '@/lib/routes';
import { z } from 'zod';

export async function getGymExercisesAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('gym_exercises').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getGymExercisesPageAction({ page = 0, query, bodyPart } = {}) {
    const supabase = await createClient();
    let request = supabase.from('gym_exercises').select('*');

    if (query) {
        request = request.or(`title.ilike.%${query}%,description.ilike.%${query}%,body_part.ilike.%${query}%`);
    }
    if (bodyPart) {
        request = request.eq('body_part', bodyPart);
    }

    const { data, error } = await request.order('created_at', { ascending: false }).range(page * 10, (page + 1) * 10 - 1);
    if (error) throw new Error(error.message);
    return { exercises: data, hasMore: data.length === 10 };
}

export async function getDistinctBodyPartsAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('gym_exercises').select('body_part');
    if (error) throw new Error(error.message);
    const parts = [...new Set((data || []).map((r) => r?.body_part).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
    return parts;
}

export async function getGymExerciseByIdAction(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('gym_exercises').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
}

export async function getGymExercisesForSelectAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('gym_exercises').select('id, title, body_part').order('title');
    if (error) throw new Error(error.message);
    return data;
}

const SELECT_PAGE_SIZE = 10;

export async function getGymExercisesForSelectPageAction({ page = 0, query, bodyPart, excludeIds = [] } = {}) {
    const supabase = await createClient();
    let request = supabase.from('gym_exercises').select('id, title, body_part');

    if (query && String(query).trim()) {
        const q = String(query).trim();
        request = request.or(`title.ilike.%${q}%,body_part.ilike.%${q}%`);
    }
    if (bodyPart && String(bodyPart).trim()) {
        request = request.eq('body_part', String(bodyPart).trim());
    }
    if (Array.isArray(excludeIds) && excludeIds.length > 0) {
        request = request.not('id', 'in', `(${excludeIds.map((id) => `"${id}"`).join(',')})`);
    }

    const { data, error } = await request.order('title').range(page * SELECT_PAGE_SIZE, (page + 1) * SELECT_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    return { exercises: data ?? [], hasMore: (data ?? []).length === SELECT_PAGE_SIZE };
}

export async function createGymExerciseAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = CreateGymExerciseSchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();
    const { error } = await supabase.from('gym_exercises').insert({
        title: v.title,
        description: v.description || null,
        comments: v.comments || null,
        body_part: v.body_part || null,
    });
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessGymExercises);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function updateGymExerciseAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = UpdateGymExerciseSchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();
    const { error } = await supabase
        .from('gym_exercises')
        .update({
            title: v.title,
            description: v.description || null,
            comments: v.comments || null,
            body_part: v.body_part || null,
        })
        .eq('id', v.id);
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessGymExercises);
    revalidatePath(`${routes.fitnessGymExercises}/${v.id}`);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function deleteGymExerciseAction(id) {
    const supabase = await createClient();
    const { error } = await supabase.from('gym_exercises').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath(routes.fitnessGymExercises);
    revalidatePath(routes.fitness);
    return { success: true };
}
