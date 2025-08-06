import { z } from 'zod';

export const invitationRule = z.object({
  unitName: z.string().min(1),
});

export type InvitationRule = z.infer<typeof invitationRule>;
