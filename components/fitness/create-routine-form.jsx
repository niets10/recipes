'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRoutineAction } from '@/actions/database/routine-actions';
import { CreateRoutineSchema } from '@/schemas';
import { cn } from '@/lib/utils';
import { toastRichError } from '@/lib/toast-library';

export function CreateRoutineForm({ onSuccess, className }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        setFocus,
    } = useForm({
        defaultValues: { name: '' },
        resolver: zodResolver(CreateRoutineSchema),
    });

    useEffect(() => {
        if (errors.name) setFocus('name');
    }, [errors.name, setFocus]);

    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.set('name', data.name);
            const result = await createRoutineAction(formData);
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
            }
        } catch (err) {
            toastRichError({ message: 'Failed to create routine.' });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>
            {errors.root && <p className="text-sm text-destructive" role="alert">{errors.root.message}</p>}
            <div className="space-y-2">
                <label htmlFor="routine-name" className="text-sm font-medium">Name</label>
                <Input id="routine-name" placeholder="e.g. Pull I, Push Day" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create routine'}</Button>
            </div>
        </form>
    );
}
