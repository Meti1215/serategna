import { Review } from '@/types';
import { mockReviews } from '@/data/mockReviews';
import { notificationsService } from './notificationsService';

export const reviewsService = {
  async getReviewsForWorker(workerId: string): Promise<Review[]> {
    return mockReviews.filter((r) => r.workerId === workerId);
  },

  async addReview(newReview: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const review: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isReported: false,
    };
    mockReviews.unshift(review);

    // Create notification for worker when employer submits a review
    await notificationsService.createReviewNotification(
      review.workerId,
      review.id
    );

    return review;
  },

  async reportReview(id: string, reason: string): Promise<boolean> {
    const review = mockReviews.find((r) => r.id === id);
    if (!review) return false;
    review.isReported = true;
    review.reportReason = reason;
    review.reportStatus = 'pending';
    return true;
  },

  async getReportedReviews(): Promise<Review[]> {
    return mockReviews.filter((r) => r.isReported);
  },

  async dismissReport(id: string): Promise<boolean> {
    const review = mockReviews.find((r) => r.id === id);
    if (!review) return false;
    review.isReported = false;
    review.reportStatus = 'dismissed';
    return true;
  },

  async deleteReview(id: string): Promise<boolean> {
    const index = mockReviews.findIndex((r) => r.id === id);
    if (index === -1) return false;
    mockReviews.splice(index, 1);
    return true;
  },
};
