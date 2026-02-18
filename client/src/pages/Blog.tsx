import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag, Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/i18n";
import { MOCK_BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from "@/lib/blogData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

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

export default function Blog() {
  const { t, locale: lang } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return MOCK_BLOG_POSTS.filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      const title = getLocalizedField(post, "title", lang).toLowerCase();
      const excerpt = getLocalizedField(post, "excerpt", lang).toLowerCase();
      const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || excerpt.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home */}
          <Link href="/">
            <button className="inline-flex items-center gap-2 text-sm text-[#8a8580] hover:text-[#c5a059] transition-colors mb-8">
              <ArrowLeft size={16} />
              {t.blog?.backHome || "Back to Home"}
            </button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-mono text-[#c5a059] uppercase tracking-[0.3em] mb-4">
              {t.blog?.subtitle || "Insights & Guides"}
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
              {t.blog?.title || "Investment Blog"}
            </h1>
            <p className="text-[#8a8580] text-lg max-w-2xl mx-auto">
              {t.blog?.description || "Expert insights on investing in Bali — legal guides, market analysis, and practical tips for foreign investors."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6560]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.blog?.searchPlaceholder || "Search articles..."}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#6b6560] focus:outline-none focus:border-[#c5a059]/50 transition-colors"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {BLOG_CATEGORIES.map((cat) => {
              const label = lang === "tr" ? cat.labelTr : lang === "id" ? cat.labelId : lang === "ru" ? cat.labelRu : cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#c5a059] text-black"
                      : "bg-white/5 text-[#a09a94] hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6b6560] text-lg">{t.blog?.noResults || "No articles found."}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, i) => (
                <motion.div key={post.slug} variants={fadeUp} custom={i}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={getLocalizedField(post, "title", lang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/30 text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">
                            {getCategoryLabel(post.category, lang)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-[#6b6560] mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(post.publishedAt).toLocaleDateString(lang === "tr" ? "tr-TR" : lang === "id" ? "id-ID" : lang === "ru" ? "ru-RU" : "en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>·</span>
                          <span>{post.author}</span>
                        </div>

                        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-[#c5a059] transition-colors line-clamp-2">
                          {getLocalizedField(post, "title", lang)}
                        </h3>

                        <p className="text-sm text-[#8a8580] leading-relaxed mb-4 flex-1 line-clamp-3">
                          {getLocalizedField(post, "excerpt", lang)}
                        </p>

                        <div className="flex items-center gap-2 text-[#c5a059] font-display font-semibold text-sm group-hover:gap-3 transition-all">
                          {t.blog?.readMore || "Read More"} <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
