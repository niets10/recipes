'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, Dumbbell, Calendar, ListOrdered, Activity } from 'lucide-react';
import { routes } from '@/lib/routes';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
    { title: 'Home', href: routes.home, icon: Home },
    { title: 'Recipes', href: routes.recipes, icon: UtensilsCrossed },
];

const fitnessSubItems = [
    { title: 'Routines', href: routes.fitnessRoutines, icon: ListOrdered },
    { title: 'Gym Exercises', href: routes.fitnessGymExercises, icon: Dumbbell },
    { title: 'Activities', href: routes.fitnessActivities, icon: Activity },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    const closeMobileSidebar = () => setOpenMobile(false);

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={routes.home} onClick={closeMobileSidebar}>
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                    <UtensilsCrossed className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Recipes</span>
                                    <span className="text-xs text-muted-foreground">
                                        Manage your recipes
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href} onClick={closeMobileSidebar}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(routes.fitness)}
                                    tooltip="Fitness"
                                >
                                    <Link href={routes.fitness} onClick={closeMobileSidebar}>
                                        <Dumbbell />
                                        <span>Fitness</span>
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    {fitnessSubItems.map((sub) => (
                                        <SidebarMenuSubItem key={sub.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={pathname === sub.href}
                                            >
                                                <Link href={sub.href} onClick={closeMobileSidebar}>
                                                    <sub.icon />
                                                    <span>{sub.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(routes.statistics)}
                                    tooltip="Statistics"
                                >
                                    <Link href={routes.statistics} onClick={closeMobileSidebar}>
                                        <Calendar />
                                        <span>Statistics</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
