import * as yup from 'yup';

export const passwordRules = yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number',
    );

export const resetPasswordSchema = yup.object().shape({
    newPassword: passwordRules.required('New password is required'),
    confirmPassword: yup
        .string()
        .required('Confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
