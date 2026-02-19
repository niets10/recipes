'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createGymExerciseAction } from '@/actions/database/gym-exercise-actions';
import { CreateGymExerciseSchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';

const defaultValues = {
    title: '',
    description: '',
    sets: '',
    reps: '',
    weight: '',
    comments: '',
    body_part: '',
};

export function CreateGymExerciseForm({ onSuccess, className }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues,
        resolver: zodResolver(CreateGymExerciseSchema),
    });

    useEffect(() => {
        if (errors.title) setFocus('title');
    }, [errors.title, setFocus]);

    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.set('title', data.title);
            formData.set('description', data.description ?? '');
            formData.set('sets', data.sets ?? '');
            formData.set('reps', data.reps ?? '');
            formData.set('weight', data.weight ?? '');
            formData.set('comments', data.comments ?? '');
            formData.set('body_part', data.body_part ?? '');
            const result = await createGymExerciseAction(formData);
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
            toastRichError({ message: 'Failed to create exercise. Please try again.' });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            {errors.root && (
                <p className="text-sm text-destructive" role="alert">{errors.root.message}</p>
            )}
            <div className="space-y-2">
                <label htmlFor="ge-title" className="text-sm font-medium">Title</label>
                <Input id="ge-title" placeholder="e.g. Bench Press" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
                <label htmlFor="ge-body_part" className="text-sm font-medium">Body part</label>
                <Input id="ge-body_part" placeholder="e.g. Chest, Back" {...register('body_part')} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                    <label htmlFor="ge-sets" className="text-sm font-medium">Sets</label>
                    <Input id="ge-sets" type="number" min={0} placeholder="0" {...register('sets')} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="ge-reps" className="text-sm font-medium">Reps</label>
                    <Input id="ge-reps" type="number" min={0} placeholder="0" {...register('reps')} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="ge-weight" className="text-sm font-medium">Weight (kg)</label>
                    <Input id="ge-weight" type="number" min={0} step={0.5} placeholder="0" {...register('weight')} />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="ge-description" className="text-sm font-medium">Description (optional)</label>
                <textarea
                    id="ge-description"
                    rows={2}
                    placeholder="Notes..."
                    className={cn(
                        'border-input bg-transparent flex w-full min-w-0 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    )}
                    {...register('description')}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="ge-comments" className="text-sm font-medium">Comments (optional)</label>
                <Input id="ge-comments" placeholder="e.g. Felt strong" {...register('comments')} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create Exercise'}</Button>
            </div>
        </form>
    );
}
