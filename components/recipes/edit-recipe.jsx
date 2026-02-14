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
import { EditRecipeForm } from '@/components/recipes/edit-recipe-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function EditRecipe ({ recipe }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({
            message: 'Recipe updated successfully',
        });
        setOpen(false);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="hover:cursor-pointer">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Recipe</DialogTitle>
                    <DialogDescription>Update your recipe details.</DialogDescription>
                </DialogHeader>
                <EditRecipeForm recipe={recipe} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
