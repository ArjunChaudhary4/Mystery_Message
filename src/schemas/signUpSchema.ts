import {z} from 'zod';
export const usernameValidation = z
.string().min(2, "not more than 2 char").max(20,"not more than 20 char");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email"}),
    password: z.string().min(6, {message: "password must be at least 6 charac"})
})