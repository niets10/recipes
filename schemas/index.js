import * as z from 'zod';

export const CreateUserSchema = z.object({
    clerkId: z.string().min(1, { message: 'Clerk ID is required' })
});

export const CreateRecipeSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(200, { message: 'Title must be 200 characters or less' }),
    description: z.string().max(2000, { message: 'Description must be 2000 characters or less' }).optional(),
});

export const UpdateRecipeSchema = z.object({
    id: z.string().min(1, { message: 'Recipe ID is required' }),
    title: z.string().min(1, { message: 'Title is required' }).max(200, { message: 'Title must be 200 characters or less' }),
    description: z.string().max(2000, { message: 'Description must be 2000 characters or less' }).optional(),
    social_media_url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

export * from './fitness';
