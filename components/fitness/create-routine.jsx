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
import { CreateRoutineForm } from '@/components/fitness/create-routine-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function CreateRoutine() {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Routine created' });
        setOpen(false);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default" size="default" className="shrink-0">New routine</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add routine</DialogTitle>
                    <DialogDescription>Create a new workout routine (e.g. Pull I).</DialogDescription>
                </DialogHeader>
                <CreateRoutineForm onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
