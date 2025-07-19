import z from 'zod';
import { stringRule } from '../../../core/base/validations';

export const invitationRule = z
  .object({
    type: z.enum(['one-time', 'interval']),
    startAt: z.date().optional(),
    endAt: z.date().optional(),
    totalScanCount: z.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt && data.startAt >= data.endAt) {
        return false;
      }
      return true;
    },
    {
      message: 'startAt must be before endAt',
      path: ['startAt'],
    },
  )
  .refine(
    (data) => {
      if (data.type === 'interval' && (!data.startAt || !data.endAt)) {
        return false;
      }
      return true;
    },
    {
      message: 'startAt and endAt are required for interval invitations',
      path: ['startAt'],
    },
  );

export type InvitationRule = z.infer<typeof invitationRule>;

export const scanRule = z.object({ token: stringRule, userIp: stringRule });

export type ScanRule = z.infer<typeof scanRule>;
