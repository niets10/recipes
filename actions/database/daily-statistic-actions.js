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

    const { data: activityEntries } = await supabase
        .from('daily_activity_entries')
        .select('*, activities(id, title, time_minutes, calories)')
        .eq('daily_statistic_id', stat.id);

    const { data: gymEntries } = await supabase
        .from('daily_gym_exercise_entries')
        .select('*, gym_exercises(id, title, body_part)')
        .eq('daily_statistic_id', stat.id)
        .order('order_index');

    return {
        ...stat,
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
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDayForDate(v.date));
    return { success: true, date: v.date };
}

export async function getOrCreateDailyStatisticIdAction(dateStr) {
    const supabase = await createClient();
    const { data: existing } = await supabase.from('daily_statistics').select('id').eq('date', dateStr).single();
    if (existing) return { id: existing.id };
    const { data: created, error } = await supabase.from('daily_statistics').insert({ date: dateStr }).select('id').single();
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDayForDate(dateStr));
    return { id: created.id };
}

export async function addRoutineToDayAction(dailyStatisticId, routineId, dateStr) {
    const supabase = await createClient();

    const { data: routineExercises } = await supabase
        .from('routine_exercises')
        .select('gym_exercise_id, sets_override, reps_override, weight_override, comments_override, order_index')
        .eq('routine_id', routineId)
        .order('order_index');

    if (!routineExercises?.length) {
        revalidatePath(routes.statistics);
        revalidatePath(routes.statisticsDay);
        if (dateStr) revalidatePath(routes.statisticsDayForDate(dateStr));
        return { success: true };
    }

    const { data: maxRow } = await supabase
        .from('daily_gym_exercise_entries')
        .select('order_index')
        .eq('daily_statistic_id', dailyStatisticId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
    const baseOrder = (maxRow?.order_index ?? -1) + 1;

    const rows = routineExercises.map((re, i) => ({
        daily_statistic_id: dailyStatisticId,
        gym_exercise_id: re.gym_exercise_id,
        sets: re.sets_override ?? null,
        reps: re.reps_override ?? null,
        weight: re.weight_override ?? null,
        comments: re.comments_override ?? null,
        order_index: baseOrder + i,
    }));
    const { error } = await supabase.from('daily_gym_exercise_entries').insert(rows);
    if (error) return { error: error.message };

    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDay);
    if (dateStr) revalidatePath(routes.statisticsDayForDate(dateStr));
    return { success: true };
}

export async function updateDailyGymExerciseEntryAction(payload) {
    const { id, sets, reps, weight, comments } = payload;
    if (!id) return { error: 'id required' };
    const supabase = await createClient();
    const { error } = await supabase
        .from('daily_gym_exercise_entries')
        .update({
            sets: toNum(sets),
            reps: toNum(reps),
            weight: toNum(weight),
            comments: comments ?? null,
        })
        .eq('id', id);
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
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
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function removeActivityFromDayAction(dailyActivityEntryId) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_activity_entries').delete().eq('id', dailyActivityEntryId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function addGymExerciseToDayAction(dailyStatisticId, gymExerciseId, sets, reps, weight, comments) {
    const supabase = await createClient();
    const { data: maxRow } = await supabase
        .from('daily_gym_exercise_entries')
        .select('order_index')
        .eq('daily_statistic_id', dailyStatisticId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
    const order_index = (maxRow?.order_index ?? -1) + 1;
    const { error } = await supabase.from('daily_gym_exercise_entries').insert({
        daily_statistic_id: dailyStatisticId,
        gym_exercise_id: gymExerciseId,
        sets: toNum(sets),
        reps: toNum(reps),
        weight: toNum(weight),
        comments: comments || null,
        order_index,
    });
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function removeGymExerciseFromDayAction(dailyGymExerciseEntryId) {
    const supabase = await createClient();
    const { error } = await supabase.from('daily_gym_exercise_entries').delete().eq('id', dailyGymExerciseEntryId);
    if (error) throw new Error(error.message);
    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDay);
    return { success: true };
}

export async function createDailyStatisticForDateAction(dateStr) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('daily_statistics').insert({ date: dateStr }).select('id').single();
    if (error) return { error: error.message };
    revalidatePath(routes.statistics);
    revalidatePath(routes.fitness);
    revalidatePath(routes.statisticsDayForDate(dateStr));
    return { success: true, dailyStatisticId: data.id };
}

/**
 * Fetch aggregate fitness data for a date range. Returns daily time series and activity breakdown.
 */
async function getFitnessStatsForRange(supabase, startStr, endStr) {
    const { data: stats, error: statsError } = await supabase
        .from('daily_statistics')
        .select('id, date, calories_ingested, steps')
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

    if (statsError) return { error: statsError.message };
    const statIds = (stats || []).map((s) => s.id);
    if (statIds.length === 0) {
        return buildChartPayload([], [], [], startStr, endStr);
    }

    const { data: gymEntries } = await supabase
        .from('daily_gym_exercise_entries')
        .select('daily_statistic_id, gym_exercises(body_part)')
        .in('daily_statistic_id', statIds);

    const { data: activityEntries } = await supabase
        .from('daily_activity_entries')
        .select('daily_statistic_id, time_minutes, calories, activities(title)')
        .in('daily_statistic_id', statIds);

    return buildChartPayload(stats || [], gymEntries || [], activityEntries || [], startStr, endStr);
}

