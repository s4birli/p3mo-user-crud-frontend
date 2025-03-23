import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../../types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

interface UserTableProps {
    users: User[];
    isLoading?: boolean;
    onDeleteUser?: (id: number) => Promise<void>;
}

export default function UserTable({ users, onDeleteUser }: UserTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof User;
        direction: 'ascending' | 'descending';
    } | null>(null);

    // Filter users based on search term and role
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            searchTerm === '' ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.country.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'All' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Sort users based on sort config
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0;

        const key = sortConfig.key;

        // Handle undefined values with sensible defaults
        let aValue: string | number | boolean = a[key] ?? '';
        let bValue: string | number | boolean = b[key] ?? '';

        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // Request sort function
    const requestSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';

        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }

        setSortConfig({ key, direction });
    };

    // Get sort direction indicator
    const getSortDirectionIndicator = (key: keyof User) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    // Handle row click to navigate to user detail
    const handleRowClick = (userId: number) => {
        router.push(`/user/${userId}`);
    };

    // Handle delete button click
    const handleDeleteClick = (e: React.MouseEvent, userId: number) => {
        e.stopPropagation(); // Prevent row click event
        if (onDeleteUser) {
            if (window.confirm('Are you sure you want to delete this user?')) {
                onDeleteUser(userId);
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search by name, email, country..."
                    className="max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="w-full sm:w-[180px]">
                    <Select
                        value={roleFilter}
                        onValueChange={(value) => setRoleFilter(value as UserRole | 'All')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Guest">Guest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('email')}
                                    className="w-full justify-start font-medium"
                                >
                                    Email {getSortDirectionIndicator('email')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('role')}
                                    className="w-full justify-start font-medium"
                                >
                                    Role {getSortDirectionIndicator('role')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('country')}
                                    className="w-full justify-start font-medium"
                                >
                                    Country {getSortDirectionIndicator('country')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('isActive')}
                                    className="w-full justify-start font-medium"
                                >
                                    Status {getSortDirectionIndicator('isActive')}
                                </Button>
                            </TableHead>
                            {onDeleteUser && <TableHead className="w-[60px]">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={onDeleteUser ? 6 : 5} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedUsers.map((user) => (
                                <TableRow
                                    key={user.id}
                                    onClick={() => handleRowClick(user.id)}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-medium">
                                                    {user.firstName} {user.middleName ? `${user.middleName.charAt(0)}. ` : ''}
                                                    {user.lastName}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Created: {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className={`
                      inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800' : ''}
                      ${user.role === 'User' ? 'bg-green-100 text-green-800' : ''}
                      ${user.role === 'Guest' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                                            {user.role}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.country}</TableCell>
                                    <TableCell>
                                        <div className={`
                      w-fit inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </TableCell>
                                    {onDeleteUser && (
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => handleDeleteClick(e, user.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 