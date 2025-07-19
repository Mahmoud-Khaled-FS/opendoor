import z from 'zod';

import { emailRule, nameRule, passwordRule, phoneEGRule, stringRule } from '../../../core/base/validations';

export const updateUserRule = z.object({
  fullName: nameRule.optional(),
  phone: phoneEGRule.optional(),
  email: emailRule.nullable().optional(),
});

export type UpdateUserRule = z.infer<typeof updateUserRule>;

export const avatarRule = z.object({
  avatar: z.uuidv7(),
});
