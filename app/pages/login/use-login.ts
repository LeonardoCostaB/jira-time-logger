import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'

import { LoginSchema } from "./login.schema";
import axios from "axios";

function useLogin() {
    const {
        handleSubmit,
        defineField,
        isSubmitting,
        errors,
    } = useForm({
        validationSchema: toTypedSchema(LoginSchema),
        initialValues: {
            customerEmail: '',
            customerPassword: '',
        }
    });

    const onSubmit = handleSubmit(async values => {
        const { data } = await axios.post(
            '/api/auth/sign-in',
            {
                email: values.customerEmail,
                password: values.customerPassword,
            },
            {
                withCredentials: true,
            }
        );
        console.log(data);
    });

    return {
        onSubmit,
        defineField,
        isSubmitting,
        errors,
    };
}

export { useLogin };
