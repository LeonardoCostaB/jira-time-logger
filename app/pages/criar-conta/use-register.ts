import { toast } from 'vue-sonner';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import { RegisterSchema } from './register.schema';

function useRegister() {
    const { handleSubmit, defineField, isSubmitting, errors } = useForm({
        validationSchema: toTypedSchema(RegisterSchema),
        initialValues: {
            name: '',
            lastName: '',

            email: '',
            password: '',
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            const fetchData = await fetch('/api/auth/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await fetchData.json();

            if (data.success) {
                toast.success('Account created successfully! Redirecting to login page...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while creating the account. Please try again later.');
        }
    });

    return {
        onSubmit,
        defineField,
        isSubmitting,
        errors,
    };
}

export { useRegister };
