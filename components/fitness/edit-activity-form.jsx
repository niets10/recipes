'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateActivityAction } from '@/actions/database/activity-actions';
import { UpdateActivitySchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';

export function EditActivityForm({ activity, onSuccess, className }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues: {
            id: activity.id,
            title: activity.title ?? '',
            description: activity.description ?? '',
            time_minutes: activity.time_minutes ?? '',
            calories: activity.calories ?? '',
        },
        resolver: zodResolver(UpdateActivitySchema),
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
            formData.set('time_minutes', data.time_minutes ?? '');
            formData.set('calories', data.calories ?? '');
            const result = await updateActivityAction(formData);
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
            toastRichError({ message: 'Failed to update activity.' });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            {errors.root && <p className="text-sm text-destructive" role="alert">{errors.root.message}</p>}
            <div className="space-y-2">
                <label htmlFor="act-edit-title" className="text-sm font-medium">Title</label>
                <Input id="act-edit-title" {...register('title')} className={errors.title ? 'border-destructive' : ''} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label htmlFor="act-edit-time" className="text-sm font-medium">Time (min)</label>
                    <Input id="act-edit-time" type="number" min={0} {...register('time_minutes')} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="act-edit-calories" className="text-sm font-medium">Calories</label>
                    <Input id="act-edit-calories" type="number" min={0} {...register('calories')} />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="act-edit-description" className="text-sm font-medium">Description</label>
                <textarea
                    id="act-edit-description"
                    rows={2}
                    className={cn('border-input bg-transparent flex w-full min-w-0 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring')}
                    {...register('description')}
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save'}</Button>
            </div>
        </form>
    );
}
