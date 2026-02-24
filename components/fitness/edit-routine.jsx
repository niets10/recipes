'use client';

import { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditRoutineForm } from '@/components/fitness/edit-routine-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function EditRoutine({ routine, onSuccess }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Routine updated successfully' });
        setOpen(false);
        onSuccess?.();
    }, [onSuccess]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="hover:cursor-pointer">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Routine</DialogTitle>
                    <DialogDescription>Update your routine name and description.</DialogDescription>
                </DialogHeader>
                <EditRoutineForm routine={routine} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
