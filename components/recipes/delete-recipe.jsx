'use client';

import { Button } from '@/components/ui/button';
import { deleteRecipeAction } from '@/actions/database/recipe-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

export function DeleteRecipe({ recipe }) {
    console.log('DeleteRecipe...', recipe);
    const router = useRouter();
    const handleDeleteRecipe = async (id) => {
        console.log('handleDeleteRecipe...', id);
        try {
            await deleteRecipeAction(id);
            router.push(routes.recipes);
            toastRichSuccess({
                message: 'Recipe deleted!',
            });
        } catch (error) {
            console.log('error...', error);
            toastRichError({
                message: error.message,
            });
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            className="hover:cursor-pointer"
            onClick={() => handleDeleteRecipe(recipe.id)}
        >
            Delete
        </Button>
    );
}
