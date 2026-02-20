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
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

/**
 * Reusable delete confirmation dialog. Calls deleteAction(id), shows toast, then redirects if redirectTo is set.
 * @param {string|number} id - Item id to pass to deleteAction
 * @param {string} itemTitle - Display name for the item (used in description)
 * @param {string} dialogTitle - Dialog heading (e.g. "Delete activity")
 * @param {string} dialogDescription - Description text; use {title} as placeholder for itemTitle
 * @param {(id: string|number) => Promise<void>} deleteAction - Server action to perform delete
 * @param {string|null} redirectTo - Path to redirect after success, or null to stay
 * @param {string} successMessage - Toast message on success
 * @param {string} [triggerLabel='Delete'] - Button text for the trigger
 */
export function DeleteConfirmDialog({
    id,
    itemTitle,
    dialogTitle,
    dialogDescription,
    deleteAction,
    redirectTo,
    successMessage,
    triggerLabel = 'Delete',
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const description = dialogDescription.replace('{title}', itemTitle);

    async function handleDelete() {
        setLoading(true);
        try {
            await deleteAction(id);
            toastRichSuccess({ message: successMessage });
            setOpen(false);
            if (redirectTo) router.push(redirectTo);
        } catch (err) {
            toastRichError({ message: err?.message || 'Failed to delete' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">{triggerLabel}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
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
