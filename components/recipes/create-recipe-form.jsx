'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRecipeAction } from '@/actions/database/recipe-actions';
import { CreateRecipeSchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';
const defaultValues = {
    title: '',
    description: '',
};

export function CreateRecipeForm({ onSuccess, className }) {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues,
        resolver: zodResolver(CreateRecipeSchema),
    });

    useEffect(() => {
        if (errors.title) {
            setFocus('title');
        }
    }, [errors.title, setFocus]);

    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.set('title', data.title);
            formData.set('description', data.description ?? '');
            const result = await createRecipeAction(formData);

            if (result?.success) {
                onSuccess?.();
                return;
            }

            if (result?.error) {
                if (result.error._form?.[0]) {
                    setError('root', { message: result.error._form[0] });
                    toastRichError({ message: result.error._form[0] });
                }
                if (result.error.title?.[0]) {
                    setError('title', { message: result.error.title[0] });
                }
                if (result.error.description?.[0]) {
                    setError('description', { message: result.error.description[0] });
                }
            }
        } catch (error) {
            toastRichError({ message: 'Failed to create recipe. Please try again.' });
        }
    }

    const rootError = errors.root?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            {rootError && (
                <p className="text-sm text-destructive" role="alert">
                    {rootError}
                </p>
            )}
            <div className="space-y-2">
                <label
                    htmlFor="recipe-title"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Title
                </label>
                <Input
                    id="recipe-title"
                    type="text"
                    placeholder="e.g. Spaghetti Carbonara"
                    autoComplete="off"
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'recipe-title-error' : undefined}
                    className={errors.title ? 'border-destructive' : ''}
                    {...register('title')}
                />
                {errors.title && (
                    <p id="recipe-title-error" className="text-sm text-destructive">
                        {errors.title.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="recipe-description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Description <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                    id="recipe-description"
                    rows={4}
                    placeholder="Brief description of the recipe..."
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'recipe-description-error' : undefined}
                    className={cn(
                        'border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full min-w-0 rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm',
                        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
                        errors.description && 'border-destructive'
                    )}
                    {...register('description')}
                />
                {errors.description && (
                    <p id="recipe-description-error" className="text-sm text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting} className="hover:cursor-pointer">
                    {isSubmitting ? 'Creating…' : 'Create Recipe'}
                </Button>
            </div>
        </form>
    );
}
