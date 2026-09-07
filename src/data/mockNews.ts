import { NewsArticle } from '@/types';

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Serategna.com Launches Digital Phone Privacy and Verified Skills Ecosystem across Ethiopia',
    slug: 'serategna-launches-phone-privacy-ecosystem',
    category: 'Platform Announcements',
    summary: 'The new marketplace safeguards blue-collar and professional workers from harassment with a privacy-first 100 ETB unlock mechanism while granting employers verified candidate histories.',
    content: `Serategna.com officially introduced its nationwide marketplace platform connecting employers, workers, and university interns under a unified trust architecture.

A pivotal breakthrough of the platform is the **Worker Phone Privacy System**. In traditional classifieds, workers' direct phone numbers are exposed to public scraping, resulting in spam and safety vulnerabilities. Serategna solves this by keeping all contact information private behind a nominal 100 ETB unlock fee, directly payable through **Telebirr, Chapa, and CBE Birr**.

Furthermore, to stimulate authentic job creation, Serategna introduced the **First-Job Rule**: Every newly registered employer who publishes their first genuine job opening receives **1 Free Worker Phone Unlock**, incentivizing employers to contribute opportunities to the community.`,
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
    author: 'Serategna Editorial Team',
    date: '2026-09-02',
    readTime: '4 min read',
    isFeatured: true,
    tags: ['Announcement', 'Privacy', 'Telebirr', 'Employment'],
    status: 'published',
    publishedAt: '2026-09-02T10:00:00Z',
    createdAt: '2026-09-02T09:30:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'news-2',
    title: 'Understanding Ethiopian Labor Law: Probation Periods and Worker Rights in 2026',
    slug: 'understanding-ethiopian-labor-law-probation-rights',
    category: 'Worker Rights',
    summary: 'A clear guide for both workers and small business employers regarding legal employment contracts, probation limits (up to 60 working days), severance rules, and safety obligations.',
    content: `Employment relationships in Ethiopia are governed by Proclamation No. 1156/2019. Whether hiring an electrician for facility maintenance or bringing on an executive driver, clear adherence to labor statutes protects both parties from costly disputes.

Key legal provisions include:
1. **Probationary Period**: Must be agreed in writing and cannot exceed sixty (60) working days.
2. **Severance & Notice**: Termination during probation requires no severance, whereas standard contract terminations require statutory notice periods.
3. **Overtime Compensation**: Work exceeding 8 hours a day or 48 hours a week must be compensated at overtime rates (1.5x up to 2.5x on public holidays).

Serategna encourages all employers to supply formal written contracts and clear job descriptions upon hiring.`,
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    author: 'Tadesse & Associates Legal Advisory',
    date: '2026-08-28',
    readTime: '6 min read',
    isFeatured: false,
    tags: ['Labor Law', 'Contracts', 'Worker Rights'],
    status: 'published',
    publishedAt: '2026-08-28T14:00:00Z',
    createdAt: '2026-08-28T13:00:00Z',
    updatedAt: '2026-08-28T14:00:00Z',
  },
  {
    id: 'news-3',
    title: 'How University Students Can Turn Summer Internships into Full-Time Tech Careers',
    slug: 'students-turn-summer-internships-into-careers',
    category: 'Career Advice',
    summary: 'Practical tips on mastering Next.js, building verifiable GitHub portfolios, and excelling during Ethiopian tech company internship programs.',
    content: `With Ethiopia's burgeoning digital economy—powered by digital payments, telecom expansion, and fintech—demand for fresh software talent has never been higher.

Students seeking internships should focus on:
- **Verifiable Code**: Employers prioritize candidate GitHub repositories with clean commits over mere theoretical GPA.
- **Modern Frameworks**: Mastering Next.js, TypeScript, and Tailwind CSS provides immediate day-one utility to startup squads.
- **Communication & Punctuality**: Technical chops get you the interview, but reliability and proactive questioning convert internships into full-time offers.`,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    author: 'Yared Mulugeta, Tech Career Coach',
    date: '2026-08-20',
    readTime: '5 min read',
    isFeatured: false,
    tags: ['Internships', 'Career Tips', 'Students', 'Software Engineering'],
    status: 'published',
    publishedAt: '2026-08-20T09:00:00Z',
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-08-20T09:00:00Z',
  },
  {
    id: 'news-4',
    title: 'Top In-Demand Technical Trades in Addis Ababa and Regional Growth Centers',
    slug: 'top-in-demand-trades-addis-ababa-regions',
    category: 'Job Market',
    summary: 'Why certified electricians, PPR pipefitters, and heavy equipment mechanics are commanding higher earnings than ever in urban construction and manufacturing hubs.',
    content: `Recent marketplace data on Serategna.com reveals strong employer demand for TVET-certified skilled trade workers. Driven by real estate developments and manufacturing parks in Hawassa, Adama, and Bole Lemi, certified tradespeople with verified employer reviews are frequently booked weeks in advance.`,
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    author: 'Ethiopian TVET Market Watch',
    date: '2026-08-15',
    readTime: '4 min read',
    isFeatured: false,
    tags: ['Trade Jobs', 'TVET', 'Economic Growth'],
    status: 'published',
    publishedAt: '2026-08-15T11:00:00Z',
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-08-15T11:00:00Z',
  },
];
