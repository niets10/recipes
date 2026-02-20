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
import { EditGymExerciseForm } from '@/components/fitness/edit-gym-exercise-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function EditGymExercise({ exercise, onSuccess }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Exercise updated successfully' });
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
                    <DialogTitle>Edit Exercise</DialogTitle>
                    <DialogDescription>Update your exercise details.</DialogDescription>
                </DialogHeader>
                <EditGymExerciseForm exercise={exercise} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
