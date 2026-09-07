import { PhoneUnlockTransaction } from '@/types';
import { mockTransactions } from '@/data/mockReviews';
import { mockWorkers } from '@/data/mockWorkers';
import { notificationsService } from './notificationsService';

export interface UnlockParams {
  employerId: string;
  employerName: string;
  workerId: string;
  paymentMethod: 'Chapa' | 'Telebirr' | 'CBE' | 'Free First Unlock';
  isUsingFreeUnlock?: boolean;
}

export const paymentsService = {
  async getTransactions(employerId?: string): Promise<PhoneUnlockTransaction[]> {
    if (employerId) {
      return mockTransactions.filter((tx) => tx.employerId === employerId);
    }
    return [...mockTransactions];
  },

  async getTransactionById(id: string): Promise<PhoneUnlockTransaction | null> {
    return mockTransactions.find((tx) => tx.id === id) || null;
  },

  async getTotalPayments(employerId?: string): Promise<{ total: number; count: number }> {
    const transactions = employerId
      ? mockTransactions.filter((tx) => tx.employerId === employerId)
      : mockTransactions;
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    return { total, count: transactions.length };
  },

  async unlockWorkerPhone(params: UnlockParams): Promise<{ success: boolean; unmaskedPhone: string; transaction: PhoneUnlockTransaction }> {
    const worker = mockWorkers.find((w) => w.id === params.workerId);
    if (!worker) {
      throw new Error('Worker not found');
    }

    const isFree = params.isUsingFreeUnlock || params.paymentMethod === 'Free First Unlock';
    const amount = isFree ? 0 : 100;

    const transaction: PhoneUnlockTransaction = {
      id: `tx-${Date.now()}`,
      employerId: params.employerId,
      employerName: params.employerName,
      workerId: params.workerId,
      workerName: worker.fullName,
      workerProfession: worker.profession,
      unlockedPhone: worker.phone,
      amount,
      currency: 'ETB',
      paymentMethod: isFree ? 'Free First Unlock' : params.paymentMethod,
      reference: isFree
        ? `FREE-BONUS-${Math.floor(1000 + Math.random() * 9000)}`
        : `${params.paymentMethod.toUpperCase()}-TX-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Paid',
    };

    mockTransactions.unshift(transaction);

    // Create payment confirmation notification
    await notificationsService.createPaymentConfirmationNotification(
      params.employerId,
      transaction.id,
      amount
    );

    // Create phone unlock notification
    await notificationsService.createPhoneUnlockNotification(
      params.employerId,
      transaction.id
    );

    return {
      success: true,
      unmaskedPhone: worker.phone,
      transaction,
    };
  },
};
