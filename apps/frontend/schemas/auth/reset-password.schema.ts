import * as zod from 'zod'

export const resetPasswordSchema = zod.object({
    email: zod.string().email()
});
export type TypeResetPasswordSchema = zod.infer<typeof resetPasswordSchema>;