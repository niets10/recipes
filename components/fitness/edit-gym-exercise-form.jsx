'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateGymExerciseAction } from '@/actions/database/gym-exercise-actions';
import { UpdateGymExerciseSchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';

export function EditGymExerciseForm({ exercise, onSuccess, className }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues: {
            id: exercise.id,
            title: exercise.title ?? '',
            description: exercise.description ?? '',
            comments: exercise.comments ?? '',
            body_part: exercise.body_part ?? '',
        },
        resolver: zodResolver(UpdateGymExerciseSchema),
    });

    useEffect(() => {
        if (errors.title) setFocus('title');
    }, [errors.title, setFocus]);

    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.set('id', data.id);
            formData.set('title', data.title);
            formData.set('description', data.description ?? '');
            formData.set('comments', data.comments ?? '');
            formData.set('body_part', data.body_part ?? '');
            const result = await updateGymExerciseAction(formData);
            if (result?.success) {
                onSuccess?.();
                return;
            }
            if (result?.error) {
                if (result.error._form?.[0]) {
                    setError('root', { message: result.error._form[0] });
                    toastRichError({ message: result.error._form[0] });
                }
                Object.entries(result.error).forEach(([field, msgs]) => {
                    if (field !== '_form' && msgs?.[0]) setError(field, { message: msgs[0] });
                });
            }
        } catch (err) {
            toastRichError({ message: 'Failed to update exercise.' });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            {errors.root && (
                <p className="text-sm text-destructive" role="alert">{errors.root.message}</p>
            )}
            <div className="space-y-2">
                <label htmlFor="ge-edit-title" className="text-sm font-medium">Title</label>
                <Input id="ge-edit-title" placeholder="e.g. Bench Press" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
                <label htmlFor="ge-edit-body_part" className="text-sm font-medium">Body part</label>
                <Input id="ge-edit-body_part" placeholder="e.g. Chest, Back" {...register('body_part')} />
            </div>
            <div className="space-y-2">
                <label htmlFor="ge-edit-description" className="text-sm font-medium">Description</label>
                <textarea
                    id="ge-edit-description"
                    rows={2}
                    className={cn('border-input bg-transparent flex w-full min-w-0 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                    {...register('description')}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="ge-edit-comments" className="text-sm font-medium">Comments</label>
                <Input id="ge-edit-comments" {...register('comments')} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save'}</Button>
            </div>
        </form>
    );
}
