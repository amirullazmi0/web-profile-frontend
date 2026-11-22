import { MutationDataService } from '../../type';

export type UsersMutationKeys =
    | 'users-create-admin'
    | 'users-change-password-admin'
    | 'users-update-role-admin'
    | 'users-update-profile'
    | 'users-change-password'
    | 'users-delete'
    | 'users-update-admin'
    | 'users-setActive-admin';

export const usersMutations: MutationDataService<UsersMutationKeys> = {
    'users-create-admin': {
        url: '/users/create-admin',
        method: 'POST',
        refetchQueries: ['users'],
    },
    'users-update-profile': {
        url: '/users/profile',
        method: 'PUT',
        refetchQueries: ['users-profile'],
    },
    'users-change-password': {
        url: '/users/change-password',
        method: 'PUT',
    },
    'users-delete': {
        url: '/users/:id',
        method: 'DELETE',
        refetchQueries: ['users'],
    },
    'users-change-password-admin': {
        url: '/users/update-password-admin/:id',
        method: 'PUT',
        refetchQueries: ['users'],
    },
    'users-update-role-admin': {
        url: '/users/update-role-admin/:id',
        method: 'PUT',
        refetchQueries: ['users'],
    },
    'users-update-admin': {
        url: '/users/update-admin',
        method: 'PUT',
        refetchQueries: ['users'],
    },
    'users-setActive-admin': {
        url: '/users/set-active-admin/:id',
        method: 'PUT',
        refetchQueries: ['users'],
    },
};
