import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string().min(10 , "must be atleast 10 char").max(100, " not more than 100 char"),
})