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
import { EditActivityForm } from '@/components/fitness/edit-activity-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function EditActivity({ activity, onSuccess }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({ message: 'Activity updated successfully' });
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
                    <DialogTitle>Edit Activity</DialogTitle>
                    <DialogDescription>Update your activity details.</DialogDescription>
                </DialogHeader>
                <EditActivityForm activity={activity} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
