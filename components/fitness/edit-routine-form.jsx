'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateRoutineAction } from '@/actions/database/routine-actions';
import { UpdateRoutineSchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';

export function EditRoutineForm({ routine, onSuccess, className }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues: {
            id: routine.id,
            name: routine.name ?? '',
            description: routine.description ?? '',
        },
        resolver: zodResolver(UpdateRoutineSchema),
    });

    useEffect(() => {
        if (errors.name) setFocus('name');
    }, [errors.name, setFocus]);

    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.set('id', data.id);
            formData.set('name', data.name);
            formData.set('description', data.description ?? '');
            const result = await updateRoutineAction(formData);
            if (result?.success) {
                onSuccess?.();
                return;
            }
            if (result?.error) {
                if (result.error._form?.[0]) {
                    setError('root', { message: result.error._form[0] });
                    toastRichError({ message: result.error._form[0] });
                }
                if (result.error.name?.[0]) setError('name', { message: result.error.name[0] });
                if (result.error.description?.[0]) setError('description', { message: result.error.description[0] });
            }
        } catch (err) {
            toastRichError({ message: 'Failed to update routine.' });
        }
    }

    const rootError = errors.root?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            <input type="hidden" {...register('id')} />
            {rootError && (
                <p className="text-sm text-destructive" role="alert">{rootError}</p>
            )}
            <div className="space-y-2">
                <label
                    htmlFor="edit-routine-name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Name
                </label>
                <Input
                    id="edit-routine-name"
                    type="text"
                    placeholder="e.g. Pull Day, Push Day"
                    autoComplete="off"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'edit-routine-name-error' : undefined}
                    className={errors.name ? 'border-destructive' : ''}
                    {...register('name')}
                />
                {errors.name && (
                    <p id="edit-routine-name-error" className="text-sm text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="edit-routine-description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Description
                </label>
                <Textarea
                    id="edit-routine-description"
                    placeholder="Optional notes about this routine"
                    rows={3}
                    autoComplete="off"
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'edit-routine-description-error' : undefined}
                    className={errors.description ? 'border-destructive' : ''}
                    {...register('description')}
                />
                {errors.description && (
                    <p id="edit-routine-description-error" className="text-sm text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
