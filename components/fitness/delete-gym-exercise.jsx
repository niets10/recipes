'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteGymExerciseAction } from '@/actions/database/gym-exercise-actions';
import { routes } from '@/lib/routes';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function DeleteGymExercise({ exerciseId, exerciseTitle }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);
        try {
            await deleteGymExerciseAction(exerciseId);
            toastRichSuccess({ message: 'Exercise deleted' });
            setOpen(false);
            router.push(routes.fitnessGymExercises);
        } catch (err) {
            toastRichError({ message: err?.message || 'Failed to delete' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="destructive" size="default">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete exercise</DialogTitle>
                    <DialogDescription>
                        Remove &quot;{exerciseTitle}&quot; from your library? This cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
