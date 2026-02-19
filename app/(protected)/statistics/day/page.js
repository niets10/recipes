import { DailyStatisticComponent } from '@/components/fitness/daily-statistic-component';
import { getDailyStatisticByDateAction } from '@/actions/database/daily-statistic-actions';

function getDateParam(searchParams) {
    const dateStr = typeof searchParams?.date === 'string' ? searchParams.date.trim() : null;
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const today = new Date();
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}

export const metadata = {
    title: 'Daily statistic',
    description: 'Log nutrition, routines, and activities for a day',
};

export default async function StatisticsDayPage({ searchParams }) {
    const params = await searchParams;
    const date = getDateParam(params);
    const initialData = await getDailyStatisticByDateAction(date).catch(() => null);

    return <DailyStatisticComponent date={date} initialData={initialData} />;
}
