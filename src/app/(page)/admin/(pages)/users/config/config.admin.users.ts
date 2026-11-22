import { Role } from '@/types/enums/role.enum';
import * as yup from 'yup';

const passwordRules = yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number',
    );

export const upsertUserSchema = yup.object().shape({
    id: yup.string().when('$isEdit', {
        is: (isEdit: boolean) => isEdit,
        then: (schema) => schema.required('ID is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: yup
        .string()
        .email('Invalid email format')
        .when('$isEdit', {
            is: (isEdit: boolean) => isEdit,
            then: (schema) => schema.notRequired(),
            otherwise: (schema) => schema.required('Email is required'),
        }),
    role: yup
        .string()
        .required('Role is required')
        .oneOf([Role.ADMIN, Role.MEMBER, Role.SUPERADMIN], 'Invalid role'),
    password: yup.string().when('$isEdit', {
        is: (isEdit: boolean) => isEdit,
        then: () =>
            passwordRules
                .transform((value) => (value === '' ? undefined : value))
                .notRequired(),
        otherwise: () =>
            passwordRules.required('Password is required'),
    }),
});

export const upsertUserSchemaNewPassword = yup.object().shape({
    password: passwordRules.required('Password is required'),
});

export type UpsertUserFormDataNewPassword = yup.InferType<typeof upsertUserSchemaNewPassword>;

export interface UpsertUserFormData {
    id?: string;
    name: string;
    email?: string;
    role: Role;
    password?: string;
}
