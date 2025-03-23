import { useState } from 'react';
import { User } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import UserFormDialog from '@/components/users/UserFormDialog';
import { Pencil } from 'lucide-react';
import { PrintButton } from '@/components/ui/print-button';

interface UserDetailProps {
    user: User;
    onUserUpdated?: () => void;
}

export default function UserDetail({ user, onUserUpdated }: UserDetailProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Handle user update
    const handleUserUpdated = () => {
        if (onUserUpdated) {
            onUserUpdated();
        }
        toast.success('User updated successfully');
    };

    return (
        <>
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">{user.firstName} {user.middleName} {user.lastName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Pencil className="h-4 w-4" /> Edit User
                        </Button>
                        <PrintButton  />
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Icon and Basic Info */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="mt-2 text-center md:text-left">
                            <h3 className="font-medium">Role</h3>
                            <p className={`
                  inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800' : ''}
                  ${user.role === 'User' ? 'bg-green-100 text-green-800' : ''}
                  ${user.role === 'Guest' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                                {user.role}
                            </p>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="font-medium">Status</h3>
                            <p className={`
                  inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-muted-foreground">Full Name</h3>
                                <p className="mt-1">
                                    {user.firstName} {user.middleName ? `${user.middleName} ` : ''}{user.lastName}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-muted-foreground">Email</h3>
                                <p className="mt-1">{user.email}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-muted-foreground">Date of Birth</h3>
                                <p className="mt-1">{formatDate(user.dateOfBirth)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-muted-foreground">Country</h3>
                                <p className="mt-1">{user.country}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-muted-foreground">Created At</h3>
                                <p className="mt-1">{formatDate(user.createdAt)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-muted-foreground">Account Status</h3>
                                <p className="mt-1">{user.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <div className="text-sm text-muted-foreground">
                        User ID: {user.id}
                    </div>
                </CardFooter>
            </Card>

            {/* Edit User Dialog */}
            <UserFormDialog
                user={user}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSuccess={handleUserUpdated}
            />
        </>
    );
} 