function getRangeBounds(rangeKey) {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const pad = (n) => String(n).padStart(2, '0');
    let startStr, endStr;
    if (rangeKey === 'last15') {
        const start = new Date(today);
        start.setDate(start.getDate() - 14);
        startStr = start.toISOString().slice(0, 10);
        endStr = today.toISOString().slice(0, 10);
    } else if (rangeKey === 'currentMonth') {
        startStr = `${y}-${pad(m + 1)}-01`;
        endStr = today.toISOString().slice(0, 10);
    } else if (rangeKey === 'lastMonth') {
        const lastMonth = m === 0 ? 11 : m - 1;
        const lastYear = m === 0 ? y - 1 : y;
        startStr = `${lastYear}-${pad(lastMonth + 1)}-01`;
        const lastDay = new Date(lastYear, lastMonth + 1, 0);
        endStr = lastDay.toISOString().slice(0, 10);
    } else {
        startStr = today.toISOString().slice(0, 10);
        endStr = startStr;
    }
    return { startStr, endStr };
}

/**
 * Fetch fitness stats for tab ranges: Last 15 days, Current month, Last month.
 */
export async function getFitnessStatsForChartsAction() {
    const supabase = await createClient();
    const ranges = ['last15', 'currentMonth', 'lastMonth'];
    const result = {};
    for (const key of ranges) {
        const { startStr, endStr } = getRangeBounds(key);
        const data = await getFitnessStatsForRange(supabase, startStr, endStr);
        if (data.error) return { error: data.error };
        result[key] = data;
    }
    return result;
}

function buildChartPayload(stats, gymEntries, activityEntries, startStr, endStr) {
    const byDate = new Map();
    const activityTotals = {};
    const bodyPartTotals = {};

    for (let d = new Date(startStr); d <= new Date(endStr); d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        byDate.set(key, {
            date: key,
            shortLabel: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            caloriesIngested: null,
            steps: null,
            gymCount: 0,
            activityCount: 0,
            activityMinutes: 0,
            activityCalories: 0,
            workoutCount: 0,
        });
    }

    const statById = new Map(stats.map((s) => [s.id, s]));
    stats.forEach((s) => {
        const row = byDate.get(s.date);
        if (row) {
            row.caloriesIngested = s.calories_ingested ?? null;
            row.steps = s.steps ?? null;
        }
    });

    gymEntries.forEach((e) => {
        const stat = statById.get(e.daily_statistic_id);
        if (stat) {
            const row = byDate.get(stat.date);
            if (row) {
                row.gymCount += 1;
                row.workoutCount += 1;
            }
            const part = e.gym_exercises?.body_part || 'Other';
            bodyPartTotals[part] = (bodyPartTotals[part] || 0) + 1;
        }
    });

    activityEntries.forEach((e) => {
        const stat = statById.get(e.daily_statistic_id);
        if (stat) {
            const row = byDate.get(stat.date);
            if (row) {
                row.activityCount += 1;
                row.activityMinutes += Number(e.time_minutes) || 0;
                row.activityCalories += Number(e.calories) || 0;
                row.workoutCount += 1;
            }
            const title = e.activities?.title || 'Activity';
            if (!activityTotals[title]) activityTotals[title] = { minutes: 0, calories: 0 };
            activityTotals[title].minutes += Number(e.time_minutes) || 0;
            activityTotals[title].calories += Number(e.calories) || 0;
        }
    });

    const dailySeries = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
    const activityBreakdown = Object.entries(activityTotals).map(([name, v]) => ({
        name,
        minutes: v.minutes,
        calories: v.calories,
    }));
    const bodyPartBreakdown = Object.entries(bodyPartTotals).map(([name, value]) => ({ name, value }));

    const daysWithWorkout = dailySeries.filter((d) => d.workoutCount > 0).length;
    const totalGymExercises = gymEntries.length;
    const totalActivityMinutes = dailySeries.reduce((acc, d) => acc + d.activityMinutes, 0);
    const totalSteps = dailySeries.reduce((acc, d) => acc + (d.steps || 0), 0);
    const daysWithSteps = dailySeries.filter((d) => d.steps != null && d.steps > 0).length;
    const avgSteps = daysWithSteps > 0 ? Math.round(totalSteps / daysWithSteps) : 0;

    return {
        dailySeries,
        activityBreakdown,
        bodyPartBreakdown,
        summary: {
            daysWithWorkout,
            totalGymExercises,
            totalActivityMinutes,
            totalSteps,
            avgSteps,
            daysInRange: dailySeries.length,
        },
    };
}
