import { Role } from '@/types/enums/role.enum';
import { Disc2Icon, Home, Users } from 'lucide-react';

export interface AdminMenuInterface {
    id: number;
    name: string;
    slug?: string;
    icon: React.ReactNode;
    badge?: number;
    allowedRoles?: Role[];
    children?: AdminMenuInterface[];
}

export const adminMenuItems: AdminMenuInterface[] = [
    {
        id: 1,
        name: 'Dashboard',
        slug: 'admin',
        icon: <Home className={'w-5 h-5'} />,
    },
    {
        id: 2,
        name: 'Master',
        icon: <Disc2Icon className={'w-5 h-5'} />,
        allowedRoles: [Role.SUPERADMIN],
        children: [
            {
                id: 1,
                name: 'Users',
                slug: 'admin/users',
                icon: <Users className={'w-5 h-5'} />,
                allowedRoles: [Role.SUPERADMIN],
            },
        ],
    },
];
