import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "L'adresse e-mail est requise"
    }),
    password: z.string().min(1, {
        message: "Un mot de passe est requis"
    }),
    code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "L'adresse e-mail est requise"
    }),
    password: z.string().min(6, {
        message: "Un minimum de 6 caractères requis"
    }),
    name: z.string().min(3, {
        message: "Le nom est obligatoire" 
    }),
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "L'adresse email est obligatoire"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Un minimum de 6 caractères requis"
    }),
});