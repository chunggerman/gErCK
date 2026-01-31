import { query } from "../../../infra/db/pool.js";
import { encryptCBC, decryptCBC } from "./encryptionService.js";
import crypto from "crypto";

export async function createTenantFromEnv() {
  const plaintextName = process.env.TENANT_NAME;

  const encryptedName = encryptCBC(plaintextName);

  const nameHash = crypto
    .createHash("sha256")
    .update(plaintextName)
    .digest("hex");

  const result = await query(
    `INSERT INTO tenants (name, name_hash)
     VALUES ($1, $2)
     RETURNING id, name, name_hash, created_at`,
    [encryptedName, nameHash]
  );

  return {
    ...result.rows[0],
    decrypted_name: plaintextName
  };
}
