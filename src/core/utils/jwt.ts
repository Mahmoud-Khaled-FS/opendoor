import { verify, sign, decode } from 'hono/jwt';

// TODO (MAHMOUD) - improve jwt algorithm and hash key
class JWT {
  public static async make<T extends {}>(payload: T, privateKey: string, exp: number): Promise<string> {
    console.log(exp);
    const jwtPayload = {
      ...payload,
      exp,
      iat: Math.floor(Date.now() / 1000),
    };
    return await sign(jwtPayload, privateKey, 'RS256');
  }

  public static async verify<T extends {}>(token: string, publicKey: string): Promise<T> {
    return (await verify(token, publicKey, 'RS256')) as T;
  }
}

export default JWT;
