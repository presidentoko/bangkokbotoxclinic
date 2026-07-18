export function JsonLd({ data }: { data: unknown }) {
  // Scraped product names/descriptions can contain "</script>" — escape it so
  // injected text can't close the tag early and break out into raw HTML/JS.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: json }} />;
}
