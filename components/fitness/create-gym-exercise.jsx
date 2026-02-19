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
import { CreateGymExerciseForm } from '@/components/fitness/create-gym-exercise-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function CreateGymExercise() {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Exercise created' });
        setOpen(false);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default" size="default" className="shrink-0">
                    New exercise
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add gym exercise</DialogTitle>
                    <DialogDescription>Create a new exercise for your library.</DialogDescription>
                </DialogHeader>
                <CreateGymExerciseForm onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
