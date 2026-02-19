import { ActivitiesComponent } from '@/components/fitness/activities-component';

export const metadata = {
    title: 'Activities',
    description: 'Running, HIIT, gym session, and more',
};

export default async function ActivitiesPage({ searchParams }) {
    return <ActivitiesComponent searchParams={searchParams} />;
}
