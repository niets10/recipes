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
import { CreateRecipeForm } from '@/components/recipes/create-recipe-form';
import { toastRichSuccess } from '@/lib/toast-library';

export function CreateRecipe() {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => {
        toastRichSuccess({
            message: 'Recipe created successfully',
        });
        setOpen(false);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default" size="default" className="shrink-0">
                    Create Recipe
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Recipe</DialogTitle>
                    <DialogDescription>Add a new recipe to your collection.</DialogDescription>
                </DialogHeader>
                <CreateRecipeForm onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
