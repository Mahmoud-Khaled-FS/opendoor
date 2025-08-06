import { metadataResponse } from '../../../core/server/responses/metadataResponse';
import type { ID } from '../../../core/types/common';
import { buildUrl } from '../../../core/utils/url';
import type { User } from '../entities/user.entity';

type UserResponse = {
  id: ID;
  fullName: string;
  email?: string | null;
  avatar?: string;
  phone?: string;
  status: string;
  units?: any[];
  createdAt: Date;
  updatedAt: Date;
};

export function userResponse(user: User): UserResponse {
  let response = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar && buildUrl('/u' + user.avatar),
    status: user.status,
  };
  if (user.unitUsers) {
    response.units = user.unitUsers.isInitialized()
      ? user.unitUsers.map((u) => ({
          id: u.unit.id,
          name: u.unit.name,
          role: u.role,
        }))
      : undefined;
  }
  return response;
}
