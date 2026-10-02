/**
 * Size tables — the maison's own size names with their approximate external
 * dimensions (width × height × depth, cm), joined to what each size resells
 * for. That join is the point of the page: "which size" is usually asked
 * alongside "which size holds its value", and nobody answers both.
 *
 * Kept to models whose dimensions are long-published and stable across
 * seasons. Where only the width is certain (it is what the size name refers
 * to for Hermès), only the width is given — a guessed depth is worse than
 * none.
 */
export interface SizeRow {
  size: string
  dims: string
  /** chicpreowned value-page slug, when that size has resale data. */
  value?: string
}

export interface SizeFamily { family: string; note?: string; rows: SizeRow[] }

export const SIZE_GUIDES: Record<string, { brand: string; intro: string; families: SizeFamily[] }> = {
  chanel: {
    brand: 'Chanel',
    intro: 'Chanel names its flap sizes by name (Mini, Small, Medium, Jumbo), while resellers often use the old inch shorthand — a Medium is the "Classic 10".',
    families: [
      {
        family: 'Classic Flap (11.12)',
        note: 'Medium is also sold as "Medium/Large" or "M/L".',
        rows: [
          { size: 'Mini (square)', dims: '17 × 13 × 7', value: 'chanel-classic-flap-mini' },
          { size: 'Mini (rectangular)', dims: '20 × 12 × 6', value: 'chanel-mini-rectangular-flap' },
          { size: 'Small', dims: '23 × 14.5 × 6', value: 'chanel-classic-flap-small' },
          { size: 'Medium', dims: '25.5 × 15.5 × 6.5', value: 'chanel-classic-flap-medium' },
          { size: 'Jumbo', dims: '30 × 20 × 10', value: 'chanel-classic-flap-jumbo' },
        ],
      },
    ],
  },
  hermes: {
    brand: 'Hermès',
    intro: 'For the Birkin, Kelly and Constance the number in the name is the width in centimetres — a Birkin 30 is about 30 cm wide.',
    families: [
      {
        family: 'Birkin',
        rows: [
          { size: 'Birkin 25', dims: '25 × 20 × 13', value: 'hermes-birkin-25' },
          { size: 'Birkin 30', dims: '30 × 22 × 16', value: 'hermes-birkin-30' },
          { size: 'Birkin 35', dims: '35 × 25 × 18', value: 'hermes-birkin-35' },
          { size: 'Birkin 40', dims: '40 × 30 × 21' },
        ],
      },
      {
        family: 'Kelly',
        note: 'Width only — height and depth differ between the Sellier (rigid) and Retourne (soft) constructions.',
        rows: [
          { size: 'Kelly 25', dims: '25 wide', value: 'hermes-kelly-25' },
          { size: 'Kelly 28', dims: '28 wide', value: 'hermes-kelly-28' },
          { size: 'Kelly 32', dims: '32 wide', value: 'hermes-kelly-32' },
        ],
      },
      {
        family: 'Constance',
        rows: [
          { size: 'Constance 18', dims: '18 wide', value: 'hermes-constance-18' },
          { size: 'Constance 24', dims: '24 wide', value: 'hermes-constance-24' },
        ],
      },
    ],
  },
  'louis-vuitton': {
    brand: 'Louis Vuitton',
    intro: 'Louis Vuitton uses BB, PM, MM and GM (small to large) for most bags, and the width in centimetres for the Speedy and Keepall.',
    families: [
      {
        family: 'Neverfull',
        rows: [
          { size: 'Neverfull PM', dims: '29 × 21 × 12' },
          { size: 'Neverfull MM', dims: '31 × 28 × 14', value: 'louis-vuitton-neverfull-mm' },
          { size: 'Neverfull GM', dims: '39 × 32 × 19', value: 'louis-vuitton-neverfull-gm' },
        ],
      },
      {
        family: 'Speedy',
        rows: [
          { size: 'Speedy 25', dims: '25 × 19 × 15', value: 'louis-vuitton-speedy-25' },
          { size: 'Speedy 30', dims: '30 × 21 × 17', value: 'louis-vuitton-speedy-30' },
          { size: 'Speedy 35', dims: '35 × 23 × 18', value: 'louis-vuitton-speedy-35' },
        ],
      },
      {
        family: 'Alma',
        rows: [
          { size: 'Alma BB', dims: '23.5 × 17.5 × 11.5', value: 'louis-vuitton-alma-bb' },
          { size: 'Alma PM', dims: '32 × 25 × 16', value: 'louis-vuitton-alma-pm' },
        ],
      },
      {
        family: 'Pochette Métis',
        rows: [{ size: 'Pochette Métis', dims: '25 × 19 × 7', value: 'louis-vuitton-pochette-metis' }],
      },
    ],
  },
}

export const SIZE_BRANDS = Object.keys(SIZE_GUIDES)
