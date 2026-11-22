import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema, SignUpFormData } from './auth.sign-up.config';
import { useAuth } from '@/hooks/react-query/useAuth';

const useAuthSignUp = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { register: registerAuth, registerState } = useAuth();

    const onSubmit = (data: SignUpFormData) => {
        registerAuth(data);
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting: isSubmitting || registerState.isLoading,
    };
};

export default useAuthSignUp;
