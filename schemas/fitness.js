import * as z from 'zod';

const optionalString = z.string().optional().or(z.literal(''));
const optionalNum = (schema) => z.union([z.literal(''), z.literal(undefined), schema]).optional().transform((v) => (v === '' || v === undefined ? undefined : v));

export const CreateGymExerciseSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(200),
    description: optionalString,
    comments: optionalString,
    body_part: optionalString,
});

export const UpdateGymExerciseSchema = CreateGymExerciseSchema.extend({
    id: z.string().uuid(),
});

export const CreateActivitySchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(200),
    description: optionalString,
    time_minutes: optionalNum(z.coerce.number().int().min(0)),
    calories: optionalNum(z.coerce.number().int().min(0)),
});

export const UpdateActivitySchema = CreateActivitySchema.extend({
    id: z.string().uuid(),
});

export const CreateRoutineSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(200),
    description: optionalString,
});

export const UpdateRoutineSchema = CreateRoutineSchema.extend({
    id: z.string().uuid(),
});

export const RoutineExerciseSchema = z.object({
    routine_id: z.string().uuid(),
    gym_exercise_id: z.string().uuid(),
    order_index: optionalNum(z.coerce.number().int().min(0)),
    sets_override: optionalNum(z.coerce.number().int().min(0)),
    reps_override: optionalNum(z.coerce.number().int().min(0)),
    weight_override: optionalNum(z.coerce.number().min(0)),
    comments_override: optionalString,
});

export const UpdateRoutineExerciseSchema = RoutineExerciseSchema.extend({
    id: z.string().uuid(),
});

export const DailyStatisticSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    calories_ingested: z.coerce.number().min(0).optional(),
    proteins: z.coerce.number().min(0).optional(),
    carbs: z.coerce.number().min(0).optional(),
    fat: z.coerce.number().min(0).optional(),
    steps: z.coerce.number().int().min(0).optional(),
});

export const DailyActivityEntrySchema = z.object({
    daily_statistic_id: z.string().uuid(),
    activity_id: z.string().uuid(),
    time_minutes: z.coerce.number().int().min(0).optional(),
    calories: z.coerce.number().int().min(0).optional(),
});

export const DailyGymExerciseEntrySchema = z.object({
    daily_statistic_id: z.string().uuid(),
    gym_exercise_id: z.string().uuid(),
    sets: z.coerce.number().int().min(0).optional(),
    reps: z.coerce.number().int().min(0).optional(),
    weight: z.coerce.number().min(0).optional(),
    comments: optionalString,
    order_index: z.coerce.number().int().min(0).optional(),
});
