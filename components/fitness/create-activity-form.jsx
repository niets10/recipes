'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createActivityAction } from '@/actions/database/activity-actions';
import { CreateActivitySchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';

const defaultValues = { title: '', description: '', time_minutes: '', calories: '' };

export function CreateActivityForm({ onSuccess, className }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues,
        resolver: zodResolver(CreateActivitySchema),
    });

    useEffect(() => {
        if (errors.title) setFocus('title');
    }, [errors.title, setFocus]);

    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.set('title', data.title);
            formData.set('description', data.description ?? '');
            formData.set('time_minutes', data.time_minutes ?? '');
            formData.set('calories', data.calories ?? '');
            const result = await createActivityAction(formData);
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
            toastRichError({ message: 'Failed to create activity.' });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            {errors.root && <p className="text-sm text-destructive" role="alert">{errors.root.message}</p>}
            <div className="space-y-2">
                <label htmlFor="act-title" className="text-sm font-medium">Title</label>
                <Input id="act-title" placeholder="e.g. Running, HIIT" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label htmlFor="act-time" className="text-sm font-medium">Time (min)</label>
                    <Input id="act-time" type="number" min={0} placeholder="0" {...register('time_minutes')} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="act-calories" className="text-sm font-medium">Calories</label>
                    <Input id="act-calories" type="number" min={0} placeholder="0" {...register('calories')} />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="act-description" className="text-sm font-medium">Description (optional)</label>
                <textarea
                    id="act-description"
                    rows={2}
                    className={cn('border-input bg-transparent flex w-full min-w-0 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                    {...register('description')}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create activity'}</Button>
            </div>
        </form>
    );
}
