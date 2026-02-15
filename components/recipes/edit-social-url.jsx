'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateRecipeSocialUrlAction } from '@/actions/database/recipe-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function EditSocialUrl({ recipeId, initialUrl }) {
    const [url, setUrl] = useState(initialUrl ?? '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await updateRecipeSocialUrlAction(recipeId, url);
            if (result?.success) {
                toastRichSuccess({ message: 'Video URL saved.' });
                return;
            }
            if (result?.error?.social_media_url?.[0]) {
                setError(result.error.social_media_url[0]);
                toastRichError({ message: result.error.social_media_url[0] });
            } else if (result?.error?._form?.[0]) {
                setError(result.error._form[0]);
                toastRichError({ message: result.error._form[0] });
            }
        } catch (err) {
            toastRichError({ message: 'Failed to save. Please try again.' });
            setError('Failed to save.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <label
                htmlFor="social-media-url"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Video / social URL
            </label>
            <div className="flex gap-2">
                <Input
                    id="social-media-url"
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 min-w-0"
                    autoComplete="off"
                />
                <Button type="submit" disabled={isSubmitting} size="default">
                    {isSubmitting ? 'Saving…' : 'Save'}
                </Button>
            </div>
            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
}
