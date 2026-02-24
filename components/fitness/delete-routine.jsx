'use client';

import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { deleteRoutineAction } from '@/actions/database/routine-actions';
import { routes } from '@/lib/routes';

export function DeleteRoutine({ routineId, routineName }) {
    return (
        <DeleteConfirmDialog
            id={routineId}
            itemTitle={routineName || 'Untitled'}
            dialogTitle="Delete routine"
            dialogDescription='Remove "{title}"? This cannot be undone.'
            deleteAction={deleteRoutineAction}
            redirectTo={routes.fitnessRoutines}
            successMessage="Routine deleted"
        />
    );
}
