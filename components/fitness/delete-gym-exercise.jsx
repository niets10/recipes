'use client';

import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { deleteGymExerciseAction } from '@/actions/database/gym-exercise-actions';
import { routes } from '@/lib/routes';

export function DeleteGymExercise({ exerciseId, exerciseTitle }) {
    return (
        <DeleteConfirmDialog
            id={exerciseId}
            itemTitle={exerciseTitle}
            dialogTitle="Delete exercise"
            dialogDescription='Remove "{title}" from your library? This cannot be undone.'
            deleteAction={deleteGymExerciseAction}
            redirectTo={routes.fitnessGymExercises}
            successMessage="Exercise deleted"
        />
    );
}
