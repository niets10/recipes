'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Exercise created' });
        setOpen(false);
        router.refresh();
    }, [router]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="shrink-0 sm:h-9 sm:w-auto sm:min-w-0 sm:px-4"
                    aria-label="New exercise"
                >
                    <Plus className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">New exercise</span>
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
