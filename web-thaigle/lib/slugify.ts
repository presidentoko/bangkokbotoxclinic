export function toSlug(name: string, district: string): string {
  const base = district ? `${name} ${district}` : name;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeUniqueSlug(
  name: string,
  district: string,
  seen: Set<string>
): string {
  const base = toSlug(name, district);
  let slug = base;
  let i = 2;
  while (seen.has(slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  seen.add(slug);
  return slug;
}
