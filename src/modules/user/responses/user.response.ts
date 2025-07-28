import type { ID } from '../../../core/types/common';
import { buildUrl } from '../../../core/utils/url';
import type { User } from '../entities/user.entity';

type UserResponse = {
  id: ID;
  fullName: string;
  email?: string | null;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
};

export function userResponse(user: User): UserResponse {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar && buildUrl('/u' + user.avatar),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
