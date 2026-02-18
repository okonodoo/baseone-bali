import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

const BASE_TITLE = "BaseOne Bali";

function setMetaTag(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function useSEO(props: SEOProps) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      canonicalUrl,
      noIndex,
    } = props;

    // Title
    if (title) {
      document.title = `${title} | ${BASE_TITLE}`;
    }

    // Meta description
    if (description) {
      setMetaTag("description", description);
    }

    // Keywords
    if (keywords) {
      setMetaTag("keywords", keywords);
    }

    // Robots
    if (noIndex) {
      setMetaTag("robots", "noindex, nofollow");
    }

    // Open Graph
    if (ogTitle || title) {
      setMetaTag("og:title", ogTitle || `${title} | ${BASE_TITLE}`, true);
    }
    if (ogDescription || description) {
      setMetaTag("og:description", ogDescription || description || "", true);
    }
    if (ogImage) {
      setMetaTag("og:image", ogImage, true);
    }
    if (ogUrl) {
      setMetaTag("og:url", ogUrl, true);
    }

    // Twitter
    if (ogTitle || title) {
      setMetaTag("twitter:title", ogTitle || `${title} | ${BASE_TITLE}`);
    }
    if (ogDescription || description) {
      setMetaTag("twitter:description", ogDescription || description || "");
    }
    if (ogImage) {
      setMetaTag("twitter:image", ogImage);
    }

    // Canonical
    if (canonicalUrl) {
      setCanonical(canonicalUrl);
    }
  }, [props]);
}
