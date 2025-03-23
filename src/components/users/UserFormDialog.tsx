import { useState, useEffect } from 'react';
import { User, UserFormData } from '../../types';
import UserForm from '@/components/forms/UserForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { userService } from '@/services/api';
import { FormSkeleton } from '@/components/skeletons/FormSkeleton';

interface UserFormDialogProps {
    user?: User;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onUserAdded?: () => void;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export default function UserFormDialog({ 
    user, 
    open: controlledOpen, 
    onOpenChange: setControlledOpen,
    onUserAdded,
    onSuccess, 
    trigger 
}: UserFormDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [userData, setUserData] = useState<User | undefined>(user);
    
    // Use controlled state if provided, otherwise use internal state
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const setOpen = setControlledOpen || setUncontrolledOpen;

    // If a user ID is provided but not the full user object, fetch the user data
    useEffect(() => {
        if (user?.id && !userData) {
            const fetchUserData = async () => {
                setIsLoadingUser(true);
                try {
                    const data = await userService.getUserById(user.id);
                    setUserData(data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    toast.error('Failed to load user data');
                } finally {
                    setIsLoadingUser(false);
                }
            };
            fetchUserData();
        } else {
            setUserData(user);
        }
    }, [user, userData]);

    const handleSubmit = async (data: UserFormData) => {
        try {
            setIsSubmitting(true);
            
            if (userData) {
                // Update existing user
                await userService.updateUser(userData.id, data);
                toast.success('User updated successfully!');
            } else {
                // Create new user
                await userService.createUser(data);
                toast.success('New user created successfully!');
            }
            
            setOpen(false);

            // Call both callback handlers if provided
            if (onUserAdded) {
                onUserAdded();
            }
            
            if (onSuccess) {
                onSuccess();
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(`Failed to ${userData?.id ? 'update' : 'create'} user`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = userData ? 'Edit User' : 'Add New User';
    const description = userData
        ? 'Update user information below.'
        : 'Fill in the information below to create a new user.';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger}
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {isLoadingUser ? (
                        <FormSkeleton />
                    ) : (
                        <UserForm
                            defaultValues={userData}
                            isSubmitting={isSubmitting}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 