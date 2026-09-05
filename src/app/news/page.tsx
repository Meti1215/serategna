'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockNews } from '@/data/mockNews';
import { Clock, ArrowRight, Sparkles, Newspaper, Search } from 'lucide-react';

const categories = [
  'All',
  'Platform Announcements',
  'Worker Rights',
  'Career Advice',
  'Job Market',
];

export default function NewsListingPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');

  const featured = mockNews.find((n) => n.isFeatured) || mockNews[0];

  const filtered = mockNews.filter((n) => {
    const matchesCat = activeCat === 'All' || n.category === activeCat;
    const matchesQuery =
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.summary.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Serategna News & Knowledge
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Employment Insights & Platform Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Stay informed on Ethiopian labor regulations, technical skills in demand, and updates
            on our phone privacy marketplace.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeCat === c
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Featured Article Hero */}
        {featured && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative min-h-[260px]">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Story
              </span>
            </div>

            <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {featured.category}
                </span>
                <Link href={`/news/${featured.slug}`}>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 hover:text-emerald-700 transition mt-2 leading-snug">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {featured.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>By {featured.author}</span>
                  <span>•</span>
                  <span>{featured.readTime}</span>
                </div>
                <Link
                  href={`/news/${featured.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                    {article.category}
                  </span>
                </div>

                <div className="p-6">
                  <Link href={`/news/${article.slug}`}>
                    <h3 className="font-bold text-slate-900 text-base hover:text-emerald-700 transition line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">{article.date}</span>
                <Link
                  href={`/news/${article.slug}`}
                  className="font-bold text-emerald-700 hover:text-emerald-800 text-xs flex items-center gap-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
