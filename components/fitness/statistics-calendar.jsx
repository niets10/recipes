'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { getDatesWithStatisticsAction } from '@/actions/database/daily-statistic-actions';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function StatisticsCalendar({ datesWithData = [], initialYear, initialMonth }) {
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [datesWithDataState, setDatesWithDataState] = useState(datesWithData);

    useEffect(() => {
        if (year === initialYear && month === initialMonth) {
            setDatesWithDataState(datesWithData);
        } else {
            getDatesWithStatisticsAction(year, month).then(setDatesWithDataState).catch(() => setDatesWithDataState([]));
        }
    }, [year, month, initialYear, initialMonth, datesWithData]);

    const datesSet = useMemo(() => new Set(datesWithDataState), [datesWithDataState]);

    const days = useMemo(() => {
        const first = new Date(year, month - 1, 1);
        const last = new Date(year, month, 0);
        const firstWeekday = first.getDay();
        const padStart = firstWeekday === 0 ? 6 : firstWeekday - 1;
        const out = [];
        for (let i = 0; i < padStart; i++) out.push(null);
        for (let d = 1; d <= last.getDate(); d++) out.push(new Date(year, month - 1, d));
        return out;
    }, [year, month]);

    const monthLabel = useMemo(() => {
        const d = new Date(year, month - 1, 1);
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }, [year, month]);

    function prevMonth() {
        if (month === 1) {
            setMonth(12);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        if (month === 12) {
            setMonth(1);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    }

    const todayKey = useMemo(() => formatDateKey(new Date()), []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{monthLabel}</h2>
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="font-medium text-muted-foreground py-1">
                        {day}
                    </div>
                ))}
                {days.map((d, i) => {
                    if (!d) {
                        return <div key={`pad-${i}`} className="p-2" />;
                    }
                    const key = formatDateKey(d);
                    const hasData = datesSet.has(key);
                    const isToday = key === todayKey;
                    return (
                        <Link
                            key={key}
                            href={routes.statisticsDayForDate(key)}
                            className={cn(
                                'flex h-10 w-full items-center justify-center rounded-md text-sm transition-colors',
                                'hover:bg-primary/10 hover:text-primary',
                                hasData && 'bg-primary/15 font-medium text-primary',
                                isToday && 'ring-2 ring-primary ring-offset-2'
                            )}
                        >
                            {d.getDate()}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
