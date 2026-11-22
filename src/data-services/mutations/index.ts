import { MutationDataService } from '../type';
import { AuthKeys, authMutations } from './auth';
import { UsersMutationKeys, usersMutations } from './users';

// Register each new domain here: add its keys to the union and spread its map.
export type AllMutationKeys = AuthKeys | UsersMutationKeys;

export const allMutations: MutationDataService<AllMutationKeys> = {
    ...authMutations,
    ...usersMutations,
};
