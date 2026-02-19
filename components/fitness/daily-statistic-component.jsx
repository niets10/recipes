'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    getOrCreateDailyStatisticIdAction,
    upsertDailyStatisticAction,
    addRoutineToDayAction,
    removeRoutineFromDayAction,
    updateDailyRoutineEntryExerciseAction,
    addExerciseToDailyRoutineEntryAction,
    removeExerciseFromDailyRoutineEntryAction,
    addActivityToDayAction,
    removeActivityFromDayAction,
    addGymExerciseToDayAction,
    removeGymExerciseFromDayAction,
} from '@/actions/database/daily-statistic-actions';
import { getRoutinesForSelectAction } from '@/actions/database/routine-actions';
import { getActivitiesForSelectAction } from '@/actions/database/activity-actions';
import { getGymExercisesForSelectAction } from '@/actions/database/gym-exercise-actions';
import { routes } from '@/lib/routes';
import { ChevronLeft, Calendar, UtensilsCrossed, ListOrdered, Activity, Dumbbell, Trash2 } from 'lucide-react';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

function toNum(v) {
    if (v === '' || v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
}

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
            } else if (result?.error?._form?.[0]) toastRichError({ message: result.error._form[0] });
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
        if (!activitySelect || !dailyStatisticId) return;
        const res = await addActivityToDayAction(dailyStatisticId, activitySelect);
        if (res?.success) {
            toastRichSuccess({ message: 'Activity logged' });
            setActivitySelect('');
            refresh();
        } else if (res?.error) toastRichError({ message: res.error });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={routes.statistics}><ChevronLeft className="size-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <Calendar className="size-6 text-primary" />
                    {date}
                </h1>
            </div>

            {/* Nutrition */}
            <Card className="border-t-4 border-t-primary/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <UtensilsCrossed className="size-5 text-primary" />
                        Nutrition
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleNutritionSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="space-y-2">
                            <label htmlFor="calories_ingested" className="text-sm font-medium">Calories</label>
                            <Input id="calories_ingested" name="calories_ingested" type="number" min={0} defaultValue={data?.calories_ingested ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="proteins" className="text-sm font-medium">Proteins (g)</label>
                            <Input id="proteins" name="proteins" type="number" min={0} defaultValue={data?.proteins ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</label>
                            <Input id="carbs" name="carbs" type="number" min={0} defaultValue={data?.carbs ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="fat" className="text-sm font-medium">Fat (g)</label>
                            <Input id="fat" name="fat" type="number" min={0} defaultValue={data?.fat ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="steps" className="text-sm font-medium">Steps</label>
                            <Input id="steps" name="steps" type="number" min={0} defaultValue={data?.steps ?? ''} />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-5">
                            <Button type="submit" disabled={nutritionSaving}>{nutritionSaving ? 'Saving…' : 'Save nutrition'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Routines */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ListOrdered className="size-5 text-primary" />
                        Routines
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!hasData && (
                        <p className="text-sm text-muted-foreground">Add a routine or save nutrition to create this day&apos;s log.</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <select
                            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            value={routineSelect}
                            onChange={(e) => setRoutineSelect(e.target.value)}
                            onFocus={() => routines.length === 0 && getRoutinesForSelectAction().then(setRoutines)}
                        >
                            <option value="">Select routine…</option>
                            {routines.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        <Button type="button" size="sm" onClick={handleAddRoutine} disabled={!routineSelect}>
                            Add routine
                        </Button>
                    </div>
                    {data?.daily_routine_entries?.length > 0 && (
                        <div className="space-y-3">
                            {data.daily_routine_entries.map((entry) => (
                                <RoutineEntryBlock
                                    key={entry.id}
                                    entry={entry}
                                    onRemove={async () => {
                                        await removeRoutineFromDayAction(entry.id, date);
                                        toastRichSuccess({ message: 'Routine removed' });
                                        refresh();
                                    }}
                                    onUpdateExercise={async (payload) => {
                                        await updateDailyRoutineEntryExerciseAction(payload);
                                        refresh();
                                    }}
                                    onRemoveExercise={async (id) => {
                                        await removeExerciseFromDailyRoutineEntryAction(id);
                                        refresh();
                                    }}
                                    onAddExercise={async (entryId, gymExerciseId, defaults) => {
                                        await addExerciseToDailyRoutineEntryAction(entryId, gymExerciseId, defaults);
                                        refresh();
                                    }}
                                    refresh={refresh}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Activities */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="size-5 text-primary" />
                        Activities
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!hasData && <p className="text-sm text-muted-foreground">Add nutrition or a routine first.</p>}
                    {hasData && (
                        <>
                            <div className="flex flex-wrap gap-2">
                                <select
                                    className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                    value={activitySelect}
                                    onChange={(e) => setActivitySelect(e.target.value)}
                                    onFocus={() => activities.length === 0 && getActivitiesForSelectAction().then(setActivities)}
                                >
                                    <option value="">Select activity…</option>
                                    {activities.map((a) => (
                                        <option key={a.id} value={a.id}>{a.title}</option>
                                    ))}
                                </select>
                                <Button type="button" size="sm" onClick={handleAddActivity} disabled={!activitySelect}>
                                    Log activity
                                </Button>
                            </div>
                            {data?.daily_activity_entries?.length > 0 && (
                                <ul className="space-y-1 text-sm">
                                    {data.daily_activity_entries.map((ae) => (
                                        <li key={ae.id} className="flex items-center justify-between rounded border px-3 py-2">
                                            <span>{ae.activities?.title ?? 'Activity'}</span>
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={async () => { await removeActivityFromDayAction(ae.id); refresh(); }}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Standalone gym exercises */}
            {hasData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Dumbbell className="size-5 text-primary" />
                            Gym exercises (standalone)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StandaloneGymExercises
                            entries={data?.daily_gym_exercise_entries ?? []}
                            dailyStatisticId={dailyStatisticId}
                            onAdd={async (gymExerciseId, sets, reps, weight, comments) => {
                                await addGymExerciseToDayAction(dailyStatisticId, gymExerciseId, sets, reps, weight, comments);
                                refresh();
                            }}
                            onRemove={async (id) => {
                                await removeGymExerciseFromDayAction(id);
                                refresh();
                            }}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function DailyRoutineExerciseRow({ ex, onUpdate, onRemove }) {
    const [sets, setSets] = useState(ex.sets ?? '');
    const [reps, setReps] = useState(ex.reps ?? '');
    const [weight, setWeight] = useState(ex.weight ?? '');
    const [comments, setComments] = useState(ex.comments ?? '');

    const handleBlur = useCallback(() => {
        onUpdate({ id: ex.id, sets, reps, weight, comments });
    }, [ex.id, sets, reps, weight, comments, onUpdate]);

    return (
        <tr className="border-b">
            <td className="py-1 pr-2">{ex.gym_exercises?.title ?? '-'}</td>
            <td className="py-1 px-2">
                <Input type="number" min={0} className="h-8 text-sm" value={sets} onChange={(e) => setSets(e.target.value)} onBlur={handleBlur} />
            </td>
            <td className="py-1 px-2">
                <Input type="number" min={0} className="h-8 text-sm" value={reps} onChange={(e) => setReps(e.target.value)} onBlur={handleBlur} />
            </td>
            <td className="py-1 px-2">
                <Input type="number" min={0} step={0.5} className="h-8 text-sm" value={weight} onChange={(e) => setWeight(e.target.value)} onBlur={handleBlur} />
            </td>
            <td className="py-1 px-2">
                <Input className="h-8 text-sm" value={comments} onChange={(e) => setComments(e.target.value)} onBlur={handleBlur} />
            </td>
            <td className="py-1">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemove(ex.id)}>
                    <Trash2 className="size-4" />
                </Button>
            </td>
        </tr>
    );
}

function RoutineEntryBlock({ entry, onRemove, onUpdateExercise, onRemoveExercise, onAddExercise, refresh }) {
    const [addingExercise, setAddingExercise] = useState(false);
    const [exerciseSelect, setExerciseSelect] = useState('');
    const [exercises, setExercises] = useState([]);
    const routineName = entry.routines?.name ?? 'Routine';
    const exercisesList = entry.daily_routine_entry_exercises ?? [];

    async function handleAddExercise() {
        if (!exerciseSelect) return;
        await onAddExercise(entry.id, exerciseSelect, {});
        setAddingExercise(false);
        setExerciseSelect('');
    }

    return (
        <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-medium">{routineName}</h4>
                <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={onRemove}>
                    Remove routine
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-muted-foreground">
                            <th className="py-1 pr-2">Exercise</th>
                            <th className="py-1 px-2 w-16">Sets</th>
                            <th className="py-1 px-2 w-16">Reps</th>
                            <th className="py-1 px-2 w-20">Weight</th>
                            <th className="py-1 px-2">Comments</th>
                            <th className="py-1 w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercisesList.map((ex) => (
                            <DailyRoutineExerciseRow
                                key={ex.id}
                                ex={ex}
                                onUpdate={onUpdateExercise}
                                onRemove={onRemoveExercise}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {addingExercise ? (
                <div className="flex gap-2 flex-wrap items-center">
                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={exerciseSelect}
                        onChange={(e) => setExerciseSelect(e.target.value)}
                        onFocus={() => exercises.length === 0 && getGymExercisesForSelectAction().then(setExercises)}
                    >
                        <option value="">Select exercise…</option>
                        {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>{ex.title}</option>
                        ))}
                    </select>
                    <Button size="sm" onClick={handleAddExercise} disabled={!exerciseSelect}>Add</Button>
                    <Button size="sm" variant="outline" onClick={() => setAddingExercise(false)}>Cancel</Button>
                </div>
            ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setAddingExercise(true)}>Add exercise to this routine</Button>
            )}
        </div>
    );
}

function StandaloneGymExercises({ entries, dailyStatisticId, onAdd, onRemove }) {
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
                <ul className="space-y-1 text-sm">
                    {entries.map((ge) => (
                        <li key={ge.id} className="flex items-center justify-between rounded border px-3 py-2">
                            <span>{ge.gym_exercises?.title ?? 'Exercise'} — {[ge.sets != null && `${ge.sets}s`, ge.reps != null && `${ge.reps}r`, ge.weight != null && `${ge.weight}kg`].filter(Boolean).join(' ')}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemove(ge.id)}>
                                <Trash2 className="size-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
            {showForm ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 rounded border p-3">
                    <select
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={gymExerciseId}
                        onChange={(e) => setGymExerciseId(e.target.value)}
                        onFocus={() => exercises.length === 0 && getGymExercisesForSelectAction().then(setExercises)}
                    >
                        <option value="">Exercise…</option>
                        {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>{ex.title}</option>
                        ))}
                    </select>
                    <Input type="number" min={0} placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} className="h-9" />
                    <Input type="number" min={0} placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} className="h-9" />
                    <Input type="number" min={0} step={0.5} placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-9" />
                    <div className="flex gap-2">
                        <Input placeholder="Comments" value={comments} onChange={(e) => setComments(e.target.value)} className="h-9" />
                        <Button size="sm" onClick={handleAdd} disabled={!gymExerciseId}>Add</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(true)}>Add gym exercise</Button>
            )}
        </div>
    );
}
