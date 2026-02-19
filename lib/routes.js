const PUBLIC = '/';
const HOME = '/home';
const AUTH = '/auth';
const RECIPES = '/recipes';
const FITNESS = '/fitness';
const FITNESS_ROUTINES = '/fitness/routines';
const FITNESS_GYM_EXERCISES = '/fitness/gym-exercises';
const FITNESS_ACTIVITIES = '/fitness/activities';
const STATISTICS = '/statistics';
const STATISTICS_DAY = '/statistics/day';
/** Build URL for a specific day: /statistics/day/2025-02-19 */
const statisticsDayForDate = (date) => `${STATISTICS_DAY}/${date}`;
const LOGIN = `${AUTH}/login`;
const SIGN_UP = `${AUTH}/sign-up`;
const API = '/api';
const FORGOT_PASSWORD = `${AUTH}/forgot-password`;
const AUTH_CALLBACK = `${AUTH}/callback`;

export const routes = {
    public: PUBLIC,
    login: LOGIN,
    signUp: SIGN_UP,
    forgotPassword: FORGOT_PASSWORD,
    authCallback: AUTH_CALLBACK,
    auth: AUTH,
    home: HOME,
    recipes: RECIPES,
    fitness: FITNESS,
    fitnessRoutines: FITNESS_ROUTINES,
    fitnessGymExercises: FITNESS_GYM_EXERCISES,
    fitnessActivities: FITNESS_ACTIVITIES,
    statistics: STATISTICS,
    statisticsDay: STATISTICS_DAY,
    statisticsDayForDate,
    api: API,
};

export const publicRoutes = [routes.public];
export const protectedRoutes = [
    routes.home,
    routes.recipes,
    routes.fitness,
    routes.statistics,
    `${routes.home}/(.*)`,
    `${routes.fitness}/(.*)`,
    `${routes.statistics}/(.*)`,
];
export const loginRoutes = [routes.login, `${routes.login}/(.*)`];
export const signUpRoutes = [routes.signUp, `${routes.signUp}/(.*)`];
export const authRoutes = [routes.auth, `${routes.auth}/(.*)`];
export const webhooksRoutes = [routes.api, `${routes.api}/webhooks/(.*)`];
