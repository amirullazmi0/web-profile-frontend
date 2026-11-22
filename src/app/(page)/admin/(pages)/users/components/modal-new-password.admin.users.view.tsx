'use client';
import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { UserResponse } from '@/types/user';
import { LabelInput, PasswordInput } from '@/components/ui/input';
import useNewPasswordAdminUsers from '../hook/new-password.admin.users.hook';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id?: string;
    selectedData?: UserResponse | null;
}

export default function ModalNewPasswordAdminUsersView({
    open,
    onOpenChange,
    id,
    selectedData,
}: Readonly<Props>) {
    const { control, getPassword, reset, handleSubmit } = useNewPasswordAdminUsers({
        handleClose() {
            onOpenChange(false);
        },
        id,
    });

    useEffect(() => {
        reset();
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>New Password</DialogTitle>
                    <DialogDescription>
                        Change password for user {selectedData?.email}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                            Cancel
                        </Button>
                        <Button variant={'primary'} onClick={handleSubmit} type="button">
                            Save changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
