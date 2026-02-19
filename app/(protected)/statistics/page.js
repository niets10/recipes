import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatisticsCalendar } from '@/components/fitness/statistics-calendar';
import { getDatesWithStatisticsAction } from '@/actions/database/daily-statistic-actions';
import { routes } from '@/lib/routes';
import { Calendar } from 'lucide-react';

function getCurrentYearMonth() {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export const metadata = {
    title: 'Statistics',
    description: 'Daily statistics calendar',
};

export default async function StatisticsPage() {
    const { year, month } = getCurrentYearMonth();
    const datesWithData = await getDatesWithStatisticsAction(year, month).catch(() => []);

    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                        <Calendar className="size-6 text-primary" />
                        Statistics
                    </h1>
                    <p className="text-muted-foreground mt-1">Click a day to view or log your daily statistic.</p>
                </div>
                <Button asChild>
                    <Link href={routes.statisticsDayForDate(todayStr)}>Today</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatisticsCalendar
                        datesWithData={datesWithData}
                        initialYear={year}
                        initialMonth={month}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
