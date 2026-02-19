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
import { deleteActivityAction } from '@/actions/database/activity-actions';
import { routes } from '@/lib/routes';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function DeleteActivity({ activityId, activityTitle }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);
        try {
            await deleteActivityAction(activityId);
            toastRichSuccess({ message: 'Activity deleted' });
            setOpen(false);
            router.push(routes.fitnessActivities);
        } catch (err) {
            toastRichError({ message: err?.message || 'Failed to delete' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete activity</DialogTitle>
                    <DialogDescription>Remove &quot;{activityTitle}&quot;? This cannot be undone.</DialogDescription>
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
