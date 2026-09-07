import { Advertisement, AdvertisementStatus, AdvertisementLocation } from '@/types';
import { mockAdvertisements } from '@/data/mockAdvertisements';

export const advertisementsService = {
  async getAdvertisements(location?: AdvertisementLocation, status: AdvertisementStatus = 'active'): Promise<Advertisement[]> {
    const now = new Date().toISOString();
    let ads = mockAdvertisements.filter((ad) => {
      const isActive = ad.status === status && ad.startDate <= now && ad.endDate >= now;
      const matchesLocation = !location || ad.location === location;
      return isActive && matchesLocation;
    });
    return [...ads].sort((a, b) => b.priority - a.priority);
  },

  async getAllAdvertisements(): Promise<Advertisement[]> {
    return [...mockAdvertisements];
  },

  async getAdvertisementById(id: string): Promise<Advertisement | null> {
    return mockAdvertisements.find((a) => a.id === id) || null;
  },

  async createAdvertisement(advertisement: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Advertisement> {
    const newAd: Advertisement = {
      ...advertisement,
      id: `ad-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAdvertisements.unshift(newAd);
    return newAd;
  },

  async updateAdvertisement(id: string, updates: Partial<Advertisement>): Promise<Advertisement | null> {
    const index = mockAdvertisements.findIndex((a) => a.id === id);
    if (index === -1) return null;
    mockAdvertisements[index] = { ...mockAdvertisements[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...mockAdvertisements[index] };
  },

  async deleteAdvertisement(id: string): Promise<boolean> {
    const index = mockAdvertisements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    mockAdvertisements.splice(index, 1);
    return true;
  },

  async approveAdvertisement(id: string, adminId: string): Promise<Advertisement | null> {
    return this.updateAdvertisement(id, {
      status: 'active',
      isApproved: true,
      approvedBy: adminId,
      approvedAt: new Date().toISOString(),
    });
  },

  async rejectAdvertisement(id: string): Promise<Advertisement | null> {
    return this.updateAdvertisement(id, { status: 'rejected', isApproved: false });
  },

  async activateAdvertisement(id: string): Promise<Advertisement | null> {
    return this.updateAdvertisement(id, { status: 'active' });
  },

  async deactivateAdvertisement(id: string): Promise<Advertisement | null> {
    return this.updateAdvertisement(id, { status: 'inactive' });
  },
};
