'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CreateRoutineSchema, UpdateRoutineSchema, RoutineExerciseSchema } from '@/schemas';
import { routes } from '@/lib/routes';
import { z } from 'zod';

function toNum(val) {
    if (val === '' || val === undefined || val === null) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
}

export async function getRoutinesAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('routines').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getRoutinesWithCountsAction() {
    const supabase = await createClient();
    const { data: routines, error: re } = await supabase.from('routines').select('*').order('created_at', { ascending: false });
    if (re) throw new Error(re.message);
    const { data: counts } = await supabase.from('routine_exercises').select('routine_id');
    const byRoutine = (counts || []).reduce((acc, row) => {
        acc[row.routine_id] = (acc[row.routine_id] || 0) + 1;
        return acc;
    }, {});
    return (routines || []).map((r) => ({ ...r, exerciseCount: byRoutine[r.id] || 0 }));
}

export async function getRoutinesPageAction({ page = 0, query } = {}) {
    const supabase = await createClient();
    let request = supabase.from('routines').select('*');
    if (query) {
        request = request.ilike('name', `%${query}%`);
    }
    const { data: routines, error } = await request.order('created_at', { ascending: false }).range(page * 10, (page + 1) * 10 - 1);
    if (error) throw new Error(error.message);
    if (!routines?.length) return { routines: [], hasMore: false };
    const ids = routines.map((r) => r.id);
    const { data: counts } = await supabase.from('routine_exercises').select('routine_id').in('routine_id', ids);
    const byRoutine = (counts || []).reduce((acc, row) => {
        acc[row.routine_id] = (acc[row.routine_id] || 0) + 1;
        return acc;
    }, {});
    const withCounts = routines.map((r) => ({ ...r, exerciseCount: byRoutine[r.id] || 0 }));
    return { routines: withCounts, hasMore: routines.length === 10 };
}

export async function getRoutineByIdAction(id) {
    const supabase = await createClient();
    const { data: routine, error: routineError } = await supabase.from('routines').select('*').eq('id', id).single();
    if (routineError || !routine) throw new Error(routineError?.message || 'Routine not found');

    const { data: routineExercises, error: reError } = await supabase
        .from('routine_exercises')
        .select('*, gym_exercises(*)')
        .eq('routine_id', id)
        .order('order_index');
    if (reError) throw new Error(reError.message);

    return { ...routine, routine_exercises: routineExercises || [] };
}

export async function getRoutinesForSelectAction() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('routines').select('id, name').order('name');
    if (error) throw new Error(error.message);
    return data;
}

export async function createRoutineAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = CreateRoutineSchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const supabase = await createClient();
    const { error } = await supabase.from('routines').insert({
        name: validated.data.name,
        description: validated.data.description || null,
    });
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function updateRoutineAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = UpdateRoutineSchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const supabase = await createClient();
    const { error } = await supabase.from('routines').update({
        name: validated.data.name,
        description: validated.data.description || null,
    }).eq('id', validated.data.id);
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(`${routes.fitnessRoutines}/${validated.data.id}`);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function deleteRoutineAction(id) {
    const supabase = await createClient();
    const { error } = await supabase.from('routines').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(routes.fitness);
    return { success: true };
}

export async function addExerciseToRoutineAction(payload) {
    const validated = RoutineExerciseSchema.safeParse(payload);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('routine_exercises')
        .select('order_index')
        .eq('routine_id', v.routine_id)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
    const order_index = (existing?.order_index ?? -1) + 1;

    const { error } = await supabase.from('routine_exercises').insert({
        routine_id: v.routine_id,
        gym_exercise_id: v.gym_exercise_id,
        order_index,
        sets_override: toNum(v.sets_override),
        reps_override: toNum(v.reps_override),
        weight_override: toNum(v.weight_override),
        comments_override: v.comments_override || null,
    });
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(`${routes.fitnessRoutines}/${v.routine_id}`);
    return { success: true };
}

export async function updateRoutineExerciseAction(payload) {
    const { id, ...rest } = payload;
    if (!id) return { error: { _form: ['id required'] } };
    const validated = RoutineExerciseSchema.safeParse(rest);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();
    const { error } = await supabase
        .from('routine_exercises')
        .update({
            order_index: v.order_index ?? 0,
            sets_override: toNum(v.sets_override),
            reps_override: toNum(v.reps_override),
            weight_override: toNum(v.weight_override),
            comments_override: v.comments_override || null,
        })
        .eq('id', id);
    if (error) return { error: { _form: [error.message] } };
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(`${routes.fitnessRoutines}/${v.routine_id}`);
    return { success: true };
}

export async function removeExerciseFromRoutineAction(routineExerciseId, routineId) {
    const supabase = await createClient();
    const { error } = await supabase.from('routine_exercises').delete().eq('id', routineExerciseId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(`${routes.fitnessRoutines}/${routineId}`);
    return { success: true };
}

export async function reorderRoutineExercisesAction(routineId, orderedIds) {
    const supabase = await createClient();
    for (let i = 0; i < orderedIds.length; i++) {
        await supabase.from('routine_exercises').update({ order_index: i }).eq('id', orderedIds[i]).eq('routine_id', routineId);
    }
    revalidatePath(routes.fitnessRoutines);
    revalidatePath(`${routes.fitnessRoutines}/${routineId}`);
    return { success: true };
}
