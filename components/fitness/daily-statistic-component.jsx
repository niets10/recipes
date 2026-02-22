'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    getOrCreateDailyStatisticIdAction,
    upsertDailyStatisticAction,
    addRoutineToDayAction,
    addActivityToDayAction,
    removeActivityFromDayAction,
    addGymExerciseToDayAction,
    removeGymExerciseFromDayAction,
    updateDailyGymExerciseEntryAction,
} from '@/actions/database/daily-statistic-actions';
import { getRoutinesForSelectAction } from '@/actions/database/routine-actions';
import { getActivitiesForSelectAction } from '@/actions/database/activity-actions';
import { getGymExercisesForSelectAction } from '@/actions/database/gym-exercise-actions';
import { UtensilsCrossed, Activity, Dumbbell, Trash2 } from 'lucide-react';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { routes } from '@/lib/routes';
import { BackLink } from '@/components/application/back-link';
import { Separator } from '@/components/ui/separator';

function toNum(v) {
    if (v === '' || v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
}

const TABS = [
    { id: 'gym', label: 'Gym exercises', icon: Dumbbell },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: UtensilsCrossed },
];

export function DailyStatisticComponent({ date, initialData }) {
    const router = useRouter();
    const [data, setData] = useState(initialData);
    const [nutritionSaving, setNutritionSaving] = useState(false);
    const [routineSelect, setRoutineSelect] = useState('');
    const [routines, setRoutines] = useState([]);
    const [activitySelect, setActivitySelect] = useState('');
    const [activities, setActivities] = useState([]);

    // Sync local state when server sends new data (e.g. after router.refresh() following add/remove routine)
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const refresh = useCallback(() => {
        router.refresh();
    }, [router]);

    const hasData = data != null;
    const dailyStatisticId = data?.id;

    async function handleNutritionSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        formData.set('date', date);
        formData.set('calories_ingested', form.calories_ingested?.value ?? '');
        formData.set('proteins', form.proteins?.value ?? '');
        formData.set('carbs', form.carbs?.value ?? '');
        formData.set('fat', form.fat?.value ?? '');
        formData.set('steps', form.steps?.value ?? '');
        setNutritionSaving(true);
        try {
            const result = await upsertDailyStatisticAction(formData);
            if (result?.success) {
                toastRichSuccess({ message: 'Saved' });
                refresh();
            } else if (result?.error?._form?.[0])
                toastRichError({ message: result.error._form[0] });
        } finally {
            setNutritionSaving(false);
        }
    }

    async function handleAddRoutine() {
        if (!routineSelect) return;
        const res = await getOrCreateDailyStatisticIdAction(date);
        if (res.error) {
            toastRichError({ message: res.error });
            return;
        }
        const addRes = await addRoutineToDayAction(res.id, routineSelect, date);
        if (addRes?.success) {
            toastRichSuccess({ message: 'Routine added' });
            setRoutineSelect('');
            refresh();
        } else if (addRes?.error) toastRichError({ message: addRes.error });
    }

    async function handleAddActivity() {
        if (!activitySelect) return;
        let statisticId = dailyStatisticId;
        if (!statisticId) {
            const createRes = await getOrCreateDailyStatisticIdAction(date);
            if (createRes?.error) {
                toastRichError({ message: createRes.error });
                return;
            }
            statisticId = createRes.id;
        }
        const res = await addActivityToDayAction(statisticId, activitySelect);
        if (res?.success) {
            toastRichSuccess({ message: 'Activity logged' });
            setActivitySelect('');
            refresh();
        } else if (res?.error) toastRichError({ message: res.error });
    }

    async function handleGymExerciseUpdate(payload) {
        const res = await updateDailyGymExerciseEntryAction(payload);
        if (res?.success) {
            toastRichSuccess({ message: 'Gym exercise updated' });
            refresh();
        } else if (res?.error) {
            toastRichError({ message: res.error });
        }
    }

    async function handleGymExerciseRemove(id) {
        const res = await removeGymExerciseFromDayAction(id);
        if (res?.success) {
            toastRichSuccess({ message: 'Gym exercise removed' });
            refresh();
        } else if (res?.error) {
            toastRichError({ message: res.error });
        }
    }

    async function handleGymExerciseAdd(gymExerciseId, sets, reps, weight, comments) {
        const res = await addGymExerciseToDayAction(
            dailyStatisticId,
            gymExerciseId,
            sets,
            reps,
            weight,
            comments
        );
        if (res?.success) {
            toastRichSuccess({ message: 'Gym exercise added' });
            refresh();
        } else if (res?.error) {
            toastRichError({ message: res.error });
        }
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue="gym" className="w-full">
                <div className="flex items-center gap-2">
                    <BackLink label="Back to statistics" />
                    <TabsList className="min-w-0 flex-1 sm:w-fit sm:flex-initial">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <TabsTrigger key={id} value={id} className="flex-1 sm:flex-initial px-2 sm:px-3" aria-label={label}>
                            <Icon className="size-4 shrink-0" />
                            <span className="hidden sm:inline">{label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                </div>

                {/* Nutrition */}
                <TabsContent value="nutrition" className="mt-4">
                    <Card className="border-t-4 fitness-card-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UtensilsCrossed className="size-5 text-primary" />
                                Nutrition
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleNutritionSubmit}
                                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
                            >
                                <div className="space-y-2">
                                    <label
                                        htmlFor="calories_ingested"
                                        className="text-sm font-medium"
                                    >
                                        Calories
                                    </label>
                                    <Input
                                        id="calories_ingested"
                                        name="calories_ingested"
                                        type="number"
                                        min={0}
                                        defaultValue={data?.calories_ingested ?? ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="proteins" className="text-sm font-medium">
                                        Proteins (g)
                                    </label>
                                    <Input
                                        id="proteins"
                                        name="proteins"
                                        type="number"
                                        min={0}
                                        defaultValue={data?.proteins ?? ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="carbs" className="text-sm font-medium">
                                        Carbs (g)
                                    </label>
                                    <Input
                                        id="carbs"
                                        name="carbs"
                                        type="number"
                                        min={0}
                                        defaultValue={data?.carbs ?? ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="fat" className="text-sm font-medium">
                                        Fat (g)
                                    </label>
                                    <Input
                                        id="fat"
                                        name="fat"
                                        type="number"
                                        min={0}
                                        defaultValue={data?.fat ?? ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="steps" className="text-sm font-medium">
                                        Steps
                                    </label>
                                    <Input
                                        id="steps"
                                        name="steps"
                                        type="number"
                                        min={0}
                                        defaultValue={data?.steps ?? ''}
                                    />
                                </div>
                                <div className="sm:col-span-2 lg:col-span-5">
                                    <Button type="submit" disabled={nutritionSaving}>
                                        {nutritionSaving ? 'Saving…' : 'Save nutrition'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activities */}
                <TabsContent value="activities" className="mt-4">
                    <Card className="border-t-4 fitness-card-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="size-5 text-primary" />
                                Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 flex-nowrap">
                                <Combobox
                                    items={activities}
                                    value={activitySelect}
                                    onValueChange={setActivitySelect}
                                    getItemValue={(a) => a.id}
                                    getItemLabel={(a) => a.title}
                                    placeholder="Select activity…"
                                    emptyMessage="No activities found."
                                    onFocus={() =>
                                        activities.length === 0 &&
                                        getActivitiesForSelectAction().then(setActivities)
                                    }
                                    className="min-w-0 flex-1 max-w-sm"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleAddActivity}
                                    disabled={!activitySelect}
                                >
                                    Log activity
                                </Button>
                            </div>
                            {data?.daily_activity_entries?.length > 0 && (
                                <ul className="space-y-1 text-sm">
                                    {data.daily_activity_entries.map((ae) => (
                                        <li
                                            key={ae.id}
                                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3"
                                        >
                                            <span>{ae.activities?.title ?? 'Activity'}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={async () => {
                                                    await removeActivityFromDayAction(ae.id);
                                                    refresh();
                                                }}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Gym exercises */}
                <TabsContent value="gym" className="mt-4">
                    <Card className="border-t-4 fitness-card-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Dumbbell className="size-5 text-primary" />
                                Gym exercises
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!hasData ? (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        Add a routine to log exercises for this day. This will
                                        create the day&apos;s log so you can then add or remove
                                        exercises as needed.
                                    </p>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        <Combobox
                                            items={routines}
                                            value={routineSelect}
                                            onValueChange={setRoutineSelect}
                                            getItemValue={(r) => r.id}
                                            getItemLabel={(r) => r.name}
                                            placeholder="Select routine…"
                                            emptyMessage="No routines found."
                                            onFocus={() =>
                                                routines.length === 0 &&
                                                getRoutinesForSelectAction().then(setRoutines)
                                            }
                                            className="min-w-0 flex-1 max-w-sm"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleAddRoutine}
                                            disabled={!routineSelect}
                                            className="shrink-0"
                                        >
                                            Add routine
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        Add a routine to insert all its exercises, or add exercises
                                        one by one. Edit or remove any entry.
                                    </p>
                                    <div className="flex items-center gap-2 flex-nowrap">
                                        <Combobox
                                            items={routines}
                                            value={routineSelect}
                                            onValueChange={setRoutineSelect}
                                            getItemValue={(r) => r.id}
                                            getItemLabel={(r) => r.name}
                                            placeholder="Select routine…"
                                            emptyMessage="No routines found."
                                            onFocus={() =>
                                                routines.length === 0 &&
                                                getRoutinesForSelectAction().then(setRoutines)
                                            }
                                            className="min-w-0 flex-1 max-w-sm"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleAddRoutine}
                                            disabled={!routineSelect}
                                            className="shrink-0"
                                        >
                                            Add routine
                                        </Button>
                                    </div>
                                    <Separator className="my-8" />
                                    <GymExercisesList
                                        entries={data?.daily_gym_exercise_entries ?? []}
                                        dailyStatisticId={dailyStatisticId}
                                        onUpdate={handleGymExerciseUpdate}
                                        onRemove={handleGymExerciseRemove}
                                        onAdd={handleGymExerciseAdd}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function GymExerciseRow({ entry, onUpdate, onRemove }) {
    const [sets, setSets] = useState(entry.sets ?? '');
    const [reps, setReps] = useState(entry.reps ?? '');
    const [weight, setWeight] = useState(entry.weight ?? '');
    const [comments, setComments] = useState(entry.comments ?? '');

    const handleBlur = useCallback(() => {
        onUpdate({ id: entry.id, sets, reps, weight, comments });
    }, [entry.id, sets, reps, weight, comments, onUpdate]);

    return (
        <tr className="border-b">
            <td className="py-1 pr-1">{entry.gym_exercises?.title ?? '-'}</td>
            <td className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1">
                <Input
                    type="number"
                    min={0}
                    className="h-8 w-full min-w-0 text-sm"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    onBlur={handleBlur}
                />
            </td>
            <td className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1">
                <Input
                    type="number"
                    min={0}
                    className="h-8 w-full min-w-0 text-sm"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    onBlur={handleBlur}
                />
            </td>
            <td className="min-w-16 sm:min-w-28 w-20 sm:w-28 py-1 px-1">
                <Input
                    type="number"
                    min={0}
                    step={0.5}
                    className="h-8 w-full min-w-0 text-sm"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={handleBlur}
                />
            </td>
            <td className="py-1 px-1">
                <Input
                    className="h-8 text-sm"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    onBlur={handleBlur}
                />
            </td>
            <td className="py-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onRemove(entry.id)}
                >
                    <Trash2 className="size-4" />
                </Button>
            </td>
        </tr>
    );
}

function GymExercisesList({ entries, dailyStatisticId, onUpdate, onRemove, onAdd }) {
    const [showForm, setShowForm] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [gymExerciseId, setGymExerciseId] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [comments, setComments] = useState('');

    async function handleAdd() {
        if (!gymExerciseId) return;
        await onAdd(gymExerciseId, toNum(sets), toNum(reps), toNum(weight), comments);
        setShowForm(false);
        setGymExerciseId('');
        setSets('');
        setReps('');
        setWeight('');
        setComments('');
    }

    return (
        <div className="space-y-4">
            {entries.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="py-1 pr-1">Exercise</th>
                                <th className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1">
                                    Sets
                                </th>
                                <th className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1">
                                    Reps
                                </th>
                                <th className="min-w-16 sm:min-w-28 w-20 sm:w-28 py-1 px-1">
                                    Weight
                                </th>
                                <th className="py-1 px-1">Comments</th>
                                <th className="py-1 w-8"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => (
                                <GymExerciseRow
                                    key={entry.id}
                                    entry={entry}
                                    onUpdate={onUpdate}
                                    onRemove={onRemove}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {showForm ? (
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_4rem_4rem_5rem_1.5fr_auto]">
                    <Combobox
                        items={exercises}
                        value={gymExerciseId}
                        onValueChange={setGymExerciseId}
                        getItemValue={(ex) => ex.id}
                        getItemLabel={(ex) => ex.title}
                        placeholder="Exercise…"
                        emptyMessage="No exercises found."
                        onFocus={() =>
                            exercises.length === 0 &&
                            getGymExercisesForSelectAction().then(setExercises)
                        }
                        className="w-full min-w-0 lg:col-span-1"
                    />
                    <Input
                        type="number"
                        min={0}
                        placeholder="Sets"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        className="h-9 w-full md:max-w-20"
                    />
                    <Input
                        type="number"
                        min={0}
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="h-9 w-full md:max-w-20"
                    />
                    <Input
                        type="number"
                        min={0}
                        step={0.5}
                        placeholder="Weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-9 w-full md:max-w-20"
                    />
                    <Input
                        placeholder="Comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="h-9 w-full min-w-0 sm:col-span-2 lg:col-span-1"
                    />
                    <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                        <Button
                            size="sm"
                            onClick={handleAdd}
                            disabled={!gymExerciseId}
                            className="shrink-0"
                        >
                            Add
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="shrink-0"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)}>
                    Add gym exercise
                </Button>
            )}
        </div>
    );
}
