/**
 * Who publishes this site, and what it does and does not claim to be.
 *
 * Health content is held to the strictest quality bar Google applies, and this
 * property had no answer to "who is behind it": no named operator, no author
 * on any of the 119 guides, no editorial policy, and no stated limit on what
 * the site is for. Grepping the whole app for "author", "reviewed by" or any
 * clinical credential returned nothing. Meanwhile 24 hospital names in the
 * city guides turned out not to exist and ran for roughly a year before they
 * were caught (2026-08-26), which is the kind of error that bar exists to
 * punish.
 *
 * Everything here is either a verifiable fact about how the site works or an
 * honest statement of its limits. The operator's name and background are read
 * from the environment rather than written in, because inventing a person — or
 * a medical reviewer the site does not have — would be the same class of
 * mistake as the hospitals that did not exist.
 *
 * Set these in Vercel to turn the named-publisher block on:
 *   NEXT_PUBLIC_PUBLISHER_NAME      e.g. "Yunmin Kim"
 *   NEXT_PUBLIC_PUBLISHER_ROLE      e.g. "Founder and sole operator"
 *   NEXT_PUBLIC_PUBLISHER_BACKGROUND  one or two sentences, plain text
 *   NEXT_PUBLIC_PUBLISHER_LOCATION  e.g. "Bangkok, Thailand"
 *   NEXT_PUBLIC_PUBLISHER_CONTACT   a URL or an email
 *   NEXT_PUBLIC_PUBLISHER_PROFILE   a public profile URL, e.g. LinkedIn
 *
 * PROFILE is the one that does the work. A name on a page proves nothing; a
 * name that resolves to a public professional profile is checkable by a reader
 * and lands in the Person's `sameAs`, which is what schema.org has that field
 * for. It is published as given — LinkedIn serves bots a 999 and an authwall,
 * so the link cannot be read from here and nothing about its contents is
 * restated on the page.
 */

export type Publisher = {
  name: string | null;
  role: string | null;
  background: string | null;
  location: string | null;
  contact: string | null;
  profile: string | null;
};

export function publisher(): Publisher {
  const v = (k: string) => {
    const s = process.env[k];
    return s && s.trim() ? s.trim() : null;
  };
  return {
    name: v("NEXT_PUBLIC_PUBLISHER_NAME"),
    role: v("NEXT_PUBLIC_PUBLISHER_ROLE"),
    background: v("NEXT_PUBLIC_PUBLISHER_BACKGROUND"),
    location: v("NEXT_PUBLIC_PUBLISHER_LOCATION"),
    contact: v("NEXT_PUBLIC_PUBLISHER_CONTACT"),
    profile: v("NEXT_PUBLIC_PUBLISHER_PROFILE"),
  };
}

export function hasNamedPublisher(): boolean {
  return !!publisher().name;
}

/**
 * What the site is, in the words a quality rater would use. These are claims
 * the code can back up, which is why each one names the mechanism.
 */
export const EDITORIAL_POLICY: { heading: string; body: string }[] = [
  {
    heading: "Prices are machine-read from the hospital's own page, and we link to it",
    body:
      "Every price on this site was read from a published source, and 955 of the 1,001 priced packages carry the exact URL it came from. That link now sits under the price, with the date the file was built, so any figure can be checked against the hospital's own listing. Where a price could not be read, the page says the hospital publishes none rather than estimating one.",
  },
  {
    heading: "Accreditation and hospital type come from the national register, not from us",
    body:
      "Each hospital page that matches Thailand's official register shows its Ministry of Public Health hospital code, whether it is public or private, its hospital type, and its accreditation status with the certificate date — sourced from the Healthcare Accreditation Institute (Public Organisation) and, for bed counts, Bangkok Metropolitan Administration open data. 80 of our 321 listings are matched. The rest show nothing in that block rather than an implied endorsement.",
  },
  {
    heading: "Nothing on this site is paid for",
    body:
      "There are no sponsored listings, no paid placements and no affiliate commission that changes an ordering. Rankings are by price or by the stated criterion, computed from the data. Outbound links to a hospital's own booking page are marked nofollow.",
  },
  {
    heading: "This is a price and directory reference, not medical advice",
    body:
      "The site is operated by one person and no clinician reviews it. It does not recommend a test, interpret a result, or advise whether a check-up is appropriate for you — those are questions for a doctor. What it does is tell you what a hospital charges, where it is, when it opens, and whether it appears on the national register.",
  },
  {
    heading: "When we get something wrong",
    body:
      "In August 2026 a review of the city guides found 24 hospital names that do not exist; they had been published for roughly a year and were removed, and the price ranges in those guides are now labelled as not scraped. Guides carry the date they were last checked. Corrections are welcome through the contact page and are made on the page itself, not quietly.",
  },
];
