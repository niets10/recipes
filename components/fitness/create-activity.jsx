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
import { CreateActivityForm } from '@/components/fitness/create-activity-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function CreateActivity() {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Activity created' });
        setOpen(false);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default" size="default" className="shrink-0">New activity</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add activity</DialogTitle>
                    <DialogDescription>Log an activity type (e.g. running, HIIT).</DialogDescription>
                </DialogHeader>
                <CreateActivityForm onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
