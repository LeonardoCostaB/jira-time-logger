import z from "zod";

const RegisterSchema = z.object({
    name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
    lastName: z.string().min(2, "O sobrenome deve ter no mínimo 2 caracteres"),

    email: z.email("Insira um email válido").transform(email => email.toLowerCase()),
    password: z
        .string()
        .nonempty('Crie uma senha para continuar')
        .min(8, 'Password must be at least 8 characters long')
        .regex(
            /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/,
            'Siga as instruções para criar uma senha',
        ),
})

export type UserRegister = z.infer<typeof RegisterSchema>

export { RegisterSchema };
