import { NewsArticle, NewsStatus, NewsCategory } from '@/types';
import { mockNews } from '@/data/mockNews';

export const newsService = {
  async getArticles(category?: string, status: NewsStatus = 'published'): Promise<NewsArticle[]> {
    let articles = mockNews.filter((a) => a.status === status);
    if (category && category !== 'All') {
      articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    return [...articles];
  },

  async getAllArticles(): Promise<NewsArticle[]> {
    return [...mockNews];
  },

  async getArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const article = mockNews.find((a) => a.slug === slug);
    return article ? { ...article } : null;
  },

  async getArticleById(id: string): Promise<NewsArticle | null> {
    const article = mockNews.find((a) => a.id === id);
    return article ? { ...article } : null;
  },

  async getFeaturedArticle(): Promise<NewsArticle | null> {
    return mockNews.find((a) => a.isFeatured && a.status === 'published') || mockNews.find((a) => a.status === 'published') || null;
  },

  async searchArticles(query: string): Promise<NewsArticle[]> {
    const lowerQuery = query.toLowerCase();
    return mockNews.filter(
      (a) =>
        a.status === 'published' &&
        (a.title.toLowerCase().includes(lowerQuery) ||
          a.summary.toLowerCase().includes(lowerQuery) ||
          a.content.toLowerCase().includes(lowerQuery) ||
          a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
    );
  },

  async createArticle(article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsArticle> {
    const newArticle: NewsArticle = {
      ...article,
      id: `news-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockNews.unshift(newArticle);
    return newArticle;
  },

  async updateArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
    const index = mockNews.findIndex((a) => a.id === id);
    if (index === -1) return null;
    mockNews[index] = { ...mockNews[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...mockNews[index] };
  },

  async deleteArticle(id: string): Promise<boolean> {
    const index = mockNews.findIndex((a) => a.id === id);
    if (index === -1) return false;
    mockNews.splice(index, 1);
    return true;
  },

  async publishArticle(id: string): Promise<NewsArticle | null> {
    return this.updateArticle(id, { status: 'published', publishedAt: new Date().toISOString() });
  },

  async unpublishArticle(id: string): Promise<NewsArticle | null> {
    return this.updateArticle(id, { status: 'unpublished' });
  },

  async setFeaturedArticle(id: string, isFeatured: boolean): Promise<NewsArticle | null> {
    if (isFeatured) {
      // Unset all other featured articles
      for (const article of mockNews) {
        if (article.isFeatured) {
          await this.updateArticle(article.id, { isFeatured: false });
        }
      }
    }
    return this.updateArticle(id, { isFeatured });
  },
};
