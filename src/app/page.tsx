'use client';

import { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { toast } from 'sonner';
import { PrintButton } from '@/components/ui/print-button';
import { statsService } from '@/services/api';
import UserDashboard from '@/components/dashboard/UserDashboard';

export default function Home() {
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    active: 0,
    inactive: 0,
    roleDistribution: { Admin: 0, User: 0, Guest: 0 },
    monthlyRegistrations: []
  });

  // Load statistics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const statsData = await statsService.getUserStats();
        setStats(statsData);
      } catch {
        toast.error("Statistics could not be loaded. Please try again later.");
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold">User Dashboard</h2>
        <PrintButton />
      </div>
      <UserDashboard stats={stats} isLoading={isLoadingStats} />
    </div>
  );
}
