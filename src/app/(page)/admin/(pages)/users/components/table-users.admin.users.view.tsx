'use client';
import CustomConfirmationModal from '@/components/custom/custom-confirmation-modal';
import CustomPagination from '@/components/custom/custom-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Role } from '@/types/enums/role.enum';
import { UserResponse } from '@/types/user';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown, Check, Edit2Icon, Key, X } from 'lucide-react';
import { useMemo } from 'react';
import useTableUsersAdminUsersHook from '../hook/table-users.admin.users.hook';
import ModalNewPasswordAdminUsersView from './modal-new-password.admin.users.view';
import ModalUpsertAdminUsersView from './modal-upsert.admin.users.view';

export default function TableUsersAdminUsersView() {
    const {
        usersData,
        usersIsLoading,
        sorting,
        setSorting,
        search,
        setSearch,
        page,
        setPage,
        perPage,
        totalPage,
        totalData,
        openModalEdit,
        openChangePasswordModal,
        handleCloseChangePasswordModal,
        handleOpenEditModal,
        handleCloseEditModal,
        handleOpenChangePasswordModal,
        openModalDelete,
        handleCloseDeleteModal,
        handleDeleteUser,
        deleteUserIsLoading,
        selectedData,
        handleSelectUser,
        userAuth,
        openModalSetActive,
        handleOpenSetActiveModal,
        handleCloseSetActiveModal,
        handleSetActiveUser,
        setActiveUserIsLoading,
    } = useTableUsersAdminUsersHook();

    const columns = useMemo<ColumnDef<UserResponse>[]>(
        () => [
            {
                id: 'No',
                header: () => <div className="text-center">No</div>,
                cell: ({ row }) => (
                    <div className="text-center">{(page - 1) * perPage + row.index + 1}</div>
                ),
            },
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return (
                        <Button
                            variant={'default'}
                            className="text-black"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: ({ column }) => {
                    return (
                        <Button
                            variant={'default'}
                            className="text-black"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'role',
                header: ({ column }) => {
                    return (
                        <Button
                            variant={'default'}
                            className="text-black"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Role
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const role = row.getValue('role') as Role;

                    return (
                        <Badge
                            variant={
                                role === Role.SUPERADMIN
                                    ? 'primary'
                                    : role === Role.ADMIN
                                      ? 'warning'
                                      : 'info'
                            }
                        >
                            {role === Role.SUPERADMIN
                                ? 'Super Admin'
                                : role === Role.ADMIN
                                  ? 'Admin'
                                  : 'User'}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                cell: ({ row }) => (
                    <div className="capitalize">
                        {row.getValue('is_active') ? (
                            <Badge variant="success">Active</Badge>
                        ) : (
                            <Badge variant="destructive">Inactive</Badge>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'created_at',
                header: ({ column }) => {
                    return (
                        <Button
                            variant={'default'}
                            className="text-black"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Created At
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div>{dayjs(row.getValue('created_at')).format('DD MMMM YYYY')}</div>
                ),
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const isUserAuth = userAuth?.id === row.original.id;
                    return (
                        <div className="flex items-center gap-2 justify-end bg-transparent  ">
                            <Button
                                disabled={isUserAuth}
                                variant={'outline'}
                                size={'sm'}
                                onClick={() => {
                                    handleSelectUser(row.original);
                                    handleOpenEditModal();
                                }}
                            >
                                <Edit2Icon />
                            </Button>
                            <Button
                                disabled={isUserAuth}
                                variant={'info'}
                                size={'sm'}
                                onClick={() => {
                                    handleSelectUser(row.original);
                                    handleOpenChangePasswordModal();
                                }}
                            >
                                <Key />
                            </Button>
                            <Button
                                disabled={isUserAuth}
                                variant={row.original.is_active ? 'destructive' : 'success'}
                                size={'sm'}
                                onClick={() => {
                                    handleSelectUser(row.original);
                                    handleOpenSetActiveModal();
                                }}
                            >
                                {row.original.is_active ? <X /> : <Check />}
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [
            page,
            perPage,
            handleSelectUser,
            handleOpenEditModal,
            handleOpenChangePasswordModal,
                        handleOpenSetActiveModal,
            userAuth,
        ],
    );

    // TanStack Table exposes an imperative API that React Compiler cannot memoize safely.
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: usersData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        manualPagination: true,
        pageCount: totalPage,
    });

    if (usersIsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col w-full">
            <ModalUpsertAdminUsersView
                open={openModalEdit}
                onOpenChange={handleCloseEditModal}
                id={selectedData?.id}
                selectedData={selectedData}
            />
            <ModalNewPasswordAdminUsersView
                open={openChangePasswordModal}
                onOpenChange={handleCloseChangePasswordModal}
                id={selectedData?.id}
                selectedData={selectedData}
            />
            <CustomConfirmationModal
                open={openModalDelete}
                onOpenChange={handleCloseDeleteModal}
                onConfirm={handleDeleteUser}
                isLoading={deleteUserIsLoading}
                title="Confirm Deletion"
                description={
                    <span>
                        Are you sure you want to delete user <strong>{selectedData?.email}</strong>?
                        This action cannot be undone.
                    </span>
                }
                confirmText="Delete"
                variant="danger"
            />

            <CustomConfirmationModal
                open={openModalSetActive}
                onOpenChange={handleCloseSetActiveModal}
                onConfirm={handleSetActiveUser}
                isLoading={setActiveUserIsLoading}
                title={selectedData?.is_active ? 'Confirm Deactivation' : 'Confirm Activation'}
                description={
                    <span>
                        Are you sure you want to{' '}
                        {selectedData?.is_active ? 'deactivate' : 'activate'} user{' '}
                        <strong>{selectedData?.email}</strong>?
                    </span>
                }
                confirmText={selectedData?.is_active ? 'Deactivate' : 'Activate'}
                variant={selectedData?.is_active ? 'warning' : 'primary'}
            />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border-x border-t overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                header.id === 'No' &&
                                                    'sticky left-0 bg-gray-50 z-20',
                                                header.id === 'actions' &&
                                                    'sticky right-0 bg-gray-50 z-20',
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                cell.column.id === 'No' &&
                                                    'sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]',
                                                cell.column.id === 'actions' &&
                                                    'sticky right-0 bg-white z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]',
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <CustomPagination
                page={page}
                setPage={setPage}
                totalPage={totalPage}
                totalData={totalData}
            />
        </div>
    );
}
