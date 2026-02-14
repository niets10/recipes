const PUBLIC = '/';
const HOME = '/home';
const AUTH = '/auth';
const RECIPES = '/recipes';
const LOGIN = `${AUTH}/login`;
const SIGN_UP = `${AUTH}/sign-up`;
const API = '/api';
const FORGOT_PASSWORD = `${AUTH}/forgot-password`;

export const routes = {
    public: PUBLIC,
    login: LOGIN,
    signUp: SIGN_UP,
    forgotPassword: FORGOT_PASSWORD,
    auth: AUTH,
    home: HOME,
    recipes: RECIPES,
    api: API,
};

export const publicRoutes = [routes.public];
export const protectedRoutes = [routes.home, routes.recipes, `${routes.home}/(.*)`];
export const loginRoutes = [routes.login, `${routes.login}/(.*)`];
export const signUpRoutes = [routes.signUp, `${routes.signUp}/(.*)`];
export const authRoutes = [routes.auth, `${routes.auth}/(.*)`];
export const webhooksRoutes = [routes.api, `${routes.api}/webhooks/(.*)`];
