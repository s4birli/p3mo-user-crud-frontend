'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '../../../types';
import UserDetail from '@/components/users/UserDetail';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { userService } from '@/services/api';
import { UserDetailsSkeleton } from '@/components/skeletons/UserDetailsSkeleton';

export default function UserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const userId = typeof params.id === 'string' ? parseInt(params.id) : 0;

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [hasError, setHasError] = useState(false);

    // Function to fetch user data
    const fetchUserData = useCallback(async () => {
        if (!userId) return;
        
        try {
            setIsLoading(true);
            const userData = await userService.getUserById(userId);
            setUser(userData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to load user details. Please try refreshing the page.");
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Load user data from the API on initial render
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // If user ID is invalid, redirect to users page
    useEffect(() => {
        if (!userId) {
            router.push('/users');
        }
    }, [userId, router]);

    // Handle refreshing user data after an update
    const handleUserUpdated = async () => {
        await fetchUserData();
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                    <Link href="/users">
                        <Button variant="outline">Back to Users</Button>
                    </Link>
                </div>
                <UserDetailsSkeleton />
            </div>
        );
    }

    if (hasError || !user) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                    <Link href="/users">
                        <Button variant="outline">Back to Users</Button>
                    </Link>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                    <h3 className="text-lg font-semibold">Error Loading User</h3>
                    <p>The requested user could not be found or an error occurred.</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push('/users')}
                    >
                        Return to User List
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                <Link href="/users">
                    <Button variant="outline">Back to Users</Button>
                </Link>
            </div>
            <UserDetail 
                user={user} 
                onUserUpdated={handleUserUpdated}
            />
        </div>
    );
} 