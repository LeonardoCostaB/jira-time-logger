import { toTypedSchema } from '@vee-validate/zod';
import axios from 'axios';
import { useForm } from 'vee-validate';

import { LoginSchema } from './login.schema';

function useLogin() {
    const { handleSubmit, defineField, isSubmitting, errors } = useForm({
        validationSchema: toTypedSchema(LoginSchema),
        initialValues: {
            customerEmail: '',
            customerPassword: '',
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            const { data } = await axios.post(
                '/api/auth/sign-in',
                {
                    email: values.customerEmail,
                    password: values.customerPassword,
                },
                {
                    withCredentials: true,
                },
            );

            if (data.success) {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error(error);
        }
    });

    return {
        onSubmit,
        defineField,
        isSubmitting,
        errors,
    };
}

export { useLogin };
