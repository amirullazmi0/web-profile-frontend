'use client';
import { Button } from '@/components/ui/button';
import TableUsersAdminUsersView from './components/table-users.admin.users.view';
import { PlusIcon } from 'lucide-react';
import ModalUpsertAdminUsersView from './components/modal-upsert.admin.users.view';
import { useState } from 'react';

export default function AdminUsersView() {
    const [open, setOpen] = useState(false);

    const handleOpenModal = (open: boolean) => {
        setOpen(open);
    };

    return (
        <div className="bg-white p-2 shadow-lg rounded-lg flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Users</h1>
                <Button variant={'primary'} size={'sm'} onClick={() => handleOpenModal(true)}>
                    {' '}
                    <PlusIcon /> Add User
                </Button>
            </div>
            <ModalUpsertAdminUsersView open={open} onOpenChange={handleOpenModal} />
            <TableUsersAdminUsersView />
        </div>
    );
}
