'use client';

import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

export default function StatisticsDayIndexPage() {
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    redirect(routes.statisticsDayForDate(dateStr));
}
