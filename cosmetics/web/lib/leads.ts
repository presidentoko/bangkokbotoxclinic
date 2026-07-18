import { kvGet, kvRpush, kvLrange } from "./kv";

export interface Lead {
  email: string;
  skin: string;
  concern: string;
  budget: string;
  ts: string;
}

const LEGACY_KEY = "leads";
const LIST_KEY = "leads:list";

export async function addLead(lead: Lead): Promise<void> {
  // Append-only — no read-modify-write, so concurrent submissions can't clobber each other.
  await kvRpush(LIST_KEY, JSON.stringify(lead));
}

export async function getLeads(): Promise<Lead[]> {
  const listRaw = await kvLrange(LIST_KEY, 0, -1);
  const fromList: Lead[] = listRaw
    .map((raw) => {
      try {
        return JSON.parse(raw) as Lead;
      } catch {
        return null;
      }
    })
    .filter((l): l is Lead => l !== null);

  // Merge in any leads collected before the migration to the list format.
  const legacyRaw = await kvGet(LEGACY_KEY);
  let fromLegacy: Lead[] = [];
  if (legacyRaw) {
    try {
      const parsed: unknown = JSON.parse(legacyRaw as string);
      if (Array.isArray(parsed)) fromLegacy = parsed as Lead[];
    } catch {
      /* ignore corrupt legacy blob */
    }
  }

  return [...fromLegacy, ...fromList];
}
