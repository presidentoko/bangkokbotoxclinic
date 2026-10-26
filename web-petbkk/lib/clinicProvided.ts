import raw from '@/data/clinic-provided.json'

/**
 * What a clinic told us about itself after we contacted it — specialty
 * centres, equipment, branches — read from the source the clinic pointed to.
 *
 * Kept apart from everything measured (reviews, licence, prices) and labelled
 * as the clinic's own information on the page, so a reader can tell which is
 * which. It never feeds a ranking or a list: a clinic that answers our message
 * gets a fuller page, not a higher place.
 */
export interface ClinicBranch {
  name: string
  address: string
  phone?: string
  line?: string
  line_url?: string
  hours?: string
}

export interface ClinicProvided {
  confirmed: string
  source: string
  source_label: string
  summary?: string
  centers?: string[]
  equipment?: string[]
  certifications?: string[]
  specialists?: { name: string; field: string }[]
  branches?: ClinicBranch[]
  call_center?: string
}

const file = raw as { clinics: Record<string, ClinicProvided> }

export function getClinicProvided(hospitalId: string): ClinicProvided | null {
  return file.clinics[hospitalId] ?? null
}
