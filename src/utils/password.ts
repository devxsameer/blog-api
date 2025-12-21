import argon2 from "argon2";

const ARGON_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(password_hash: string): Promise<string> {
  return argon2.hash(password_hash, ARGON_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<Boolean> {
  return argon2.verify(hash, password);
}
