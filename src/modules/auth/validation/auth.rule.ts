import z from 'zod';

import { emailRule, nameRule, passwordRule, phoneEGRule, stringRule } from '../../../core/base/validations';

export const loginRule = z.object({
  phone: phoneEGRule,
  password: passwordRule,
});

export type LoginRule = z.infer<typeof loginRule>;

export const registerRule = z.object({
  fullName: nameRule,
  phone: phoneEGRule,
  password: passwordRule,
  email: emailRule.nullable(),
});

export type RegisterRule = z.infer<typeof registerRule>;

export const refreshRule = z.object({
  refreshToken: stringRule,
});
