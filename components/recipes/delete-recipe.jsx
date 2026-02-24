'use client';

import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { deleteRecipeAction } from '@/actions/database/recipe-actions';
import { routes } from '@/lib/routes';

export function DeleteRecipe({ recipe }) {
    return (
        <DeleteConfirmDialog
            id={recipe.id}
            itemTitle={recipe.title}
            dialogTitle="Delete recipe"
            dialogDescription='Remove "{title}"? This cannot be undone.'
            deleteAction={deleteRecipeAction}
            redirectTo={routes.recipes}
            successMessage="Recipe deleted!"
        />
    );
}
