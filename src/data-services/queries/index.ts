import { QueriesDataService } from '../type';
import { usersQueries, UsersQueryKeys } from './users';

// Register each new domain here: add its keys to the union and spread its map.
export type AllQueryKeys = UsersQueryKeys;

export const allQueries: QueriesDataService<AllQueryKeys> = {
    ...usersQueries,
};
