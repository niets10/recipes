const PUBLIC = '/';
const HOME = '/home';
const RECIPES = `${HOME}/recipes`;
const SIGN_IN = '/sign-in';
const API = '/api';

export const routes = {
    public: PUBLIC,
    signIn: SIGN_IN,
    home: HOME,
    recipes: RECIPES,
    api: API,
};

export const publicRoutes = [routes.public];
export const protectedRoutes = [routes.home, `${routes.home}/(.*)`];
export const signInRoutes = [routes.signIn, `${routes.signIn}/(.*)`];
export const webhooksRoutes = [routes.api, `${routes.api}/webhooks/(.*)`];
