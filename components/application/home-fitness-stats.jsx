'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/application/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/lib/routes';
import { Activity, Footprints, Flame, CheckCircle2, Circle, Dumbbell, ArrowRight } from 'lucide-react';

function getTodayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}

export function HomeFitnessStats({ data }) {
    const hasError = data?.error;
    const workedOutToday = data?.workedOutToday ?? false;
    const last7 = data?.last7;
    const summary = last7?.summary;
    const dailySeries = last7?.dailySeries ?? [];
    const weekWorkouts = data?.weekWorkouts ?? [];

    const hasAnyData = summary && (
        (summary.daysWithWorkout > 0) ||
        (summary.totalSteps > 0) ||
        (summary.avgSteps > 0) ||
        (summary.totalActivityMinutes > 0)
    );

    if (hasError) {
        return null;
    }

    if (!hasAnyData) {
        return (
            <Card className="border-t-4 fitness-card-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Dumbbell className="size-4 text-primary" />
                        Fitness at a glance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Log your workouts and daily stats to see summaries here.
                    </p>
                    <Button asChild size="sm" variant="outline">
                        <Link href={routes.statistics}>
                            Log today&apos;s stats
                            <ArrowRight className="size-4 ml-1" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const todayStr = getTodayStr();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Dumbbell className="size-5 text-primary" />
                <h2 className="font-medium">Fitness at a glance</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-t-4 fitness-card-border sm:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Worked out today</span>
                        {workedOutToday ? (
                            <CheckCircle2 className="size-4 text-green-600 dark:text-green-500" aria-hidden />
                        ) : (
                            <Circle className="size-4 text-muted-foreground" aria-hidden />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{workedOutToday ? 'Yes' : 'No'}</span>
                            {workedOutToday && (
                                <Badge variant="secondary" className="font-normal text-green-700 dark:text-green-400 bg-green-500/15 border-green-500/30">
                                    Done
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {workedOutToday ? 'You logged a workout today' : 'No workout logged yet'}
                        </p>
                    </CardContent>
                </Card>

                <StatCard
                    title="Workout days"
                    value={summary.daysWithWorkout}
                    description={`Last 7 days (of ${summary.daysInRange})`}
                    icon={Activity}
                />
                <StatCard
                    title="Avg steps"
                    value={summary.avgSteps > 0 ? summary.avgSteps.toLocaleString() : '—'}
                    description="Last 7 days (days with data)"
                    icon={Footprints}
                />
                <StatCard
                    title="Activity time"
                    value={summary.totalActivityMinutes ? `${summary.totalActivityMinutes} min` : '—'}
                    description="Last 7 days"
                    icon={Flame}
                />
            </div>

            {weekWorkouts.length > 0 && (
                <Card className="border-t-4 fitness-card-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">This week&apos;s workouts</CardTitle>
                        <p className="text-xs text-muted-foreground font-normal">Exercises and activities by day</p>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {weekWorkouts.map((day) => (
                                <li key={day.date} className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {day.shortLabel}
                                    </span>
                                    <ul className="flex flex-wrap gap-1.5">
                                        {day.items.map((item, i) => (
                                            <li key={`${day.date}-${i}-${item.name}`}>
                                                <Badge
                                                    variant="outline"
                                                    className="font-normal text-xs gap-1"
                                                >
                                                    {item.type === 'gym' ? (
                                                        <Dumbbell className="size-3" aria-hidden />
                                                    ) : (
                                                        <Activity className="size-3" aria-hidden />
                                                    )}
                                                    {item.name}
                                                </Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end">
                <Button asChild size="sm" variant="ghost" className="text-muted-foreground">
                    <Link href={routes.fitness}>View fitness stats</Link>
                </Button>
            </div>
        </div>
    );
}
