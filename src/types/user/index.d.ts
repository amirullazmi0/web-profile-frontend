import { Role } from '../enums/role.enum';

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: Role;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
