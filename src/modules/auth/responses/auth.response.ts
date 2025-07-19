import { User } from '../../user/entities/user.entity';
import { userResponse } from '../../user/responses/user.response';

type AuthUserResponse = {
  user: unknown;
  accessToken: string;
  refreshToken: string;
};

export function authUserResponse(user: any, accessToken: string, refreshToken: string): AuthUserResponse {
  if (user instanceof User) user = userResponse(user);
  return {
    user,
    accessToken,
    refreshToken,
  };
}
