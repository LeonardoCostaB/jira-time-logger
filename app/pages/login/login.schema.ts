import z from "zod";

const LoginSchema = z.object({
    customerEmail: z.email({ message: "Insira um email válido" }).transform((email) => email.toLowerCase()),
    customerPassword: z.string(),
})

export { LoginSchema };
