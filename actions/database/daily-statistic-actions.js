'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { DailyStatisticSchema } from '@/schemas';
import { routes } from '@/lib/routes';
import { z } from 'zod';

function toNum(val) {
    if (val === '' || val === undefined || val === null) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
}

export async function getDailyStatisticByDateAction(dateStr) {
    const supabase = await createClient();
    const { data: stat, error: statError } = await supabase
        .from('daily_statistics')
        .select('*')
        .eq('date', dateStr)
        .single();
    if (statError && statError.code !== 'PGRST116') throw new Error(statError.message);
    if (!stat) return null;

    const { data: routineEntries } = await supabase
        .from('daily_routine_entries')
        .select('*, routines(name), daily_routine_entry_exercises(*, gym_exercises(id, title, body_part))')
        .eq('daily_statistic_id', stat.id);
    const entriesWithExercises = (routineEntries || []).map((e) => ({
        ...e,
        daily_routine_entry_exercises: (e.daily_routine_entry_exercises || []).sort((a, b) => a.order_index - b.order_index),
    }));

    const { data: activityEntries } = await supabase
        .from('daily_activity_entries')
        .select('*, activities(id, title, time_minutes, calories)')
        .eq('daily_statistic_id', stat.id);

    const { data: gymEntries } = await supabase
        .from('daily_gym_exercise_entries')
        .select('*, gym_exercises(id, title, body_part)')
        .eq('daily_statistic_id', stat.id);

    return {
        ...stat,
        daily_routine_entries: entriesWithExercises,
        daily_activity_entries: activityEntries || [],
        daily_gym_exercise_entries: gymEntries || [],
    };
}

export async function getDatesWithStatisticsAction(year, month) {
    const supabase = await createClient();
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;
    const { data, error } = await supabase
        .from('daily_statistics')
        .select('date')
        .gte('date', start)
        .lte('date', end);
    if (error) throw new Error(error.message);
    return (data || []).map((r) => (typeof r.date === 'string' ? r.date.slice(0, 10) : r.date));
}

export async function upsertDailyStatisticAction(formData) {
    const raw = Object.fromEntries(formData.entries());
    const validated = DailyStatisticSchema.safeParse(raw);
    if (!validated.success) {
        return { error: z.flattenError(validated.error).fieldErrors };
    }
    const v = validated.data;
    const supabase = await createClient();

    const { data: existing } = await supabase.from('daily_statistics').select('id').eq('date', v.date).single();

    const payload = {
        date: v.date,
        calories_ingested: toNum(v.calories_ingested),
        proteins: toNum(v.proteins),
        carbs: toNum(v.carbs),
        fat: toNum(v.fat),
        steps: toNum(v.steps),
    };

    if (existing) {
        const { error } = await supabase.from('daily_statistics').update(payload).eq('id', existing.id);
        if (error) return { error: { _form: [error.message] } };
    } else {
        const { error } = await supabase.from('daily_statistics').insert(payload);
        if (error) return { error: { _form: [error.message] } };
    }
    revalidatePath(routes.statistics);
    revalidatePath(`${routes.statisticsDay}?date=${v.date}`);
    return { success: true, date: v.date };
}

export async function getOrCreateDailyStatisticIdAction(dateStr) {
    const supabase = await createClient();
    const { data: existing } = await supabase.from('daily_statistics').select('id').eq('date', dateStr).single();
    if (existing) return { id: existing.id };
    const { data: created, error } = await supabase.from('daily_statistics').insert({ date: dateStr }).select('id').single();
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(`${routes.statisticsDay}?date=${dateStr}`);
    return { id: created.id };
}

export async function addRoutineToDayAction(dailyStatisticId, routineId) {
    const supabase = await createClient();

    const { data: routineExercises } = await supabase
        .from('routine_exercises')
        .select('gym_exercise_id, sets_override, reps_override, weight_override, comments_override, order_index')
        .eq('routine_id', routineId)
        .order('order_index');

    const { data: entry, error: entryError } = await supabase
        .from('daily_routine_entries')
        .insert({ daily_statistic_id: dailyStatisticId, routine_id: routineId })
        .select('id')
        .single();
    if (entryError) return { error: entryError.message };

    if (routineExercises?.length) {
        const rows = routineExercises.map((re, i) => ({
            daily_routine_entry_id: entry.id,
            gym_exercise_id: re.gym_exercise_id,
            sets: re.sets_override ?? null,
            reps: re.reps_override ?? null,
            weight: re.weight_override ?? null,
            comments: re.comments_override ?? null,
            order_index: re.order_index ?? i,
        }));
        await supabase.from('daily_routine_entry_exercises').insert(rows);
    }
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true, entryId: entry.id };
}

export async function removeRoutineFromDayAction(dailyRoutineEntryId) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_routine_entries').delete().eq('id', dailyRoutineEntryId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function updateDailyRoutineEntryExerciseAction(payload) {
    const { id, sets, reps, weight, comments } = payload;
    if (!id) return { error: 'id required' };
    const supabase = await createClient();
    const { error } = await supabase
        .from('daily_routine_entry_exercises')
        .update({
            sets: toNum(sets),
            reps: toNum(reps),
            weight: toNum(weight),
            comments: comments ?? null,
        })
        .eq('id', id);
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function addExerciseToDailyRoutineEntryAction(dailyRoutineEntryId, gymExerciseId, defaults = {}) {
    const supabase = await createClient();
    const { data: existing } = await supabase
        .from('daily_routine_entry_exercises')
        .select('order_index')
        .eq('daily_routine_entry_id', dailyRoutineEntryId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
    const order_index = (existing?.order_index ?? -1) + 1;
    const { error } = await supabase.from('daily_routine_entry_exercises').insert({
        daily_routine_entry_id: dailyRoutineEntryId,
        gym_exercise_id: gymExerciseId,
        sets: toNum(defaults.sets),
        reps: toNum(defaults.reps),
        weight: toNum(defaults.weight),
        comments: defaults.comments || null,
        order_index,
    });
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function removeExerciseFromDailyRoutineEntryAction(dailyRoutineEntryExerciseId) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_routine_entry_exercises').delete().eq('id', dailyRoutineEntryExerciseId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function addActivityToDayAction(dailyStatisticId, activityId, timeMinutes = null, calories = null) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_activity_entries').insert({
        daily_statistic_id: dailyStatisticId,
        activity_id: activityId,
        time_minutes: toNum(timeMinutes),
        calories: toNum(calories),
    });
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function removeActivityFromDayAction(dailyActivityEntryId) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_activity_entries').delete().eq('id', dailyActivityEntryId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function addGymExerciseToDayAction(dailyStatisticId, gymExerciseId, sets, reps, weight, comments) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_gym_exercise_entries').insert({
        daily_statistic_id: dailyStatisticId,
        gym_exercise_id: gymExerciseId,
        sets: toNum(sets),
        reps: toNum(reps),
        weight: toNum(weight),
        comments: comments || null,
    });
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function removeGymExerciseFromDayAction(dailyGymExerciseEntryId) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_gym_exercise_entries').delete().eq('id', dailyGymExerciseEntryId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.statistics);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function createDailyStatisticForDateAction(dateStr) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('daily_statistics').insert({ date: dateStr }).select('id').single();
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(`${routes.statisticsDay}?date=${dateStr}`);
    return { success: true, dailyStatisticId: data.id };
}
