import type { Invitation } from '../entities/invitation.entity';

export function invitationResponse(invitation: Invitation) {
  return {
    id: invitation.id,
    token: invitation.token,
    status: invitation.status,
    type: invitation.type,
    totalScanCount: invitation.totalScanCount,
    usedScanCount: invitation.scanCount,
    compoundId: invitation.compoundId,
    startAt: invitation.startAt?.toISOString() ?? null,
    endAt: invitation.endAt?.toISOString() ?? null,
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
  };
}
