'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/lib/routes';
import { Activity, Footprints, Flame, TrendingUp } from 'lucide-react';

const TAB_KEYS = [
    { key: 'last15', label: 'Last 15 days' },
    { key: 'currentMonth', label: 'Current month' },
    { key: 'lastMonth', label: 'Last month' },
];

export function FitnessStatsCharts({ stats }) {
    const [activeTab, setActiveTab] = useState('last15');

    const hasError = stats?.error;
    const last15 = stats?.last15;
    const currentMonth = stats?.currentMonth;
    const lastMonth = stats?.lastMonth;
    const tabData = { last15, currentMonth, lastMonth };

    const anyHasData = useMemo(() => {
        return TAB_KEYS.some(({ key }) => {
            const data = tabData[key];
            if (!data?.dailySeries?.length) return false;
            const s = data.summary;
            const ab = data.activityBreakdown ?? [];
            return (s?.daysWithWorkout > 0) || (s?.totalSteps > 0) || (s?.avgSteps > 0) || ab.length > 0;
        });
    }, [tabData.last15, tabData.currentMonth, tabData.lastMonth]);

    if (hasError) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Unable to load fitness statistics. Try again later.
                </CardContent>
            </Card>
        );
    }

    if (!anyHasData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="size-5 text-primary" />
                        Your statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Log your workouts and daily stats in the{' '}
                        <Link href={routes.statistics} className="text-primary underline underline-offset-2">
                            Statistics
                        </Link>{' '}
                        section to see charts and insights here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold tracking-tight mb-1">Overview</h2>
                <p className="text-muted-foreground text-sm">From your logged statistics</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    {TAB_KEYS.map(({ key, label }) => (
                        <TabsTrigger key={key} value={key}>
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {TAB_KEYS.map(({ key }) => (
                    <TabsContent key={key} value={key} className="mt-6 space-y-6">
                        <TabPanel tabKey={key} data={tabData[key]} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function TabPanel({ tabKey, data }) {
    const summary = data?.summary;
    const dailySeries = data?.dailySeries ?? [];
    const activityBreakdown = data?.activityBreakdown ?? [];

    const hasData = dailySeries.length > 0 && (
        (summary?.daysWithWorkout > 0) ||
        (summary?.totalSteps > 0) ||
        (summary?.avgSteps > 0) ||
        activityBreakdown.length > 0
    );

    const stepsData = useMemo(
        () =>
            dailySeries.map((d) => ({
                ...d,
                steps: d.steps ?? 0,
            })),
        [dailySeries]
    );

    const caloriesData = useMemo(
        () =>
            dailySeries
                .filter((d) => d.caloriesIngested != null && d.caloriesIngested > 0)
                .map((d) => ({
                    shortLabel: d.shortLabel,
                    calories: d.caloriesIngested,
                })),
        [dailySeries]
    );

    if (!hasData) {
        return (
            <p className="text-muted-foreground text-sm py-4">
                No data for this period. Log stats in{' '}
                <Link href={routes.statistics} className="text-primary underline underline-offset-2">
                    Statistics
                </Link>
                .
            </p>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    title="Workout days"
                    value={summary?.daysWithWorkout ?? 0}
                    subtitle={`of ${summary?.daysInRange ?? 0} days`}
                    icon={Activity}
                />
                <StatCard
                    title="Activity time"
                    value={summary?.totalActivityMinutes ? `${summary.totalActivityMinutes} min` : '—'}
                    subtitle="running, HIIT, etc."
                    icon={Flame}
                />
                <StatCard
                    title="Avg steps"
                    value={summary?.avgSteps > 0 ? summary.avgSteps.toLocaleString() : '—'}
                    subtitle="on days with data"
                    icon={Footprints}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {stepsData.some((d) => d.steps > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Steps per day</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stepsData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id={`stepsGradient-${tabKey}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                                        <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                                            formatter={(value) => [value?.toLocaleString() ?? value, 'Steps']}
                                            labelFormatter={(label) => `Day: ${label}`}
                                        />
                                        <Area type="monotone" dataKey="steps" stroke="var(--primary)" fill={`url(#stepsGradient-${tabKey})`} strokeWidth={2} name="Steps" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {caloriesData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Calories ingested</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={caloriesData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id={`calGradient-${tabKey}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                                        <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                                            formatter={(value) => [value != null ? Number(value).toLocaleString() : '—', 'Calories']}
                                        />
                                        <Area type="monotone" dataKey="calories" stroke="var(--chart-3)" fill={`url(#calGradient-${tabKey})`} strokeWidth={2} name="Calories" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activityBreakdown.length > 0 && (
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Activity time by type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={activityBreakdown}
                                        layout="vertical"
                                        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" tick={{ fontSize: 11 }} unit=" min" className="text-muted-foreground" />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} className="text-muted-foreground" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                                            formatter={(value, name, props) => [
                                                `${props.payload.minutes} min${props.payload.calories > 0 ? ` · ${props.payload.calories} kcal` : ''}`,
                                                props.payload.name,
                                            ]}
                                        />
                                        <Bar dataKey="minutes" fill="var(--chart-2)" name="Minutes" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

function StatCard({ title, value, subtitle, icon: Icon }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );
}
