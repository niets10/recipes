'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EditRoutine } from '@/components/fitness/edit-routine';
import {
    removeExerciseFromRoutineAction,
    updateRoutineExerciseAction,
    reorderRoutineExercisesAction,
    addExerciseToRoutineAction,
} from '@/actions/database/routine-actions';
import { getGymExercisesForSelectPageAction } from '@/actions/database/gym-exercise-actions';
import { BackLink } from '@/components/application/back-link';
import { routes } from '@/lib/routes';
import { ListOrdered, ChevronUp, ChevronDown, Trash2, Plus, Dumbbell, Search, Save } from 'lucide-react';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

function AvailableExerciseCard({ exercise, routineId, onAdd }) {
    const [adding, setAdding] = useState(false);

    async function handleAdd(e) {
        e.preventDefault();
        e.stopPropagation();
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
        <Card
            className={cn(
                'h-full min-w-0 w-full max-w-full border-t-4 fitness-card-border transition-all hover:shadow-md flex flex-col overflow-hidden'
            )}
        >
            <CardHeader className="pb-2 flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Dumbbell className="size-4 text-primary" />
                        </div>
                        {exerciseHref ? (
                            <Link
                                href={exerciseHref}
                                className="text-sm leading-tight truncate hover:underline min-w-0 sm:text-base"
                            >
                                {title}
                            </Link>
                        ) : (
                            <h3 className="text-sm leading-tight truncate min-w-0 sm:text-base">{title}</h3>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        {bodyPart && (
                            <Badge variant="secondary" className="text-[10px] shrink-0 truncate max-w-[80px] sm:max-w-none sm:text-xs">
                                {bodyPart}
                            </Badge>
                        )}
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
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}

function getRoutineExerciseInitial(re) {
    return {
        sets: re.sets_override ?? re.gym_exercises?.sets ?? '',
        reps: re.reps_override ?? re.gym_exercises?.reps ?? '',
        weight: re.weight_override ?? re.gym_exercises?.weight ?? '',
        comments: re.comments_override ?? '',
    };
}

function isRoutineExerciseDirty(values, re) {
    const initial = getRoutineExerciseInitial(re);
    return (
        String(values.sets) !== String(initial.sets) ||
        String(values.reps) !== String(initial.reps) ||
        String(values.weight) !== String(initial.weight) ||
        String(values.comments) !== String(initial.comments)
    );
}

function RoutineExerciseRow({
    re,
    routineId,
    index,
    total,
    values,
    onFieldChange,
    onMoveUp,
    onMoveDown,
    onRemove,
}) {
    async function handleRemove() {
        try {
            const res = await removeExerciseFromRoutineAction(re.id, routineId);
            if (res?.success) {
                toastRichSuccess({ message: 'Exercise removed' });
                onRemove?.();
            } else if (res?.error?._form?.[0]) {
                toastRichError({ message: res.error._form[0] });
            }
        } catch (err) {
            toastRichError({ message: err?.message || 'Failed to remove' });
        }
    }

    const title = re.gym_exercises?.title ?? 'Exercise';
    const exerciseHref = re.gym_exercise_id
        ? `${routes.fitnessGymExercises}/${re.gym_exercise_id}`
        : null;

    return (
        <tr className="border-b border-border/50">
            <td className="py-1 pr-1 w-16">
                <div className="flex flex-col gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onMoveUp(index)}
                        disabled={index === 0}
                    >
                        <ChevronUp className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onMoveDown(index)}
                        disabled={index >= total - 1}
                    >
                        <ChevronDown className="size-4" />
                    </Button>
                </div>
            </td>
            <td className="py-1 pr-1 align-middle">
                {exerciseHref ? (
                    <Link href={exerciseHref} className="font-medium hover:underline">
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
                    value={values.sets}
                    onChange={(e) => onFieldChange(re.id, 'sets', e.target.value)}
                />
            </td>
            <td className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1">
                <Input
                    type="number"
                    min={0}
                    className="h-8 w-full min-w-0 text-sm"
                    value={values.reps}
                    onChange={(e) => onFieldChange(re.id, 'reps', e.target.value)}
                />
            </td>
            <td className="min-w-16 sm:min-w-28 w-20 sm:w-28 py-1 px-1">
                <Input
                    type="number"
                    min={0}
                    step={0.5}
                    className="h-8 w-full min-w-0 text-sm"
                    value={values.weight}
                    onChange={(e) => onFieldChange(re.id, 'weight', e.target.value)}
                />
            </td>
            <td className="py-1 px-1 min-w-[120px]">
                <Input
                    className="h-8 text-sm"
                    placeholder="Comments"
                    value={values.comments}
                    onChange={(e) => onFieldChange(re.id, 'comments', e.target.value)}
                />
            </td>
            <td className="py-1 pl-1 w-10">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={handleRemove}
                >
                    <Trash2 className="size-4" />
                </Button>
            </td>
        </tr>
    );
}

const SEARCH_DEBOUNCE_MS = 400;

export function RoutineDetailComponent({ routine }) {
    const router = useRouter();
    const [availableExercises, setAvailableExercises] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [edits, setEdits] = useState({});
    const [savingAll, setSavingAll] = useState(false);

    const exercises = routine?.routine_exercises ?? [];
    const orderedIds = exercises.map((e) => e.id);
    const addedIds = exercises.map((e) => e.gym_exercise_id);

    useEffect(() => {
        const initial = {};
        exercises.forEach((re) => {
            initial[re.id] = getRoutineExerciseInitial(re);
        });
        setEdits(initial);
    }, [exercises]);

    const dirtyCount = exercises.filter((re) =>
        isRoutineExerciseDirty(edits[re.id] ?? getRoutineExerciseInitial(re), re)
    ).length;

    const onFieldChange = useCallback((id, field, value) => {
        setEdits((prev) => ({
            ...prev,
            [id]: { ...(prev[id] ?? {}), [field]: value },
        }));
    }, []);

    const saveAll = useCallback(async () => {
        if (dirtyCount === 0) return;
        setSavingAll(true);
        try {
            let saved = 0;
            for (const re of exercises) {
                const values = edits[re.id] ?? getRoutineExerciseInitial(re);
                if (!isRoutineExerciseDirty(values, re)) continue;
                const payload = {
                    id: re.id,
                    routine_id: routine.id,
                    gym_exercise_id: re.gym_exercise_id,
                    order_index: re.order_index,
                    sets_override: values.sets === '' ? undefined : Number(values.sets),
                    reps_override: values.reps === '' ? undefined : Number(values.reps),
                    weight_override: values.weight === '' ? undefined : Number(values.weight),
                    comments_override: values.comments || undefined,
                };
                const res = await updateRoutineExerciseAction(payload);
                if (res?.success) saved++;
                else if (res?.error?._form?.[0]) toastRichError({ message: res.error._form[0] });
            }
            if (saved > 0) {
                toastRichSuccess({ message: saved === 1 ? 'Exercise updated' : `${saved} exercises updated` });
                router.refresh();
            }
        } finally {
            setSavingAll(false);
        }
    }, [routine?.id, exercises, edits, dirtyCount, router]);

    const refresh = useCallback(() => {
        router.refresh();
    }, [router]);

    const fetchPage = useCallback(async (pageIndex, query, exclude, append = false) => {
        setLoading(true);
        try {
            const result = await getGymExercisesForSelectPageAction({
                page: pageIndex,
                query: query && String(query).trim() ? String(query).trim() : undefined,
                excludeIds: exclude,
            });
            const list = result.exercises ?? [];
            setAvailableExercises((prev) => (append ? [...prev, ...list] : list));
            setHasMore(result.hasMore ?? false);
            setPage(pageIndex + 1);
        } catch {
            setAvailableExercises((prev) => (append ? prev : []));
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        const q =
            searchQuery && String(searchQuery).trim() ? String(searchQuery).trim() : undefined;
        fetchPage(page, q, addedIds, true);
    }, [page, searchQuery, addedIds, fetchPage]);

    const addedIdsStr = addedIds.join(',');
    const debouncedFetchRef = useRef(null);
    const initialFetchedRef = useRef(false);
    const prevAddedIdsRef = useRef(addedIdsStr);

    useEffect(() => {
        debouncedFetchRef.current = debounce((q, exclude) => {
            fetchPage(0, q, exclude, false);
        }, SEARCH_DEBOUNCE_MS);
        return () => debouncedFetchRef.current?.cancel();
    }, [fetchPage]);

    useEffect(() => {
        const q =
            searchQuery && String(searchQuery).trim() ? String(searchQuery).trim() : undefined;
        if (!initialFetchedRef.current) {
            initialFetchedRef.current = true;
            fetchPage(0, q, addedIds, false);
            return;
        }
        if (prevAddedIdsRef.current !== addedIdsStr) {
            prevAddedIdsRef.current = addedIdsStr;
            debouncedFetchRef.current?.cancel();
            fetchPage(0, q, addedIds, false);
            return;
        }
        debouncedFetchRef.current?.(q, addedIds);
    }, [searchQuery, addedIdsStr, fetchPage]);

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
        <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
            <Card className="border-t-4 fitness-card-border">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                        <BackLink label="Back to routines" />
                        <CardTitle className="min-w-0 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                            {routine.name || 'Untitled'}
                        </CardTitle>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <EditRoutine routine={routine} onSuccess={refresh} />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="flex items-center gap-2 text-lg font-medium text-muted-foreground mb-4">
                        <ListOrdered className="size-5 text-primary" />
                        Exercises in this routine
                    </p>
                    {exercises.length === 0 ? (
                        <p className="text-muted-foreground text-xs py-4 sm:text-sm">
                            No exercises in this routine. Add one from the list below.
                        </p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-left text-muted-foreground">
                                            <th className="py-1 pr-1 w-16 font-medium"></th>
                                            <th className="py-1 pr-1 font-medium">Exercise</th>
                                            <th className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1 font-medium">
                                                Sets
                                            </th>
                                            <th className="min-w-14 sm:min-w-24 w-16 sm:w-24 py-1 px-1 font-medium">
                                                Reps
                                            </th>
                                            <th className="min-w-16 sm:min-w-28 w-20 sm:w-28 py-1 px-1 font-medium">
                                                Weight
                                            </th>
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
                                                values={edits[re.id] ?? getRoutineExerciseInitial(re)}
                                                onFieldChange={onFieldChange}
                                                onMoveUp={moveUp}
                                                onMoveDown={moveDown}
                                                onRemove={refresh}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {dirtyCount > 0 && (
                                <div className="flex justify-end mt-3">
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={saveAll}
                                        disabled={savingAll}
                                        className="gap-2"
                                    >
                                        <Save className="size-4" />
                                        Save changes{dirtyCount > 1 ? ` (${dirtyCount})` : ''}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="min-w-0 overflow-hidden">
                <CardHeader className="min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base min-w-0 truncate sm:text-lg">
                        <Dumbbell className="size-4 sm:size-5 text-primary" />
                        Available exercises
                    </CardTitle>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                        Click + to add an exercise to this routine.
                    </p>
                    <div className="relative mt-2 w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                            type="search"
                            placeholder="Search exercises…"
                            className="pl-9"
                            aria-label="Search exercises"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="min-w-0 overflow-hidden">
                    {loading && availableExercises.length === 0 ? (
                        <p className="text-muted-foreground text-xs py-4 sm:text-sm">Loading exercises…</p>
                    ) : availableExercises.length === 0 ? (
                        <p className="text-muted-foreground text-xs py-4 sm:text-sm">
                            {searchQuery.trim()
                                ? 'No exercises match your search.'
                                : 'All your exercises are already in this routine.'}
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {availableExercises.map((ex) => (
                                    <AvailableExerciseCard
                                        key={ex.id}
                                        exercise={ex}
                                        routineId={routine.id}
                                        onAdd={refresh}
                                    />
                                ))}
                            </div>
                            {hasMore && (
                                <div className="flex justify-center pt-4">
                                    <Button variant="outline" onClick={loadMore} disabled={loading}>
                                        {loading ? 'Loading…' : 'Load more'}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
