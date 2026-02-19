import { notFound } from 'next/navigation';
import { DailyStatisticComponent } from '@/components/fitness/daily-statistic-component';
import { getDailyStatisticByDateAction } from '@/actions/database/daily-statistic-actions';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function parseDateParam(param) {
    const dateStr = typeof param === 'string' ? param.trim() : null;
    if (!dateStr || !DATE_REGEX.test(dateStr)) return null;
    return dateStr;
}

export const metadata = {
    title: 'Daily statistic',
    description: 'Log nutrition, routines, and activities for a day',
};

export default async function StatisticsDayPage({ params }) {
    const { date: dateParam } = await params;
    const date = parseDateParam(dateParam);
    if (!date) notFound();

    const initialData = await getDailyStatisticByDateAction(date).catch(() => null);

    return <DailyStatisticComponent date={date} initialData={initialData} />;
}
