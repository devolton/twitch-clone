import * as zod from 'zod';

export const loginSchema = zod.object({
    login: zod.string().min(3),
    password: zod.string().min(8),
    pin:zod.string().optional()
});
export type TypeLoginSchema = zod.infer<typeof loginSchema>