import { NewsArticle } from '@/types';
import { mockNews } from '@/data/mockNews';

export const newsService = {
  async getArticles(category?: string): Promise<NewsArticle[]> {
    if (category && category !== 'All') {
      return mockNews.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    return [...mockNews];
  },

  async getArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const article = mockNews.find((a) => a.slug === slug);
    return article ? { ...article } : null;
  },

  async getFeaturedArticle(): Promise<NewsArticle | null> {
    return mockNews.find((a) => a.isFeatured) || mockNews[0] || null;
  },
};
