import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-semibold">P3MO User Management</span>
                </Link>
                <nav className="ml-auto flex items-center gap-4">
                    <Link href="/users">
                        <Button variant="ghost">User List</Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header; 