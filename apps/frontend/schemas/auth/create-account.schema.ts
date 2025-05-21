import * as zod from 'zod'

export const createAccountSchema = zod.object({
    username: zod.string()
        .min(1)
        .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/),
    email: zod.string()
        .email()
        .min(3),
    password: zod.string()
        .min(8)
});
export type TypeCreateAccountSchema = zod.infer<typeof createAccountSchema>;