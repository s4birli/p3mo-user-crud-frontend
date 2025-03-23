import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validations';
import { UserFormData, Role } from '../../types';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { roleService } from '@/services/api';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';

const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Japan', 'Brazil', 'India', 'China',
    'South Africa', 'Mexico', 'Russia', 'Sweden', 'Netherlands', 'Switzerland',
    'Turkey'
].sort();

interface UserFormProps {
    defaultValues?: Partial<UserFormData>;
    isSubmitting: boolean;
    onSubmit: (data: UserFormData) => void;
}

export default function UserForm({
    defaultValues,
    isSubmitting,
    onSubmit
}: UserFormProps) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);

    // Format any default date to ensure it's in the correct format
    const formattedDefaults = defaultValues ? {
        ...defaultValues,
        dateOfBirth: defaultValues.dateOfBirth ? formatDateString(defaultValues.dateOfBirth) : ''
    } : undefined;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoadingRoles(true);
                const rolesData = await roleService.getAllRoles();
                setRoles(rolesData);
            } catch {
                toast.error("Failed to load role data. Please try refreshing the page.");
                setRoles([]);
            } finally {
                setIsLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            roleId: 2,
            isActive: true,
            country: '',
            ...formattedDefaults,
        }
    });

    // Helper function to format date string to YYYY-MM-DD
    function formatDateString(dateStr: string): string {
        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return format(date, "yyyy-MM-dd");
            }
        } catch {
            // Silent fail, return original if parsing fails
        }
        return dateStr;
    }

    // Get a safe date object from a string
    function getDateFromString(dateStr: string): Date | undefined {
        try {
            if (!dateStr) return undefined;
            
            // Try to parse the date - handle various formats
            const date = new Date(dateStr);
            
            // Check if the date is valid
            if (!isNaN(date.getTime())) {
                return date;
            }
            return undefined;
        } catch {
            return undefined;
        }
    }

    const handleSubmit = (data: UserFormData) => {
        // Ensure date is in the correct format before submitting
        const formattedData = {
            ...data,
            dateOfBirth: formatDateString(data.dateOfBirth)
        };
        onSubmit(formattedData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="h-[14px] mb-2">First Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Last Name */}
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="h-[14px] mb-2">Last Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Middle Name */}
                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="h-[14px] mb-2">Middle Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="(Optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="h-[14px] mb-2">Email*</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Role */}
                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem className="w-full min-w-full">
                                <FormLabel className="h-[14px] mb-2">Role*</FormLabel>
                                <Select 
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    value={field.value?.toString()}
                                    disabled={isLoadingRoles}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Country */}
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem className="w-full min-w-full">
                                <FormLabel className="h-[14px] mb-2">Country*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date of Birth */}
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="h-[14px] mb-2">Date of Birth*</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(getDateFromString(field.value) || new Date(), "MMMM d, yyyy")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="ml-auto h-4 w-4 opacity-50"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                                    <line x1="16" x2="16" y1="2" y2="6" />
                                                    <line x1="8" x2="8" y1="2" y2="6" />
                                                    <line x1="3" x2="21" y1="10" y2="10" />
                                                </svg>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={getDateFromString(field.value)}
                                            onSelect={(date) => {
                                                if (date) {
                                                    // Always store as YYYY-MM-DD
                                                    const formattedDate = format(date, "yyyy-MM-dd");
                                                    field.onChange(formattedDate);
                                                } else {
                                                    field.onChange('');
                                                }
                                            }}
                                            disabled={(date) => {
                                                const today = new Date();
                                                const minDate = new Date();
                                                minDate.setFullYear(today.getFullYear() - 100);
                                                const maxDate = new Date();
                                                maxDate.setFullYear(today.getFullYear() - 18);
                                                return date > maxDate || date < minDate;
                                            }}
                                            captionLayout="dropdown-buttons"
                                            fromYear={new Date().getFullYear() - 100}
                                            toYear={new Date().getFullYear() - 18}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    User must be 18 years or older. Date format: YYYY-MM-DD
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Active Status */}
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base leading-none">Active Status</FormLabel>
                                    <FormDescription>
                                        Is this user account active?
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loading size="sm" text="" className="mr-2" />
                            Saving...
                        </>
                    ) : 'Save User'}
                </Button>
            </form>
        </Form>
    );
} 