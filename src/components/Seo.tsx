import { useFigure } from "../iso/figures";
import { absolute, cardAlt, notesFeed, ogImage, ogSize, seoFor, site } from "../seo";

// Head tags for one page, from its entry in src/seo.ts. React hoists <title>,
// <meta> and <link> into <head> (and swaps them on navigation); the prerender
// moves them there in the static HTML. JSON-LD stays where it is rendered,
// which search engines accept, and as a data block it needs no CSP exception.
export function Seo({ path }: { path: string }) {
  const page = seoFor(path);
  const url = absolute(path);
  const graph = { "@context": "https://schema.org", "@graph": page.schema };
  const { title, subtitle } = page.card;
  // The card's figure, for its alt text. Index pages that don't draw it load
  // it anyway (src/preload.ts), so this never suspends.
  const figure = useFigure(page.card.figure);

  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="robots" content="max-image-preview:large" />
      <link rel="canonical" href={url} />
      <link
        rel="alternate"
        type="application/atom+xml"
        title={notesFeed.title}
        href={absolute(notesFeed.path)}
      />
      <meta property="og:type" content={page.type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={subtitle ? `${title}: ${subtitle}` : title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:image" content={absolute(ogImage(path))} />
      <meta property="og:image:width" content={String(ogSize.width)} />
      <meta property="og:image:height" content={String(ogSize.height)} />
      <meta property="og:image:alt" content={cardAlt(page, figure)} />
      {page.published && <meta property="article:published_time" content={page.published} />}
      {page.published && (
        <meta property="article:modified_time" content={page.updated ?? page.published} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <script
        type="application/ld+json"
        // `<` escaped so text in the data can never close the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

// For pages that must stay out of the index (the 404).
export function NoIndex({ title }: { title: string }) {
  return (
    <>
      <title>{title}</title>
      <meta name="robots" content="noindex" />
    </>
  );
}
