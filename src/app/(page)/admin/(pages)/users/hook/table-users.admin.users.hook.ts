import useMutationApiRequest from '@/hooks/react-query/useMutationApiRequest';
import { useAuth } from '@/hooks/react-query/useAuth';
import useQueryApiRequest from '@/hooks/react-query/useQueryApiRequest';
import { useDebounce } from '@/hooks/useDebounce';
import { GlobalApiResponse } from '@/types/api/responses';
import { UserResponse } from '@/types/user';
import { OnChangeFn, SortingState } from '@tanstack/react-table';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';

export default function useTableUsersAdminUsersHook() {
    const [params, setParams] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(10),
        search: parseAsString.withDefault(''),
        sort: parseAsString.withDefault('created_at'),
        order: parseAsString.withDefault('desc'),
    });

    const sorting = useMemo<SortingState>(
        () => [{ id: params.sort, desc: params.order === 'desc' }],
        [params.sort, params.order],
    );

    const setSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
        const newSortingValue =
            typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
        const sortItem = newSortingValue[0];
        if (sortItem) {
            setParams({
                sort: sortItem.id,
                order: sortItem.desc ? 'desc' : 'asc',
                page: 1,
            });
        }
    };

    const debouncedSearch = useDebounce(params.search, 500);

    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalSetActive, setOpenModalSetActive] = useState(false);

    const { user } = useAuth();

    const { data: usersData, isLoading: usersIsLoading } = useQueryApiRequest<
        GlobalApiResponse<UserResponse[]>
    >({
        key: 'users',
        queries: {
            sort: params.sort,
            order: params.order,
            search: debouncedSearch,
            page: params.page,
            limit: params.limit,
        },
    });

    const { mutateAsync: deleteUser, isPending: deleteUserIsLoading } = useMutationApiRequest<
        GlobalApiResponse<null>,
        { id: string }
    >({
        key: 'users-delete',
        params: {
            id: selectedUser?.id ?? '',
        },
        options: {
            onSuccess: () => {
                handleCloseDeleteModal();
            },
        },
    });

    const { mutateAsync: setActiveUser, isPending: setActiveUserIsLoading } = useMutationApiRequest<
        GlobalApiResponse<null>,
        { id: string }
    >({
        key: 'users-setActive-admin',
        params: {
            id: selectedUser?.id ?? '',
        },
        options: {
            onSuccess: () => {
                handleCloseSetActiveModal();
            },
        },
    });

    const handleSelectUser = (user: UserResponse) => {
        setSelectedUser(user);
    };

    const handleOpenEditModal = () => {
        setOpenModalEdit(true);
    };

    const handleCloseEditModal = () => {
        setOpenModalEdit(false);
    };

    const handleOpenChangePasswordModal = () => {
        setOpenChangePasswordModal(true);
    };

    const handleCloseChangePasswordModal = () => {
        setOpenChangePasswordModal(false);
    };

    const handleOpenDeleteModal = () => {
        setOpenModalDelete(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenModalDelete(false);
    };

    const handleDeleteUser = async () => {
        await deleteUser({ id: selectedUser?.id ?? '' });
    };

    const handleOpenSetActiveModal = () => {
        setOpenModalSetActive(true);
    };

    const handleCloseSetActiveModal = () => {
        setOpenModalSetActive(false);
    };

    const handleSetActiveUser = async () => {
        await setActiveUser({ id: selectedUser?.id ?? '' });
    };

    return {
        usersData: usersData?.data,
        usersIsLoading,
        params,
        setParams,
        sorting,
        setSorting,
        search: params.search,
        setSearch: (value: string) => setParams({ search: value, page: 1 }),
        page: params.page,
        setPage: (page: number) => setParams({ page }),
        perPage: params.limit,
        setPerPage: (limit: number) => setParams({ limit, page: 1 }),
        totalData: usersData?.meta?.total_data,
        totalPage: usersData?.meta?.total_page || 0,
        openModalEdit,
        handleOpenEditModal,
        handleCloseEditModal,
        openChangePasswordModal,
        handleOpenChangePasswordModal,
        handleCloseChangePasswordModal,
        openModalDelete,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleDeleteUser,
        deleteUserIsLoading,
        selectedData: selectedUser,
        handleSelectUser,
        userAuth: user,
        openModalSetActive,
        handleOpenSetActiveModal,
        handleCloseSetActiveModal,
        handleSetActiveUser,
        setActiveUserIsLoading,
    };
}
