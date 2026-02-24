'use client';

import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { deleteActivityAction } from '@/actions/database/activity-actions';
import { routes } from '@/lib/routes';

export function DeleteActivity({ activityId, activityTitle }) {
    return (
        <DeleteConfirmDialog
            id={activityId}
            itemTitle={activityTitle}
            dialogTitle="Delete activity"
            dialogDescription='Remove "{title}"? This cannot be undone.'
            deleteAction={deleteActivityAction}
            redirectTo={routes.fitnessActivities}
            successMessage="Activity deleted"
        />
    );
}
