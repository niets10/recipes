'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getGymExercisesForSelectAction } from '@/actions/database/gym-exercise-actions';
import { addExerciseToRoutineAction } from '@/actions/database/routine-actions';
import { toastRichError, toastRichSuccess } from '@/lib/toast-library';

function toNum(val) {
    if (val === '' || val === undefined || val === null) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
}

export function AddExerciseToRoutine({ routineId, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gymExerciseId, setGymExerciseId] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (open) {
            getGymExercisesForSelectAction().then(setExercises).catch(() => setExercises([]));
        }
    }, [open]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!gymExerciseId) {
            toastRichError({ message: 'Select an exercise' });
            return;
        }
        setLoading(true);
        try {
            const result = await addExerciseToRoutineAction({
                routine_id: routineId,
                gym_exercise_id: gymExerciseId,
                sets_override: toNum(sets) ?? undefined,
                reps_override: toNum(reps) ?? undefined,
                weight_override: toNum(weight) ?? undefined,
                comments_override: comments || undefined,
            });
            if (result?.success) {
                toastRichSuccess({ message: 'Exercise added' });
                setOpen(false);
                setGymExerciseId('');
                setSets('');
                setReps('');
                setWeight('');
                setComments('');
                onSuccess?.();
            } else if (result?.error?._form?.[0]) {
                toastRichError({ message: result.error._form[0] });
            }
        } catch (err) {
            toastRichError({ message: 'Failed to add exercise' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary" size="sm">Add exercise</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add exercise to routine</DialogTitle>
                    <DialogDescription>Choose an exercise and optional overrides.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="add-ge-select" className="text-sm font-medium">Exercise</label>
                        <select
                            id="add-ge-select"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={gymExerciseId}
                            onChange={(e) => setGymExerciseId(e.target.value)}
                            required
                        >
                            <option value="">Select…</option>
                            {exercises.map((ex) => (
                                <option key={ex.id} value={ex.id}>
                                    {ex.title}{ex.body_part ? ` (${ex.body_part})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                            <label htmlFor="add-sets" className="text-sm font-medium">Sets</label>
                            <Input id="add-sets" type="number" min={0} value={sets} onChange={(e) => setSets(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="add-reps" className="text-sm font-medium">Reps</label>
                            <Input id="add-reps" type="number" min={0} value={reps} onChange={(e) => setReps(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="add-weight" className="text-sm font-medium">Weight</label>
                            <Input id="add-weight" type="number" min={0} step={0.5} value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-comments" className="text-sm font-medium">Comments</label>
                        <Input id="add-comments" value={comments} onChange={(e) => setComments(e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
