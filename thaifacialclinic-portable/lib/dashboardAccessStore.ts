import { rcmd, makeId } from "./upstash";

const KEY = (clinicId: string) => `dash:access:${clinicId}`;

export function makeToken(): string {
  return makeId(32);
}

export async function createAccess(clinicId: string): Promise<string> {
  const token = makeToken();
  await rcmd(["SET", KEY(clinicId), token]);
  return token;
}

export async function getAccess(clinicId: string): Promise<string | null> {
  const r = await rcmd(["GET", KEY(clinicId)]);
  return typeof r === "string" ? r : null;
}

export async function revokeAccess(clinicId: string): Promise<void> {
  await rcmd(["DEL", KEY(clinicId)]);
}

export async function verifyAccess(clinicId: string, token: string): Promise<boolean> {
  if (!token) return false;
  const stored = await getAccess(clinicId);
  return stored !== null && stored === token;
}
