import { QueriesDataService } from '../../type';

export type UsersQueryKeys = 'users' | 'users-profile';

export const usersQueries: QueriesDataService<UsersQueryKeys> = {
    users: '/users',
    'users-profile': '/users/profile',
};
