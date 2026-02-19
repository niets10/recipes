'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { removeExerciseFromRoutineAction, updateRoutineExerciseAction, reorderRoutineExercisesAction, addExerciseToRoutineAction } from '@/actions/database/routine-actions';
import { getGymExercisesForSelectAction } from '@/actions/database/gym-exercise-actions';
import { routes } from '@/lib/routes';
import { ChevronLeft, ListOrdered, ChevronUp, ChevronDown, Trash2, Plus, Dumbbell } from 'lucide-react';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

function AvailableExerciseRow({ exercise, routineId, onAdd }) {
    const [adding, setAdding] = useState(false);

    async function handleAdd() {
        setAdding(true);
        try {
            const result = await addExerciseToRoutineAction({
                routine_id: routineId,
                gym_exercise_id: exercise.id,
            });
            if (result?.success) {
                toastRichSuccess({ message: 'Exercise added' });
                onAdd?.();
            } else if (result?.error?._form?.[0]) {
                toastRichError({ message: result.error._form[0] });
            }
        } catch (err) {
            toastRichError({ message: err?.message || 'Failed to add' });
        } finally {
            setAdding(false);
        }
    }

    const title = exercise.title ?? 'Exercise';
    const bodyPart = exercise.body_part;
    const exerciseHref = exercise.id ? `${routes.fitnessGymExercises}/${exercise.id}` : null;

    return (
        <li className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-sm">
            <span>
                {exerciseHref ? (
                    <Link href={exerciseHref} className="font-medium text-primary hover:underline" target="_blank">
                        {title}
                    </Link>
                ) : (
                    <span className="font-medium">{title}</span>
                )}
                {bodyPart && <span className="text-muted-foreground ml-1">({bodyPart})</span>}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleAdd}
                disabled={adding}
                aria-label={`Add ${title} to routine`}
            >
                <Plus className="size-4" />
            </Button>
        </li>
    );
}

function RoutineExerciseRow({ re, routineId, index, total, onMoveUp, onMoveDown, onUpdate, onRemove }) {
    const [sets, setSets] = useState(re.sets_override ?? re.gym_exercises?.sets ?? '');
    const [reps, setReps] = useState(re.reps_override ?? re.gym_exercises?.reps ?? '');
    const [weight, setWeight] = useState(re.weight_override ?? re.gym_exercises?.weight ?? '');
    const [comments, setComments] = useState(re.comments_override ?? '');

    const handleBlur = useCallback(() => {
        const payload = {
            routine_id: routineId,
            gym_exercise_id: re.gym_exercise_id,
            order_index: re.order_index,
            sets_override: sets === '' ? undefined : Number(sets),
            reps_override: reps === '' ? undefined : Number(reps),
            weight_override: weight === '' ? undefined : Number(weight),
            comments_override: comments || undefined,
        };
        updateRoutineExerciseAction({ id: re.id, ...payload }).then((res) => {
            if (res?.success) onUpdate?.();
            else if (res?.error?._form?.[0]) toastRichError({ message: res.error._form[0] });
        });
    }, [re.id, re.gym_exercise_id, re.order_index, routineId, sets, reps, weight, comments, onUpdate]);

    async function handleRemove() {
        try {
            await removeExerciseFromRoutineAction(re.id, routineId);
            toastRichSuccess({ message: 'Exercise removed' });
            onUpdate?.();
        } catch (err) {
            toastRichError({ message: err?.message || 'Failed to remove' });
        }
    }

    const title = re.gym_exercises?.title ?? 'Exercise';
    const exerciseHref = re.gym_exercise_id ? `${routes.fitnessGymExercises}/${re.gym_exercise_id}` : null;

    return (
        <tr className="border-b border-border/50">
            <td className="py-1 pr-1 w-16">
                <div className="flex flex-col gap-0">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMoveUp(index)} disabled={index === 0}>
                        <ChevronUp className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMoveDown(index)} disabled={index >= total - 1}>
                        <ChevronDown className="size-4" />
                    </Button>
                </div>
            </td>
            <td className="py-1 pr-1 align-middle">
                {exerciseHref ? (
                    <Link href={exerciseHref} className="font-medium text-primary hover:underline" target="_blank">
                        {title}
                    </Link>
                ) : (
                    <span className="font-medium">{title}</span>
                )}
            </td>
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
            <td className="py-1 px-1 min-w-[120px]">
                <Input
                    className="h-8 text-sm"
                    placeholder="Comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    onBlur={handleBlur}
                />
            </td>
            <td className="py-1 pl-1 w-10">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleRemove}>
                    <Trash2 className="size-4" />
                </Button>
            </td>
        </tr>
    );
}

export function RoutineDetailComponent({ routine }) {
    const router = useRouter();
    const [allGymExercises, setAllGymExercises] = useState([]);

    useEffect(() => {
        getGymExercisesForSelectAction().then(setAllGymExercises).catch(() => setAllGymExercises([]));
    }, []);

    const refresh = useCallback(() => {
        router.refresh();
    }, [router]);

    const exercises = routine.routine_exercises ?? [];
    const orderedIds = exercises.map((e) => e.id);
    const addedIds = new Set(exercises.map((e) => e.gym_exercise_id));
    const availableExercises = allGymExercises.filter((ex) => !addedIds.has(ex.id));

    async function moveUp(index) {
        if (index <= 0) return;
        const next = [...orderedIds];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        await reorderRoutineExercisesAction(routine.id, next);
        toastRichSuccess({ message: 'Reordered' });
        refresh();
    }

    async function moveDown(index) {
        if (index >= orderedIds.length - 1) return;
        const next = [...orderedIds];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        await reorderRoutineExercisesAction(routine.id, next);
        toastRichSuccess({ message: 'Reordered' });
        refresh();
    }

    if (!routine) {
        return <div className="text-muted-foreground">Routine not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={routes.fitnessRoutines}><ChevronLeft className="size-4" /></Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{routine.name || 'Untitled'}</h1>
            </div>

            <Card className="border-t-4 border-t-primary/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ListOrdered className="size-5 text-primary" />
                        Exercises in this routine
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {exercises.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4">No exercises in this routine. Add one from the list below.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left text-muted-foreground">
                                        <th className="py-1 pr-1 w-16 font-medium"></th>
                                        <th className="py-1 pr-1 font-medium">Exercise</th>
                                        <th className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1 font-medium">Sets</th>
                                        <th className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1 font-medium">Reps</th>
                                        <th className="min-w-16 sm:min-w-28 w-20 sm:w-28 py-1 px-1 font-medium">Weight</th>
                                        <th className="py-1 px-1 font-medium">Comments</th>
                                        <th className="py-1 pl-1 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercises.map((re, index) => (
                                        <RoutineExerciseRow
                                            key={re.id}
                                            re={re}
                                            routineId={routine.id}
                                            index={index}
                                            total={exercises.length}
                                            onMoveUp={moveUp}
                                            onMoveDown={moveDown}
                                            onUpdate={refresh}
                                            onRemove={refresh}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Dumbbell className="size-5 text-primary" />
                        Available exercises
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Click + to add an exercise to this routine.</p>
                </CardHeader>
                <CardContent>
                    {availableExercises.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4">All your exercises are already in this routine.</p>
                    ) : (
                        <ul className="space-y-1">
                            {availableExercises.map((ex) => (
                                <AvailableExerciseRow
                                    key={ex.id}
                                    exercise={ex}
                                    routineId={routine.id}
                                    onAdd={refresh}
                                />
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
