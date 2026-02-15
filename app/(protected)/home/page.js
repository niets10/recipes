import { HomeComponent } from '@/components/application/home-component';

export const metadata = {
    title: 'Home',
    description: 'Recipe statistics and overview',
};

export default async function HomePage() {
    return <HomeComponent />;
}
