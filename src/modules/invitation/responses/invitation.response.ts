import { metadataResponse } from '../../../core/server/responses/metadataResponse';
import type { Invitation } from '../entities/invitation.entity';

export function invitationResponse(invitation: Invitation) {
  return {
    id: invitation.id,
    token: invitation.token,
    status: invitation.status,
    type: invitation.type,
    totalScanCount: invitation.totalScanCount,
    usedScanCount: invitation.scanCount,
    startAt: invitation.startAt?.toISOString() ?? null,
    endAt: invitation.endAt?.toISOString() ?? null,
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
  };
}

export function invitationListResponse(invitations: Invitation[], total: number, page: number, limit: number) {
  return {
    data: invitations.map((i) => invitationResponse(i)),
    metadata: metadataResponse(total, page, limit),
  };
}
