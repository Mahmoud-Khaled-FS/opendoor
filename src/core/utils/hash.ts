import { hash, verify } from 'argon2';

class Hash {
  public static async make(text: string): Promise<string> {
    return await hash(text);
  }

  public static async verify(hash: string, target: string): Promise<boolean> {
    return await verify(hash, target);
  }
}

export default Hash;
