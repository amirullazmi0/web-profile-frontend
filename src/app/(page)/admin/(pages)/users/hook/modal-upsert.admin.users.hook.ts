import useMutationApiRequest from '@/hooks/react-query/useMutationApiRequest';
import { generatePassword } from '@/shared/generatePassword';
import { GlobalApiResponse } from '@/types/api/responses';
import { Role } from '@/types/enums/role.enum';
import { UserResponse } from '@/types/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { UpsertUserFormData, upsertUserSchema } from '../config/config.admin.users';

interface Props {
    handleClose: () => void;
    id?: string;
    selectedData?: UserResponse | null;
}

export default function useModalUpsertAdminUsersHook({
    id,
    handleClose,
    selectedData,
}: Readonly<Props>) {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
        control,
        reset,
        trigger,
    } = useForm<UpsertUserFormData>({
        defaultValues: {
            id: '',
            name: '',
            email: '',
            password: '',
            role: Role.ADMIN,
        },
        resolver: yupResolver(upsertUserSchema) as unknown as Resolver<UpsertUserFormData>,
        context: { isEdit: !!id },
        mode: 'onChange',
    });

    const { mutateAsync: createAdmin, isPending: createAdminIsPending } = useMutationApiRequest<
        GlobalApiResponse<UserResponse>,
        UpsertUserFormData
    >({
        key: 'users-create-admin',
        options: {
            onSuccess: () => {
                handleClose();
                reset();
            },
        },
    });

    const { mutateAsync: updateAdmin, isPending: updateAdminIsPending } = useMutationApiRequest<
        GlobalApiResponse<UserResponse>,
        UpsertUserFormData
    >({
        key: 'users-update-admin',
        options: {
            onSuccess: () => {
                handleClose();
                reset();
            },
        },
    });

    const isLoading = createAdminIsPending || updateAdminIsPending || false;

    const onSubmit = (data: UpsertUserFormData) => {
        if (id) {
            updateAdmin(data);
        } else {
            createAdmin(data);
        }
    };

    useEffect(() => {
        if (selectedData) {
            setValue('id', selectedData.id);
            setValue('name', selectedData.name);
            setValue('email', selectedData.email);
            setValue('role', selectedData.role);
        }
    }, [selectedData, setValue]);

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
        isLoading,
        getPassword,
    };
}
