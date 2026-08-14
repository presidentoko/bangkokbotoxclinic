import type { Lang } from "./site";
import { cityLabel } from "./site";
import { themeLabel } from "./theme-labels";
import { districtLabel } from "./district-labels";

export type Searchable = {
  name: string;
  city: string;
  district: string | null;
  themeLabels: string[];
};

// Shared by SearchBox's dropdown (against the slim search-index.json
// projection) and /[lang]/search's full results page (against full Place
// objects from places-index.json) -- both need the exact same "does this
// place match this query" rule, just applied to differently-shaped inputs.
// A place matches if the query hits its name, city, district, or any of
// its service/mood theme labels -- in whichever language the label is
// displayed in for this page, plus the raw English the data is stored in,
// so "Sukhumvit" and "타이 마사지" both find real results instead of only
// ever matching the place's own name.
export function matchesQuery(entry: Searchable, lang: Lang, needle: string): boolean {
  const haystacks = [
    entry.name,
    cityLabel(entry.city),
    entry.district ? districtLabel(entry.district, lang) : "",
    entry.district ?? "",
    ...entry.themeLabels.map((label) => themeLabel(label, lang)),
    ...entry.themeLabels,
  ];
  return haystacks.some((h) => h.toLowerCase().includes(needle));
}
