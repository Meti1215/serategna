'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { newsService } from '@/services/newsService';
import { NewsArticle, NewsStatus, NewsCategory } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Clock,
} from 'lucide-react';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<NewsStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setIsLoading(true);
    const data = await newsService.getAllArticles();
    setArticles(data);
    setIsLoading(false);
  }

  const handlePublish = async (id: string) => {
    const updated = await newsService.publishArticle(id);
    if (updated) {
      setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Published', 'Article has been published successfully.', 'success');
    }
  };

  const handleUnpublish = async (id: string) => {
    const updated = await newsService.unpublishArticle(id);
    if (updated) {
      setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Unpublished', 'Article has been unpublished.', 'info');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const updated = await newsService.setFeaturedArticle(id, !currentFeatured);
    if (updated) {
      setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast(
        !currentFeatured ? 'Featured' : 'Unfeatured',
        !currentFeatured ? 'Article is now featured.' : 'Article is no longer featured.',
        'success'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const success = await newsService.deleteArticle(id);
      if (success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast('Deleted', 'Article has been deleted.', 'success');
      }
    }
  };

  const filtered = articles.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: NewsStatus) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'draft':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'unpublished':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-white">News Management</h1>
          <p className="text-xs text-slate-400">Create, edit, and manage news articles</p>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          {(['all', 'draft', 'published', 'unpublished'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                filterStatus === s
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading articles...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No articles found
                  </td>
                </tr>
              ) : (
                filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-700/50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/news/${article.id}`}
                            className="font-bold text-white hover:text-purple-400 transition line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-300">{article.category}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-300">{article.author}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(article.status)}`}
                      >
                        {article.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {article.date}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {article.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                            title="Publish"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {article.status === 'published' && (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                            title="Unpublish"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleFeatured(article.id, article.isFeatured)}
                          className={`p-2 rounded-lg transition ${
                            article.isFeatured
                              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                          title={article.isFeatured ? 'Remove Featured' : 'Make Featured'}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/news/${article.id}`}
                          className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
