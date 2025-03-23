import { UserStats } from '../../types';
import ActiveUsersChart from '@/components/charts/ActiveUsersChart';
import RoleDistributionChart from '@/components/charts/RoleDistributionChart';
import MonthlyRegistrationsChart from '@/components/charts/MonthlyRegistrationsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

interface UserDashboardProps {
    stats: UserStats;
    isLoading: boolean;
}

export default function UserDashboard({ stats, isLoading }: UserDashboardProps) {
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    const totalUsers = stats.active + stats.inactive;
    if (totalUsers === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Users Yet</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>There are no users in the system yet. Statistics will be displayed here after adding users.</p>
                </CardContent>
            </Card>
        );
    }

    const hasRoleData = Object.values(stats.roleDistribution).some(count => count > 0);
    const hasMonthlyData = stats.monthlyRegistrations && stats.monthlyRegistrations.length > 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActiveUsersChart
                activeCount={stats.active}
                inactiveCount={stats.inactive}
            />
            {hasRoleData ? (
                <RoleDistributionChart
                    roleDistribution={stats.roleDistribution}
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Role Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[220px]">
                        <p className="text-muted-foreground">No role distribution data found</p>
                    </CardContent>
                </Card>
            )}
            {hasMonthlyData ? (
                <MonthlyRegistrationsChart
                    monthlyRegistrations={stats.monthlyRegistrations}
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Monthly Registrations</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[220px]">
                        <p className="text-muted-foreground">No monthly registration data found</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 