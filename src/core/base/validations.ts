import z from 'zod';

export const stringRule = z.string().trim();
export const passwordRule = stringRule.min(8).max(55);

export const emailRule = stringRule.email();

export const nameRule = stringRule.min(2).max(55);

export const phoneEGRule = stringRule.regex(/^(010|011|012|015)[0-9]{8}$/, {
  message: 'Invalid Egyptian phone number',
});
