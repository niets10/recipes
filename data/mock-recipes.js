/**
 * Fake recipe data for UI examples. Does not touch the database.
 */

export const MOCK_RECIPE_COUNT = 12;

export const MOCK_RECIPES = [
    {
        id: 1,
        title: 'Classic Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, basil, and a thin crispy crust.',
        createdAt: new Date('2025-01-15'),
    },
    {
        id: 2,
        title: 'Lemon Herb Roasted Chicken',
        description: 'Whole chicken with lemon, garlic, and rosemary. Perfect for Sunday dinner.',
        createdAt: new Date('2025-01-14'),
    },
    {
        id: 3,
        title: 'Spaghetti Carbonara',
        description: 'Creamy Roman pasta with guanciale, egg, pecorino, and black pepper.',
        createdAt: new Date('2025-01-12'),
    },
    {
        id: 4,
        title: 'Vegetable Stir Fry',
        description: 'Quick and colorful stir fry with your favorite vegetables and soy sauce.',
        createdAt: new Date('2025-01-10'),
    },
    {
        id: 5,
        title: 'Chocolate Brownies',
        description: 'Fudgy homemade brownies with a crackly top. Best served warm.',
        createdAt: new Date('2025-01-08'),
    },
    {
        id: 6,
        title: 'Greek Salad',
        description: 'Cucumbers, tomatoes, olives, feta, and red onion with oregano dressing.',
        createdAt: new Date('2025-01-05'),
    },
];

/**
 * Get mock recipe count for dashboard stats.
 * @returns {number}
 */
export function getMockRecipeCount() {
    return MOCK_RECIPE_COUNT;
}

/**
 * Get mock recipes, optionally filtered by search query (client-side style filter for demo).
 * @param {{ query?: string }} options
 * @returns {Array<{ id: number, title: string, description: string | null, createdAt: Date }>}
 */
export function getMockRecipes({ query } = {}) {
    if (!query?.trim()) {
        return [...MOCK_RECIPES];
    }
    const q = query.trim().toLowerCase();
    return MOCK_RECIPES.filter(
        (r) =>
            r.title.toLowerCase().includes(q) ||
            (r.description && r.description.toLowerCase().includes(q))
    );
}
