'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input, LabelInput, PasswordInput } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Role } from '@/types/enums/role.enum';
import { UserResponse } from '@/types/user';
import { Controller } from 'react-hook-form';
import useModalUpsertAdminUsersHook from '../hook/modal-upsert.admin.users.hook';

interface ModalUpsertAdminUsersViewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id?: string;
    selectedData?: UserResponse | null;
}

export default function ModalUpsertAdminUsersView({
    open,
    onOpenChange,
    id,
    selectedData,
}: Readonly<ModalUpsertAdminUsersViewProps>) {
    const { control, handleSubmit, isLoading, getPassword } = useModalUpsertAdminUsersHook({
        id,
        handleClose: () => onOpenChange(false),
        selectedData,
    });

    const roleItem: {
        value: Role;
        label: string;
    }[] = [
        {
            value: Role.ADMIN,
            label: 'Admin',
        },
        {
            value: Role.SUPERADMIN,
            label: 'Super Admin',
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{id ? 'Edit User' : 'Add User'}</DialogTitle>
                    <DialogDescription>
                        {id
                            ? 'Edit user. Click save when done.'
                            : 'Add new user. Click save when done.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid lg:grid-cols-4 grid-cols-1 items-start gap-4">
                        <LabelInput htmlFor="name" className="text-right mt-2" required>
                            Name
                        </LabelInput>
                        <div className="lg:col-span-3 col-span-1">
                            <Controller
                                control={control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <div className="w-full">
                                        <Input
                                            {...field}
                                            placeholder="Name"
                                            className={
                                                fieldState.error
                                                    ? 'border-red-500 focus-visible:ring-red-500'
                                                    : ''
                                            }
                                        />
                                        {fieldState.error?.message && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-4 grid-cols-1 items-start gap-4">
                        <LabelInput htmlFor="email" className="text-right mt-2" required>
                            Email
                        </LabelInput>
                        <div className="lg:col-span-3 col-span-1">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <div className="w-full">
                                        <Input
                                            {...field}
                                            placeholder="Email"
                                            className={
                                                fieldState.error
                                                    ? 'border-red-500 focus-visible:ring-red-500'
                                                    : ''
                                            }
                                            disabled={!!id}
                                        />
                                        {fieldState.error?.message && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    {!id && (
                        <div className="grid lg:grid-cols-4 grid-cols-1 items-start gap-4">
                            <LabelInput htmlFor="password" className="text-right mt-2" required>
                                Password
                            </LabelInput>
                            <div className="lg:col-span-3 col-span-1">
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <div className="w-full">
                                            <div className="flex items-center gap-2">
                                                <PasswordInput
                                                    {...field}
                                                    placeholder="Password"
                                                    className={
                                                        fieldState.error
                                                            ? 'border-red-500 focus-visible:ring-red-500'
                                                            : ''
                                                    }
                                                />
                                                <Button
                                                    variant={'outline'}
                                                    onClick={getPassword}
                                                    type="button"
                                                >
                                                    Generate Password
                                                </Button>
                                            </div>
                                            {fieldState.error?.message && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    <div className="grid lg:grid-cols-4 grid-cols-1 items-center gap-4 w-full">
                        <LabelInput htmlFor="role" className="text-right" required>
                            Role
                        </LabelInput>
                        <div className="lg:col-span-3 col-span-1">
                            <Controller
                                control={control}
                                name="role"
                                placeholder-shown={true}
                                render={({ field, fieldState }) => (
                                    <div className="w-full">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger variant="primary">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {roleItem.map((role) => (
                                                        <SelectItem
                                                            key={role.value}
                                                            value={role.value}
                                                        >
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error?.message && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant={'primary'} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                Saving...
                                <Spinner />
                            </div>
                        ) : (
                            'Save changes'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
