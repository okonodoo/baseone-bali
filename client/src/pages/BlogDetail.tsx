import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight, Share2, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n";
import { MOCK_BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from "@/lib/blogData";

function getLocalizedField(post: BlogPost, field: string, lang: string): string {
  if (lang === "en") return (post as any)[field] || "";
  const key = `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
  return (post as any)[key] || (post as any)[field] || "";
}

function getCategoryLabel(catId: string, lang: string): string {
  const cat = BLOG_CATEGORIES.find((c) => c.id === catId);
  if (!cat) return catId;
  if (lang === "tr") return cat.labelTr;
  if (lang === "id") return cat.labelId;
  if (lang === "ru") return cat.labelRu;
  return cat.label;
}

export default function BlogDetail() {
  const { t, locale: lang } = useTranslation();
  const params = useParams<{ slug: string }>();
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="font-display font-bold text-3xl mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-[#c5a059] hover:underline">
            {t.blog?.backToBlog || "Back to Blog"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = MOCK_BLOG_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug
  ).slice(0, 3);

  const content = getLocalizedField(post, "content", lang);
  const title = getLocalizedField(post, "title", lang);
  const excerpt = getLocalizedField(post, "excerpt", lang);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#c5a059] text-sm mb-6 hover:gap-3 transition-all">
              <ArrowLeft size={14} /> {t.blog?.backToBlog || "Back to Blog"}
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/30 text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">
                {getCategoryLabel(post.category, lang)}
              </span>
              <span className="text-xs text-[#6b6560] flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.publishedAt).toLocaleDateString(
                  lang === "tr" ? "tr-TR" : lang === "id" ? "id-ID" : lang === "ru" ? "ru-RU" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4 leading-tight">
              {title}
            </h1>

            <p className="text-[#8a8580] text-lg mb-6">{excerpt}</p>

            <div className="flex items-center gap-4 pb-8 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#c5a059]/20 flex items-center justify-center">
                <User size={18} className="text-[#c5a059]" />
              </div>
              <div>
                <p className="text-sm font-medium">{post.author}</p>
                <p className="text-xs text-[#6b6560]">BaseOne Bali</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
          >
            <img src={post.image} alt={title} className="w-full h-64 sm:h-80 lg:h-96 object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-[#a09a94] prose-p:leading-relaxed prose-p:mb-5
              prose-strong:text-[#c5a059] prose-strong:font-semibold
              prose-ul:text-[#a09a94] prose-li:text-[#a09a94] prose-li:mb-1
              prose-a:text-[#c5a059] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-[#c5a059]/30 prose-blockquote:text-[#8a8580] prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-[#6b6560]">{t.blog?.shareArticle || "Share this article"}</p>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#a09a94] hover:bg-white/10 transition-colors"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl mb-8">
              {t.blog?.relatedArticles || "Related Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`}>
                  <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-300 h-full">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={rp.image}
                        alt={getLocalizedField(rp, "title", lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-sm mb-2 group-hover:text-[#c5a059] transition-colors line-clamp-2">
                        {getLocalizedField(rp, "title", lang)}
                      </h3>
                      <div className="flex items-center gap-2 text-[#c5a059] text-xs font-semibold group-hover:gap-3 transition-all">
                        {t.blog?.readMore || "Read More"} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function formatContent(content: string): string {
  // Convert markdown-like content to HTML
  let html = content;
  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
  // Paragraphs
  html = html.replace(/^(?!<[hul])(.*\S.*)$/gm, "<p>$1</p>");
  // Clean up
  html = html.replace(/<\/ul>\n<ul>/g, "");
  return html;
}
