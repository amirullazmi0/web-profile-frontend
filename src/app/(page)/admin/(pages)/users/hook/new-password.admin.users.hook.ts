import useMutationApiRequest from '@/hooks/react-query/useMutationApiRequest';
import { GlobalApiResponse } from '@/types/api/responses';
import { UserResponse } from '@/types/user';
import {
    UpsertUserFormDataNewPassword,
    upsertUserSchemaNewPassword,
} from '../config/config.admin.users';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generatePassword } from '@/shared/generatePassword';

interface Props {
    handleClose: () => void;
    id?: string;
}

export default function useNewPasswordAdminUsers({ handleClose, id }: Readonly<Props>) {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
        control,
        reset,
        trigger,
    } = useForm<UpsertUserFormDataNewPassword>({
        defaultValues: {
            password: '',
        },
        resolver: yupResolver(upsertUserSchemaNewPassword),
        mode: 'onChange',
    });

    const { mutateAsync: updateAdmin, isPending: updateAdminIsPending } = useMutationApiRequest<
        GlobalApiResponse<UserResponse>,
        UpsertUserFormDataNewPassword
    >({
        key: 'users-change-password-admin',
        params: {
            id: id ?? '',
        },
        options: {
            onSuccess: () => {
                handleClose();
                reset();
            },
        },
    });

    const onSubmit = (data: UpsertUserFormDataNewPassword) => {
        updateAdmin(data);
    };

    const getPassword = () => {
        const password = generatePassword();
        setValue('password', password);
        trigger('password');
    };

    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        errors,
        setValue,
        control,
        isLoading: updateAdminIsPending,
        reset,
        trigger,
        getPassword,
    };
}
