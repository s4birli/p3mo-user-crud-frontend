'use client';

import { useState, useEffect } from 'react';
import { User } from '../../types';
import UserTable from '@/components/users/UserTable';
import UserFormDialog from '@/components/users/UserFormDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { userService } from '@/services/api';
import { UserTableSkeleton } from '@/components/skeletons/UserTableSkeleton';
import { PrintButton } from '@/components/ui/print-button';

export default function UsersPage() {
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Load users from API
    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            setHasError(false);
            const usersData = await userService.getAllUsers();
            setUsers(usersData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to load users. Please try refreshing the page.");
            setHasError(true);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    // Initial loading
    useEffect(() => {
        fetchUsers();
    }, []);

    // User addition process
    const handleUserAdded = async () => {
        // Refresh the list when a user is added
        await fetchUsers();
        toast.success("User added successfully!");
        setIsFormOpen(false);
    };

    // User deletion process
    const handleUserDeleted = async (id: number) => {
        try {
            await userService.deleteUser(id);
            // Remove user from state
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            toast.success("User deleted successfully");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to delete user. Please try again.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        View and manage all users in the system
                    </p>
                </div>
                <div className="flex gap-2">
                    <PrintButton />
                    <Button onClick={() => setIsFormOpen(true)}>Add User</Button>
                </div>
            </div>

            {/* User Table */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                {hasError && !isLoadingUsers ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                        <h3 className="text-lg font-semibold">Error Loading Users</h3>
                        <p>Failed to load user data from the server.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={fetchUsers}
                        >
                            Retry
                        </Button>
                    </div>
                ) : isLoadingUsers ? (
                    <UserTableSkeleton />
                ) : (
                    <UserTable 
                        users={users} 
                        onDeleteUser={handleUserDeleted}
                    />
                )}
            </div>

            {/* User Form Dialog */}
            <UserFormDialog 
                open={isFormOpen} 
                onOpenChange={setIsFormOpen} 
                onUserAdded={handleUserAdded} 
            />
        </div>
    );
} 