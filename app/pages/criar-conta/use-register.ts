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
        console.log(data);
    });

    return {
        onSubmit,
        defineField,
        isSubmitting,
        errors,
    };
}

export { useRegister };
